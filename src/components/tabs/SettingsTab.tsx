import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  company_name: string;
  industry: string;
  phone: string;
  address: string;
}

export const SettingsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    phone: "",
    address: ""
  });

  const industries = [
    "Textiles", "Manufacturing", "FMCG", "Food Processing", "Automotive", 
    "Electronics", "Pharmaceuticals", "Chemicals", "Other"
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          company_name: data.company_name || "",
          industry: data.industry || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const profileData = {
        user_id: user?.id,
        ...formData
      };

      let result;
      if (profile) {
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', user?.id);
      } else {
        result = await supabase
          .from('profiles')
          .insert([profileData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              Update your company information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select your industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter your business address"
                />
              </div>

              <Button type="submit" disabled={updating} className="w-full">
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input value={user?.email || ""} disabled />
            </div>

            <div>
              <Label>User ID</Label>
              <Input value={user?.id || ""} disabled />
            </div>

            <div>
              <Label>Account Created</Label>
              <Input 
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""} 
                disabled 
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">System Information</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Platform: VISTA</p>
                <p>Version: 1.0.0 (MVP)</p>
                <p>Last Login: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>About VISTA</CardTitle>
          <CardDescription>
            Vendor Intelligence & Smart Tracking for Automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Inventory tracking with QR/Barcode support</li>
                <li>• Smart reorder recommendations</li>
                <li>• Vendor management with ratings</li>
                <li>• Real-time analytics and reports</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Target Industries</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Textiles & Garments</li>
                <li>• Food Processing</li>
                <li>• Manufacturing</li>
                <li>• FMCG & Retail</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Technology</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React + TypeScript</li>
                <li>• Supabase Backend</li>
                <li>• Real-time Sync</li>
                <li>• Mobile Responsive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};