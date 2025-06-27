import { Shield, AlertTriangle, TrendingUp, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsData {
  complianceScore: number;
  flaggedOutputs24h: number;
  modelDriftPercent: number;
  activeAudits: number;
}

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<MetricsData>({
    queryKey: ["/api/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No metrics data available
          </CardContent>
        </Card>
      </div>
    );
  }

  const metricsCards = [
    {
      title: "Compliance Score",
      value: `${metrics.complianceScore.toFixed(1)}%`,
      change: "+2.1% from last week",
      icon: Shield,
      iconColor: "text-compliance-green",
      bgColor: "bg-compliance-green bg-opacity-10",
    },
    {
      title: "Flagged Outputs (24h)",
      value: metrics.flaggedOutputs24h.toString(),
      change: "-15% from yesterday",
      icon: AlertTriangle,
      iconColor: "text-warning-orange",
      bgColor: "bg-warning-orange bg-opacity-10",
    },
    {
      title: "Model Drift",
      value: `${metrics.modelDriftPercent.toFixed(1)}%`,
      change: "Within acceptable range",
      icon: TrendingUp,
      iconColor: "text-medical-blue",
      bgColor: "bg-medical-blue bg-opacity-10",
    },
    {
      title: "Active Audits",
      value: metrics.activeAudits.toString(),
      change: "3 pending review",
      icon: ClipboardCheck,
      iconColor: "text-neutral-dark",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: `var(--${metric.iconColor.replace('text-', '')})` }}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.iconColor} w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
