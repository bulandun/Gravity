import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import FileUpload from "@/components/upload/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Shield, FileText, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrainingDataScan {
  id: number;
  timestamp: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  flaggedRows: number;
  privacyRisks: number;
  biasFlags: number;
  missingDocs: number;
  status: string;
}

export default function TrainingScanner() {
  const { data: scans, isLoading } = useQuery<TrainingDataScan[]>({
    queryKey: ["/api/training-scans"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-compliance-green bg-compliance-green bg-opacity-10";
      case "processing":
        return "text-warning-orange bg-warning-orange bg-opacity-10";
      case "failed":
        return "text-alert-red bg-alert-red bg-opacity-10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Training Data Scanner" 
          subtitle="Upload and analyze training datasets for privacy risks, bias, and compliance violations" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-neutral-dark">
                    Upload Training Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <FileUpload />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-neutral-dark">
                  Scan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-medical-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Scans</p>
                      <p className="text-lg font-bold text-medical-blue">
                        {scans?.length || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-warning-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Privacy Risks Found</p>
                      <p className="text-lg font-bold text-warning-orange">
                        {scans?.reduce((sum, scan) => sum + scan.privacyRisks, 0) || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-alert-red bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-alert-red" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bias Flags</p>
                      <p className="text-lg font-bold text-alert-red">
                        {scans?.reduce((sum, scan) => sum + scan.biasFlags, 0) || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-compliance-green bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-compliance-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Compliance Rate</p>
                      <p className="text-lg font-bold text-compliance-green">94.2%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-dark">
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : !scans || scans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No training data scans yet. Upload a file to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Total Rows</TableHead>
                        <TableHead>Flagged Rows</TableHead>
                        <TableHead>Privacy Risks</TableHead>
                        <TableHead>Bias Flags</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Scanned</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scans.map((scan) => (
                        <TableRow key={scan.id}>
                          <TableCell className="font-medium">
                            {scan.fileName}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {formatFileSize(scan.fileSize)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {scan.totalRows.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className={`font-medium ${
                              scan.flaggedRows > 0 ? 'text-warning-orange' : 'text-compliance-green'
                            }`}>
                              {scan.flaggedRows.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className={`font-medium ${
                              scan.privacyRisks > 0 ? 'text-alert-red' : 'text-compliance-green'
                            }`}>
                              {scan.privacyRisks}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className={`font-medium ${
                              scan.biasFlags > 0 ? 'text-alert-red' : 'text-compliance-green'
                            }`}>
                              {scan.biasFlags}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`text-xs font-medium ${getStatusColor(scan.status)}`}
                              variant="outline"
                            >
                              {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(scan.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-medical-blue">
                              View Report
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
