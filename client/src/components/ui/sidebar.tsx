import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ClipboardList, BarChart3, Settings } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarItem = ({ href, icon, children }: SidebarItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors cursor-pointer",
          isActive
            ? "bg-primary-100 text-primary-700 border-l-3 border-primary-500"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
        )}
      >
        <span className="mr-3">{icon}</span>
        {children}
      </div>
    </Link>
  );
};

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full">
      <div className="p-6 border-b border-neutral-200">
        <h1 className="text-xl font-bold text-neutral-800">LEADPILLS CRM</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <SidebarItem href="/leads" icon={<ClipboardList className="h-5 w-5" />}>
            Leads
          </SidebarItem>
          <SidebarItem href="/analytics" icon={<BarChart3 className="h-5 w-5" />}>
            Analytics
          </SidebarItem>
        </nav>
      </div>
      <div className="border-t border-neutral-200 p-3">
        <SidebarItem href="/settings" icon={<Settings className="h-5 w-5" />}>
          Settings
        </SidebarItem>
      </div>
    </div>
  );
}

export default Sidebar;
