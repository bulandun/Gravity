import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsHistory {
  timestamp: string;
  complianceScore: number;
}

export default function ComplianceTrendChart() {
  const [timeRange, setTimeRange] = useState("7");

  const { data: history, isLoading } = useQuery<MetricsHistory[]>({
    queryKey: ["/api/metrics/history", { days: timeRange }],
    refetchInterval: 60000, // Refresh every minute
  });

  const formatData = (data: MetricsHistory[]) => {
    return data.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      score: item.complianceScore,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = history ? formatData(history) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-neutral-dark">
            Compliance Score Trends
          </CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                domain={[95, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="var(--medical-blue)"
                strokeWidth={2}
                dot={{ fill: "var(--medical-blue)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--medical-blue)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
