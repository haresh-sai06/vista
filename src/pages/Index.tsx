import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Package, BarChart3, Users, Smartphone } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-primary">Smart MSME Manager</h1>
            </div>
            <div className="space-x-4">
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            AI-Powered Inventory & Vendor Management
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Simplify your MSME operations with smart inventory tracking, vendor management, 
            and AI-driven insights. No hardware required - just your smartphone!
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Business</h3>
            <p className="text-xl text-muted-foreground">Built specifically for small and medium enterprises</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Smart Inventory</h4>
              <p className="text-muted-foreground">Track stock levels with QR/Barcode scanning and get AI-powered reorder recommendations</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Vendor Management</h4>
              <p className="text-muted-foreground">Manage supplier relationships with ratings, performance tracking, and smart suggestions</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Analytics & Reports</h4>
              <p className="text-muted-foreground">Real-time insights, low stock alerts, and performance analytics to drive decisions</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Mobile First</h4>
              <p className="text-muted-foreground">Works perfectly on smartphones - your workers can update inventory on the go</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8">Perfect for MSME Industries</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Textiles", "Manufacturing", "Food Processing", "FMCG", "Electronics", "Automotive", "Pharmaceuticals", "Others"].map(industry => (
              <div key={industry} className="bg-card rounded-lg p-4 shadow-sm">
                <p className="font-medium">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of MSMEs already using Smart MSME Manager</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-semibold">Smart MSME Manager</span>
          </div>
          <p className="text-muted-foreground">© 2024 Smart MSME Manager. Built for the future of small business.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
