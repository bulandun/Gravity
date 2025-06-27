import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Search, AlertTriangle, CheckCircle, XCircle, ChevronRight, Lightbulb, Info } from "lucide-react";
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
  metadata: Record<string, any>;
}

export default function Explainability() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("flagged");
  const [selectedCheck, setSelectedCheck] = useState<AiOutputCheck | null>(null);

  const { data: logs, isLoading } = useQuery<AiOutputCheck[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 30000,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="w-4 h-4 text-compliance-green" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-warning-orange" />;
      case "blocked":
        return <XCircle className="w-4 h-4 text-alert-red" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: "High", color: "text-alert-red" };
    if (score >= 0.5) return { level: "Medium", color: "text-warning-orange" };
    if (score >= 0.3) return { level: "Low", color: "text-medical-blue" };
    return { level: "Minimal", color: "text-compliance-green" };
  };

  const getComplianceExplanation = (reasons: string[]) => {
    const explanations: Record<string, string> = {
      "Potential SSN detected": "Social Security Numbers are considered Protected Health Information (PHI) under HIPAA and personal data under GDPR. Exposure could result in identity theft and regulatory violations.",
      "Email address detected": "Email addresses can be used to identify individuals and are considered personal data under GDPR. They may also be PHI if linked to health information.",
      "Patient information referenced": "Any reference to patient information must comply with HIPAA's minimum necessary standard and requires proper authorization for disclosure.",
      "Medical terminology detected": "Use of medical terms may indicate processing of health information, requiring compliance with healthcare data protection regulations.",
      "Demographic information present": "Demographic data can be used for identification and may contribute to algorithmic bias if not properly handled."
    };

    return reasons.map(reason => ({
      reason,
      explanation: explanations[reason] || "This pattern has been flagged for potential compliance risks and requires review.",
    }));
  };

  const getDecisionTree = (check: AiOutputCheck) => {
    const steps = [
      {
        step: "Input Analysis",
        description: "Scan input text for sensitive patterns",
        status: "completed",
        details: `Analyzed ${check.inputData.length} characters for PHI and PII patterns`,
      },
      {
        step: "Risk Assessment",
        description: "Calculate compliance risk score",
        status: "completed",
        details: `Risk score: ${check.riskScore.toFixed(2)} (${getRiskLevel(check.riskScore).level})`,
      },
      {
        step: "Regulatory Check",
        description: "Verify against HIPAA and GDPR requirements",
        status: check.reasons.length > 0 ? "flagged" : "passed",
        details: check.reasons.length > 0 ? `${check.reasons.length} compliance issues identified` : "No regulatory violations detected",
      },
      {
        step: "Decision",
        description: "Determine final action",
        status: check.status,
        details: `Output ${check.status} based on compliance analysis`,
      },
    ];

    return steps;
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
            title="Explainability Panel" 
            subtitle="Detailed explanations and decision trees for AI compliance decisions" 
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
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
          title="Explainability Panel" 
          subtitle="Detailed explanations and decision trees for AI compliance decisions" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - AI Output List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-neutral-dark">
                    AI Output Checks
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search outputs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="safe">Safe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No AI outputs found matching your criteria
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredLogs.map((check) => (
                        <div
                          key={check.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedCheck?.id === check.id 
                              ? "border-medical-blue bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedCheck(check)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(check.status)}
                              <span className="font-medium text-sm">{check.modelName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={`text-xs ${getStatusColor(check.status)}`}
                                variant="outline"
                              >
                                {check.status}
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {check.inputData}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Risk: {check.riskScore.toFixed(2)}</span>
                            <span>{new Date(check.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Right Panel - Detailed Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-neutral-dark flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Compliance Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedCheck ? (
                  <div className="text-center py-12 text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an AI output check to view detailed explanation</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-6">
                      {/* Overview */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Overview</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(selectedCheck.status)}
                            <span className="font-medium">
                              Output {selectedCheck.status} by {selectedCheck.modelName}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Risk Level:</span>
                              <span className={`ml-2 font-medium ${getRiskLevel(selectedCheck.riskScore).color}`}>
                                {getRiskLevel(selectedCheck.riskScore).level}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Risk Score:</span>
                              <span className="ml-2 font-medium">{selectedCheck.riskScore.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Input/Output */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Input & Output Analysis</h3>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Input:</p>
                            <p className="text-sm text-gray-700">{selectedCheck.inputData}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Output:</p>
                            <p className="text-sm text-gray-700">{selectedCheck.outputData}</p>
                          </div>
                        </div>
                      </div>

                      {/* Decision Tree */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Decision Process</h3>
                        <div className="space-y-3">
                          {getDecisionTree(selectedCheck).map((step, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                step.status === "completed" ? "bg-compliance-green text-white" :
                                step.status === "flagged" ? "bg-warning-orange text-white" :
                                step.status === "blocked" ? "bg-alert-red text-white" :
                                "bg-gray-300 text-gray-600"
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{step.step}</h4>
                                <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                                <p className="text-xs text-gray-500">{step.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Compliance Issues */}
                      {selectedCheck.reasons.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Compliance Issues</h3>
                          <div className="space-y-3">
                            {getComplianceExplanation(selectedCheck.reasons).map((item, index) => (
                              <div key={index} className="border-l-4 border-warning-orange bg-orange-50 p-3 rounded-r-lg">
                                <h4 className="font-medium text-warning-orange mb-1">{item.reason}</h4>
                                <p className="text-sm text-gray-700">{item.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {selectedCheck.status === "blocked" ? (
                              <>
                                <li>• Review and sanitize input data before processing</li>
                                <li>• Implement additional data anonymization techniques</li>
                                <li>• Consider using synthetic data for training</li>
                                <li>• Ensure proper consent and authorization</li>
                              </>
                            ) : selectedCheck.status === "flagged" ? (
                              <>
                                <li>• Monitor this interaction for compliance patterns</li>
                                <li>• Consider additional review before deployment</li>
                                <li>• Document decision rationale for audit trail</li>
                                <li>• Implement additional safeguards if needed</li>
                              </>
                            ) : (
                              <>
                                <li>• Output meets compliance requirements</li>
                                <li>• Continue monitoring for pattern changes</li>
                                <li>• Maintain current safety protocols</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Regulatory Context */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Regulatory Context</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-medical-blue bg-opacity-10 p-3 rounded-lg">
                            <h4 className="font-medium text-medical-blue mb-1">HIPAA Compliance</h4>
                            <p className="text-sm text-gray-700">
                              Health Insurance Portability and Accountability Act requires protection of 
                              Protected Health Information (PHI) and implementation of minimum necessary standards.
                            </p>
                          </div>
                          <div className="bg-compliance-green bg-opacity-10 p-3 rounded-lg">
                            <h4 className="font-medium text-compliance-green mb-1">GDPR Compliance</h4>
                            <p className="text-sm text-gray-700">
                              General Data Protection Regulation mandates lawful basis for processing, 
                              data minimization, and individual rights for personal data.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
