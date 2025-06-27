import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import OutputMonitor from "@/pages/output-monitor";
import TrainingScanner from "@/pages/training-scanner";
import DriftDetection from "@/pages/drift-detection";
import AuditReports from "@/pages/audit-reports";
import Explainability from "@/pages/explainability";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/monitor" component={OutputMonitor} />
      <Route path="/scanner" component={TrainingScanner} />
      <Route path="/drift" component={DriftDetection} />
      <Route path="/reports" component={AuditReports} />
      <Route path="/explainability" component={Explainability} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex h-screen bg-surface-light">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
