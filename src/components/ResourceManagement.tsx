import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  items: string[];
  icon_name: string;
  link_url: string;
  display_order: number;
}

interface ResourceManagementProps {
  resources: Resource[];
  onResourcesChange: () => void;
  userId: string;
}

export const ResourceManagement = ({ resources, onResourcesChange, userId }: ResourceManagementProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState("");
  const [iconName, setIconName] = useState("BookOpen");
  const [linkUrl, setLinkUrl] = useState("");
  const [fileUrls, setFileUrls] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const itemsArray = items.split("\n").filter(item => item.trim() !== "");
      const fileUrlsArray = fileUrls 
        ? fileUrls.split("\n").filter(url => url.trim() !== "")
        : [];
      
      const { error } = await supabase.from("resources").insert({
        title,
        category,
        description,
        items: itemsArray,
        icon_name: iconName,
        link_url: linkUrl,
        file_urls: fileUrlsArray.length > 0 ? fileUrlsArray : null,
        created_by: userId,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Resource has been created successfully.",
      });

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setItems("");
      setIconName("BookOpen");
      setLinkUrl("");
      setFileUrls("");
      
      onResourcesChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("resources").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Resource has been deleted.",
      });

      onResourcesChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Create Resource Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Plus className="h-5 w-5 text-primary" />
            Create New Resource
          </CardTitle>
          <CardDescription>Add resources for students and faculty</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Study Materials"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Academic"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the resource..."
                rows={3}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Items (one per line)</Label>
              <Textarea
                id="items"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                required
                placeholder="Data Structures&#10;Algorithms&#10;Database Systems"
                rows={5}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iconName">Icon</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BookOpen">Book Open</SelectItem>
                  <SelectItem value="FileText">File Text</SelectItem>
                  <SelectItem value="Code">Code</SelectItem>
                  <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                  <SelectItem value="Lightbulb">Light Bulb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL (optional)</Label>
              <Input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/resources"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrls">File URLs (one per line, optional)</Label>
              <Textarea
                id="fileUrls"
                value={fileUrls}
                onChange={(e) => setFileUrls(e.target.value)}
                placeholder="https://drive.google.com/file/notes.pdf&#10;https://drive.google.com/file/paper.pdf"
                rows={4}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Add links to notes, question papers, or other files
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-emerald hover:opacity-90 text-white"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Resource"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Existing Resources</h2>
        {resources.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No resources created yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-heading">{resource.title}</CardTitle>
                      <CardDescription>{resource.category}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resource.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.items.length} items
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
