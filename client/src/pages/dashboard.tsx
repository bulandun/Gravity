import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/metrics/metrics-cards";
import ComplianceTrendChart from "@/components/charts/compliance-trend-chart";
import StatusDistributionChart from "@/components/charts/status-distribution-chart";
import ActivityTable from "@/components/tables/activity-table";
import ComplianceAlerts from "@/components/alerts/compliance-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Dashboard Overview" 
          subtitle="Real-time AI compliance monitoring for HIPAA & GDPR requirements" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ComplianceTrendChart />
            <StatusDistributionChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ActivityTable />
            <ComplianceAlerts />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-neutral-dark">
                    GDPR Compliance Status
                  </CardTitle>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-compliance-green bg-compliance-green bg-opacity-10">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Compliant
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Data Processing Records</span>
                    <span className="text-sm font-medium text-compliance-green">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Privacy Impact Assessments</span>
                    <span className="text-sm font-medium text-compliance-green">Up to date</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Data Subject Rights</span>
                    <span className="text-sm font-medium text-compliance-green">Implemented</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Breach Notification</span>
                    <span className="text-sm font-medium text-compliance-green">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-neutral-dark">
                    HIPAA Compliance Status
                  </CardTitle>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-compliance-green bg-compliance-green bg-opacity-10">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Compliant
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Administrative Safeguards</span>
                    <span className="text-sm font-medium text-compliance-green">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Physical Safeguards</span>
                    <span className="text-sm font-medium text-compliance-green">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Technical Safeguards</span>
                    <span className="text-sm font-medium text-compliance-green">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Business Associate Agreements</span>
                    <span className="text-sm font-medium text-warning-orange">2 pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
