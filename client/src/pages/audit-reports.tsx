import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Filter, Download, Plus, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AuditReport {
  id: number;
  timestamp: string;
  reportType: string;
  title: string;
  description: string;
  status: string;
  complianceFramework: string;
  findings: Record<string, any>;
  recommendations: string[];
  pdfPath?: string;
}

const generateReportSchema = z.object({
  reportType: z.string().min(1, "Report type is required"),
  complianceFramework: z.string().min(1, "Compliance framework is required"),
  description: z.string().optional(),
});

type GenerateReportForm = z.infer<typeof generateReportSchema>;

export default function AuditReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery<AuditReport[]>({
    queryKey: ["/api/audit-reports"],
    refetchInterval: 30000,
  });

  const generateReportMutation = useMutation({
    mutationFn: async (data: GenerateReportForm) => {
      const response = await apiRequest("POST", "/api/generate-report", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report generated",
        description: "Audit report has been generated successfully.",
      });
      setIsGenerateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/audit-reports"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<GenerateReportForm>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      reportType: "",
      complianceFramework: "",
      description: "",
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "text-compliance-green bg-compliance-green bg-opacity-10";
      case "pending":
        return "text-warning-orange bg-warning-orange bg-opacity-10";
      case "failed":
        return "text-alert-red bg-alert-red bg-opacity-10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getFrameworkColor = (framework: string) => {
    switch (framework) {
      case "HIPAA":
        return "text-medical-blue bg-medical-blue bg-opacity-10";
      case "GDPR":
        return "text-compliance-green bg-compliance-green bg-opacity-10";
      case "FDA":
        return "text-warning-orange bg-warning-orange bg-opacity-10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredReports = reports?.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFramework = frameworkFilter === "all" || 
      report.complianceFramework.toLowerCase() === frameworkFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesFramework && matchesStatus;
  }) || [];

  const onSubmit = (data: GenerateReportForm) => {
    generateReportMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <>
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Header 
            title="Audit Reports" 
            subtitle="Generate and manage compliance audit reports for HIPAA, GDPR, and other regulatory frameworks" 
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
          title="Audit Reports" 
          subtitle="Generate and manage compliance audit reports for HIPAA, GDPR, and other regulatory frameworks" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-3xl font-bold text-medical-blue mt-2">
                      {reports?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                    <FileText className="text-medical-blue w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">HIPAA Reports</p>
                    <p className="text-3xl font-bold text-compliance-green mt-2">
                      {reports?.filter(r => r.complianceFramework === "HIPAA").length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Generated</p>
                  </div>
                  <div className="w-12 h-12 bg-compliance-green bg-opacity-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-compliance-green w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">GDPR Reports</p>
                    <p className="text-3xl font-bold text-warning-orange mt-2">
                      {reports?.filter(r => r.complianceFramework === "GDPR").length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Generated</p>
                  </div>
                  <div className="w-12 h-12 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="text-warning-orange w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-3xl font-bold text-alert-red mt-2">
                      {reports?.filter(r => r.status === "pending").length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">In progress</p>
                  </div>
                  <div className="w-12 h-12 bg-alert-red bg-opacity-10 rounded-lg flex items-center justify-center">
                    <FileText className="text-alert-red w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-neutral-dark">
                  Audit Reports
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frameworks</SelectItem>
                      <SelectItem value="hipaa">HIPAA</SelectItem>
                      <SelectItem value="gdpr">GDPR</SelectItem>
                      <SelectItem value="fda">FDA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-medical-blue hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Audit Report</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="reportType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Report Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="compliance-audit">Compliance Audit</SelectItem>
                                    <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                                    <SelectItem value="privacy-impact">Privacy Impact Assessment</SelectItem>
                                    <SelectItem value="security-review">Security Review</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="complianceFramework"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Compliance Framework</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select framework" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                                    <SelectItem value="GDPR">GDPR</SelectItem>
                                    <SelectItem value="FDA">FDA</SelectItem>
                                    <SelectItem value="SOC2">SOC 2</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter report description..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsGenerateDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={generateReportMutation.isPending}
                              className="bg-medical-blue hover:bg-blue-700"
                            >
                              {generateReportMutation.isPending ? "Generating..." : "Generate"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {reports?.length === 0 
                    ? "No audit reports yet. Generate your first report to get started."
                    : "No reports found matching your criteria."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Framework</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Recommendations</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium max-w-xs">
                            <div>
                              <p className="font-semibold text-gray-900 truncate">{report.title}</p>
                              {report.description && (
                                <p className="text-sm text-gray-500 truncate">{report.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`text-xs font-medium ${getFrameworkColor(report.complianceFramework)}`}
                              variant="outline"
                            >
                              {report.complianceFramework}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {report.reportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`text-xs font-medium ${getStatusColor(report.status)}`}
                              variant="outline"
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            {report.recommendations.length}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-medical-blue">
                                View
                              </Button>
                              {report.status === "generated" && (
                                <Button variant="ghost" size="sm" className="text-compliance-green">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
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
