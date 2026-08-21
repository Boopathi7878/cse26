import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, User, X } from "lucide-react";

interface Faculty {
  id: string;
  name: string;
  position: string;
  qualifications: string;
  department: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  experience_years: number | null;
  research_areas: string[] | null;
  linkedin_url: string | null;
}

interface FacultyManagementProps {
  faculty: Faculty[];
  onFacultyChange: () => void;
  userId: string;
}

export const FacultyManagement = ({ faculty, onFacultyChange, userId }: FacultyManagementProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [researchAreas, setResearchAreas] = useState("");
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
    const filePath = `faculty/${fileName}`;

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

      const researchAreasArray = researchAreas 
        ? researchAreas.split(",").map(area => area.trim()).filter(area => area !== "") 
        : null;

      const { error } = await supabase.from("faculty").insert({
        name,
        position,
        qualifications,
        department: department || null,
        email: email || null,
        phone: phone || null,
        bio: bio || null,
        image_url: imageUrl,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        research_areas: researchAreasArray,
        linkedin_url: linkedinUrl || null,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Faculty member has been added successfully.",
      });

      // Reset form
      setName("");
      setPosition("");
      setQualifications("");
      setDepartment("Computer Science & Engineering");
      setEmail("");
      setPhone("");
      setBio("");
      setExperienceYears("");
      setResearchAreas("");
      setLinkedinUrl("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      onFacultyChange();
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
      const { error } = await supabase.from("faculty").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Faculty member has been removed.",
      });

      onFacultyChange();
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
      {/* Create Faculty Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Plus className="h-5 w-5 text-primary" />
            Add Faculty Member
          </CardTitle>
          <CardDescription>Add faculty details to the department</CardDescription>
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
                placeholder="Dr. John Doe"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                placeholder="Professor, Associate Professor, etc."
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications *</Label>
              <Input
                id="qualifications"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                required
                placeholder="Ph.D., M.Tech, etc."
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@university.edu"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="10"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief biography..."
                rows={3}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="researchAreas">Research Areas (comma-separated)</Label>
              <Input
                id="researchAreas"
                value={researchAreas}
                onChange={(e) => setResearchAreas(e.target.value)}
                placeholder="Machine Learning, AI, Data Science"
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
              {submitting ? "Adding..." : "Add Faculty Member"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Faculty List */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Faculty Members</h2>
        {faculty.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground">No faculty members added yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {faculty.map((member) => (
              <Card key={member.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="font-heading text-lg">{member.name}</CardTitle>
                        <CardDescription>
                          {member.position} • {member.qualifications}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {member.email && (
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  )}
                  {member.research_areas && member.research_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.research_areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};