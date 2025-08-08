import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut 
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
        "fixed left-0 top-0 h-full w-64 bg-card border-r transform transition-transform duration-200 ease-in-out z-40",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-primary">Smart MSME Manager</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onTabChange(id);
                  setIsOpen(false);
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
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