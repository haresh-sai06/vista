import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { InventoryTab } from "@/components/tabs/InventoryTab";
import { VendorsTab } from "@/components/tabs/VendorsTab";
import { ReportsTab } from "@/components/tabs/ReportsTab";
import { SettingsTab } from "@/components/tabs/SettingsTab";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryTab />;
      case 'vendors':
        return <VendorsTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <InventoryTab />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 md:p-8">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;