import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, QrCode, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  item_name: string;
  item_id: string;
  stock_count: number;
  unit: string;
  reorder_level: number;
  price_per_unit: number;
  updated_at: string;
}

export const InventoryTab = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    item_name: "",
    stock_count: "",
    unit: "pcs",
    reorder_level: "",
    price_per_unit: ""
  });

  const units = ["pcs", "kg", "ltr", "mtr", "box", "pack"];

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory items",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateItemId = (itemName: string) => {
    const prefix = itemName.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      user_id: user?.id,
      item_name: formData.item_name,
      item_id: editingItem?.item_id || generateItemId(formData.item_name),
      stock_count: parseInt(formData.stock_count),
      unit: formData.unit,
      reorder_level: parseInt(formData.reorder_level) || 10,
      price_per_unit: parseFloat(formData.price_per_unit) || 0
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('inventory')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert([itemData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Item ${editingItem ? 'updated' : 'added'} successfully`,
      });
      
      fetchInventory();
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'add'} item`,
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      stock_count: item.stock_count.toString(),
      unit: item.unit,
      reorder_level: item.reorder_level.toString(),
      price_per_unit: item.price_per_unit.toString()
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      fetchInventory();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      item_name: "",
      stock_count: "",
      unit: "pcs",
      reorder_level: "",
      price_per_unit: ""
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.stock_count <= item.reorder_level);

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your inventory items</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update item details' : 'Add a new item to your inventory'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item_name">Item Name</Label>
                <Input
                  id="item_name"
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock_count">Stock Count</Label>
                  <Input
                    id="stock_count"
                    type="number"
                    value={formData.stock_count}
                    onChange={(e) => setFormData({...formData, stock_count: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reorder_level">Reorder Level</Label>
                  <Input
                    id="reorder_level"
                    type="number"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price_per_unit">Price per Unit</Label>
                  <Input
                    id="price_per_unit"
                    type="number"
                    step="0.01"
                    value={formData.price_per_unit}
                    onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR/Barcode (Demo)
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  QR/Barcode scanning is mocked for MVP demo
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
            <CardDescription className="text-orange-600">
              {lowStockItems.length} item(s) are running low on stock
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>{item.item_id}</TableCell>
                  <TableCell>{item.stock_count}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={item.stock_count <= item.reorder_level ? "destructive" : "default"}>
                      {item.stock_count <= item.reorder_level ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {searchTerm ? "No items found matching your search" : "No inventory items yet. Add your first item!"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};