import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, BarChart3, Eye, Search, TrendingUp, FileText, Lightbulb } from "lucide-react";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: BarChart3 },
  { name: "Output Monitor", href: "/monitor", icon: Eye },
  { name: "Training Data Scanner", href: "/scanner", icon: Search },
  { name: "Drift & Bias Detection", href: "/drift", icon: TrendingUp },
  { name: "Audit Reports", href: "/reports", icon: FileText },
  { name: "Explainability Panel", href: "/explainability", icon: Lightbulb },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-dark">MedTech AI</h1>
            <p className="text-sm text-gray-500">Compliance Monitor</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === "/" && location === "/dashboard");
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-white bg-medical-blue"
                      : "text-gray-700 hover:bg-gray-100"
                  )}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-compliance-green rounded-full animate-pulse-slow"></div>
            <span className="text-sm font-medium text-gray-700">System Status: Healthy</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Last updated: 2 min ago</p>
        </div>
      </div>
    </div>
  );
}
