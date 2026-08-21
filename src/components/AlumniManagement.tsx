import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Plus, Trash2, X, ExternalLink } from "lucide-react";

interface Alumni {
  id: string;
  name: string;
  batch_year: number;
  current_position: string | null;
  company: string | null;
  location: string | null;
  bio: string | null;
  achievements: string[] | null;
  linkedin_url: string | null;
  image_url: string | null;
}

interface AlumniManagementProps {
  alumni: Alumni[];
  onAlumniChange: () => void;
  userId: string;
}

export const AlumniManagement = ({ alumni, onAlumniChange, userId }: AlumniManagementProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [achievements, setAchievements] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `alumni/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("faculty-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("faculty-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const achievementsArray = achievements 
        ? achievements.split(",").map(a => a.trim()).filter(a => a !== "") 
        : null;
      
      const { error } = await supabase.from("alumni").insert({
        name,
        batch_year: parseInt(batchYear),
        current_position: currentPosition || null,
        company: company || null,
        location: location || null,
        bio: bio || null,
        achievements: achievementsArray,
        linkedin_url: linkedinUrl || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Alumni has been added successfully.",
      });

      // Reset form
      setName("");
      setBatchYear("");
      setCurrentPosition("");
      setCompany("");
      setLocation("");
      setBio("");
      setAchievements("");
      setLinkedinUrl("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      onAlumniChange();
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
      const { error } = await supabase.from("alumni").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Alumni has been deleted.",
      });

      onAlumniChange();
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
      {/* Create Alumni Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Plus className="h-5 w-5 text-primary" />
            Add New Alumni
          </CardTitle>
          <CardDescription>Add notable alumni to showcase</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchYear">Batch Year *</Label>
              <Input
                id="batchYear"
                type="number"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                required
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value)}
                placeholder="Software Engineer"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, USA"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief description about the alumni..."
                rows={3}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements (comma-separated)</Label>
              <Input
                id="achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Gold Medalist, Best Project Award"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageFile">Profile Photo</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="imageFile"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-background border-border"
                />
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-emerald hover:opacity-90 text-white"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Alumni"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Alumni List */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Existing Alumni</h2>
        {alumni.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground">No alumni added yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {alumni.map((person) => (
              <Card key={person.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {person.image_url ? (
                        <img
                          src={person.image_url}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="font-heading text-lg">{person.name}</CardTitle>
                        <CardDescription>
                          Batch {person.batch_year}
                          {person.current_position && ` • ${person.current_position}`}
                          {person.company && ` at ${person.company}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {person.linkedin_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(person.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(person.bio || person.location) && (
                  <CardContent>
                    {person.location && (
                      <p className="text-sm text-muted-foreground mb-1">📍 {person.location}</p>
                    )}
                    {person.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{person.bio}</p>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
