import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  LayoutDashboard 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-in-out z-40 shadow-soft-lg",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                VISTA
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Smart MSME Manager
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(({ id, label, icon: Icon }, index) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-11 text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground hover-scale",
                  activeTab === id && "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover"
                )}
                onClick={() => {
                  onTabChange(id);
                  setIsOpen(false);
                }}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};