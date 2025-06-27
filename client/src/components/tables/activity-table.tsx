import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface AiOutputCheck {
  id: number;
  timestamp: string;
  modelName: string;
  status: string;
  riskScore: number;
}

export default function ActivityTable() {
  const { data: logs, isLoading } = useQuery<AiOutputCheck[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "safe":
        return "default";
      case "flagged":
        return "secondary";
      case "blocked":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-compliance-green bg-compliance-green bg-opacity-10";
      case "flagged":
        return "text-warning-orange bg-warning-orange bg-opacity-10";
      case "blocked":
        return "text-alert-red bg-alert-red bg-opacity-10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent AI Output Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent AI Output Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No AI output checks available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-neutral-dark">
            Recent AI Output Checks
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 10).map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="text-sm text-gray-900">
                    {new Date(check.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {check.modelName}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`text-xs font-medium ${getStatusColor(check.status)}`}
                      variant="outline"
                    >
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {check.riskScore.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                      {check.status === "blocked" ? "Investigate" : check.status === "flagged" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
