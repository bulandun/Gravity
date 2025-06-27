import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface OutputCheck {
  status: string;
}

export default function StatusDistributionChart() {
  const { data: logs, isLoading } = useQuery<OutputCheck[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 30000,
  });

  const getStatusDistribution = (data: OutputCheck[]) => {
    const counts = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Safe", value: counts.safe || 0, color: "var(--compliance-green)" },
      { name: "Flagged", value: counts.flagged || 0, color: "var(--warning-orange)" },
      { name: "Blocked", value: counts.blocked || 0, color: "var(--alert-red)" },
    ];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Output Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = logs ? getStatusDistribution(logs) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-neutral-dark">
            Output Status Distribution
          </CardTitle>
          <span className="text-sm text-gray-500">Today</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
