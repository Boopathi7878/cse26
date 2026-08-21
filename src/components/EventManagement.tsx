import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Trash2, Upload, X } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
}

interface EventManagementProps {
  events: Event[];
  onEventsChange: () => void;
  userId: string;
}

export const EventManagement = ({ events, onEventsChange, userId }: EventManagementProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [organizer, setOrganizer] = useState("");
  const [capacity, setCapacity] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [eventType, setEventType] = useState("");
  const [tags, setTags] = useState("");

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
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("event-images")
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

      const tagsArray = tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "") : [];
      
      const { error } = await supabase.from("events").insert({
        title,
        description,
        event_date: new Date(eventDate).toISOString(),
        location,
        image_url: imageUrl,
        organizer: organizer || null,
        capacity: capacity ? parseInt(capacity) : null,
        registration_link: registrationLink || null,
        event_type: eventType || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        created_by: userId,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event has been created successfully.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setEventDate("");
      setLocation("");
      setImageFile(null);
      setImagePreview(null);
      setOrganizer("");
      setCapacity("");
      setRegistrationLink("");
      setEventType("");
      setTags("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      onEventsChange();
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
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event has been deleted.",
      });

      onEventsChange();
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
      {/* Create Event Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Plus className="h-5 w-5 text-primary" />
            Create New Event
          </CardTitle>
          <CardDescription>Add upcoming events for the department</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Tech Talk: AI in Industry"
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
                placeholder="Join us for an insightful session..."
                rows={4}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Seminar Hall, CSE Block"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageFile">Event Image (optional)</Label>
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
                  <div className="relative w-full h-32 rounded-md overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer (optional)</Label>
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="CSE Department"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (optional)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationLink">Registration Link (optional)</Label>
              <Input
                id="registrationLink"
                type="url"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                placeholder="https://forms.google.com/..."
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type (optional)</Label>
              <Input
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="Workshop, Seminar, Competition"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, Machine Learning, Career"
                className="bg-background border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-emerald hover:opacity-90 text-white"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Existing Events</h2>
        {events.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground">No events created yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-heading">{event.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(event.event_date), "PPP p")} • {event.location}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
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
