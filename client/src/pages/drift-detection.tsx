import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TrendingUp, AlertTriangle, Users, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelDriftData {
  id: number;
  timestamp: string;
  modelName: string;
  driftScore: number;
  baselineAccuracy: number;
  currentAccuracy: number;
  dataDistributionShift: number;
}

interface BiasDetectionResult {
  id: number;
  timestamp: string;
  modelName: string;
  demographicGroup: string;
  biasScore: number;
}

export default function DriftDetection() {
  const [selectedModel, setSelectedModel] = useState("all");
  const [timeRange, setTimeRange] = useState("30");

  const { data: driftData, isLoading: driftLoading } = useQuery<ModelDriftData[]>({
    queryKey: ["/api/drift-data", { model: selectedModel === "all" ? undefined : selectedModel, days: timeRange }],
    refetchInterval: 60000,
  });

  const { data: biasData, isLoading: biasLoading } = useQuery<BiasDetectionResult[]>({
    queryKey: ["/api/bias-results", { model: selectedModel === "all" ? undefined : selectedModel, days: timeRange }],
    refetchInterval: 60000,
  });

  const formatDriftChartData = (data: ModelDriftData[]) => {
    return data.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      drift: item.driftScore,
      accuracy: item.currentAccuracy,
      modelName: item.modelName,
    }));
  };

  const formatBiasChartData = (data: BiasDetectionResult[]) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.demographicGroup]) {
        acc[item.demographicGroup] = [];
      }
      acc[item.demographicGroup].push(item.biasScore);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(grouped).map(([group, scores]) => ({
      group,
      avgBias: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      maxBias: Math.max(...scores),
    }));
  };

  const uniqueModels = Array.from(new Set(driftData?.map(d => d.modelName) || []));

  if (driftLoading || biasLoading) {
    return (
      <>
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Header 
            title="Drift & Bias Detection" 
            subtitle="Monitor model performance drift and bias detection across demographic groups" 
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
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

  const driftChartData = driftData ? formatDriftChartData(driftData) : [];
  const biasChartData = biasData ? formatBiasChartData(biasData) : [];

  const avgDrift = driftData?.reduce((sum, d) => sum + d.driftScore, 0) / (driftData?.length || 1) || 0;
  const avgBias = biasData?.reduce((sum, b) => sum + b.biasScore, 0) / (biasData?.length || 1) || 0;
  const modelsMonitored = uniqueModels.length;
  const alertsTriggered = driftData?.filter(d => d.driftScore > 3).length || 0;

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Drift & Bias Detection" 
          subtitle="Monitor model performance drift and bias detection across demographic groups" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Drift</p>
                    <p className={`text-3xl font-bold mt-2 ${
                      avgDrift > 3 ? 'text-alert-red' : 
                      avgDrift > 2 ? 'text-warning-orange' : 
                      'text-compliance-green'
                    }`}>
                      {avgDrift.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-medical-blue w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Bias Score</p>
                    <p className={`text-3xl font-bold mt-2 ${
                      avgBias > 0.7 ? 'text-alert-red' : 
                      avgBias > 0.4 ? 'text-warning-orange' : 
                      'text-compliance-green'
                    }`}>
                      {avgBias.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Across all groups</p>
                  </div>
                  <div className="w-12 h-12 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Users className="text-warning-orange w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Models Monitored</p>
                    <p className="text-3xl font-bold text-medical-blue mt-2">{modelsMonitored}</p>
                    <p className="text-xs text-gray-500 mt-1">Active monitoring</p>
                  </div>
                  <div className="w-12 h-12 bg-compliance-green bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Activity className="text-compliance-green w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Drift Alerts</p>
                    <p className="text-3xl font-bold text-alert-red mt-2">{alertsTriggered}</p>
                    <p className="text-xs text-gray-500 mt-1">Above threshold</p>
                  </div>
                  <div className="w-12 h-12 bg-alert-red bg-opacity-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-alert-red w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-neutral-dark">
                    Model Drift Over Time
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Models</SelectItem>
                        {uniqueModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={driftChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="drift" 
                        stroke="var(--alert-red)"
                        strokeWidth={2}
                        dot={{ fill: "var(--alert-red)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-neutral-dark">
                  Bias Detection by Demographic Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={biasChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="group" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <Bar 
                        dataKey="avgBias" 
                        fill="var(--warning-orange)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-neutral-dark">
                Model Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {uniqueModels.slice(0, 3).map(modelName => {
                  const modelDrift = driftData?.filter(d => d.modelName === modelName);
                  const avgModelDrift = modelDrift?.reduce((sum, d) => sum + d.driftScore, 0) / (modelDrift?.length || 1) || 0;
                  const avgAccuracy = modelDrift?.reduce((sum, d) => sum + d.currentAccuracy, 0) / (modelDrift?.length || 1) || 0;
                  
                  return (
                    <div key={modelName} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">{modelName}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Drift Score</span>
                          <span className={`text-sm font-medium ${
                            avgModelDrift > 3 ? 'text-alert-red' : 
                            avgModelDrift > 2 ? 'text-warning-orange' : 
                            'text-compliance-green'
                          }`}>
                            {avgModelDrift.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Accuracy</span>
                          <span className="text-sm font-medium text-medical-blue">
                            {avgAccuracy.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`text-sm font-medium ${
                            avgModelDrift > 3 ? 'text-alert-red' : 'text-compliance-green'
                          }`}>
                            {avgModelDrift > 3 ? 'Needs Attention' : 'Healthy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
