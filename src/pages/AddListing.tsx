import { useState } from "react";
import { ArrowLeft, Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AddListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    room_type: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just show success and navigate back
    alert("Listing created successfully! (Demo mode)");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Add New Listing</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload up to 10 photos. First photo will be the cover image.
              </p>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern Studio Near Campus"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="room_type">Room Type</Label>
                <Select
                  value={formData.room_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="1-Room">1-Room</SelectItem>
                    <SelectItem value="2-Room">2-Room</SelectItem>
                    <SelectItem value="3-Room">3-Room</SelectItem>
                    <SelectItem value="Shared">Shared Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Monthly Rent (₪)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="2500"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the apartment, amenities, neighborhood..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-24"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="address"
                    placeholder="Street address, city"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Map placeholder */}
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  📍 Pin location on map
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;