import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AiOutputCheck {
  id: number;
  timestamp: string;
  modelName: string;
  inputData: string;
  outputData: string;
  status: string;
  riskScore: number;
  reasons: string[];
}

export default function OutputMonitor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: logs, isLoading } = useQuery<AiOutputCheck[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 10000,
  });

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

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.inputData.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.outputData.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <>
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Header 
            title="Output Monitor" 
            subtitle="Real-time monitoring of AI output safety checks and compliance decisions" 
          />
          <main className="flex-1 overflow-y-auto p-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Output Monitor" 
          subtitle="Real-time monitoring of AI output safety checks and compliance decisions" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-neutral-dark">
                  AI Output Checks
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No output checks found matching your criteria
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Input Preview</TableHead>
                        <TableHead>Output Preview</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Reasons</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((check) => (
                        <TableRow key={check.id}>
                          <TableCell className="text-sm text-gray-900">
                            {new Date(check.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {check.modelName}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                            {check.inputData}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                            {check.outputData}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`text-xs font-medium ${getStatusColor(check.status)}`}
                              variant="outline"
                            >
                              {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className={`font-medium ${
                              check.riskScore >= 0.8 ? 'text-alert-red' :
                              check.riskScore >= 0.5 ? 'text-warning-orange' :
                              'text-compliance-green'
                            }`}>
                              {check.riskScore.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {check.reasons.length > 0 ? (
                              <div className="max-w-xs">
                                {check.reasons.slice(0, 2).map((reason, idx) => (
                                  <div key={idx} className="text-xs">• {reason}</div>
                                ))}
                                {check.reasons.length > 2 && (
                                  <div className="text-xs text-gray-400">
                                    +{check.reasons.length - 2} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-medical-blue">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
