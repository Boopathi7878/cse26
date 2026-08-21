import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Linkedin, MapPin, Briefcase } from "lucide-react";

interface Alumni {
  id: string;
  name: string;
  batch_year: number;
  current_position: string;
  company: string;
  location: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  achievements: string[];
}

export default function Alumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const { data, error } = await supabase
        .from("alumni")
        .select("*")
        .order("batch_year", { ascending: false });

      if (error) throw error;
      setAlumni(data || []);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Loading alumni...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            Our Alumni
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the inspiring graduates who are making their mark in the tech industry and beyond
          </p>
        </div>

        {/* Alumni Grid */}
        {alumni.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No alumni profiles available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alumni.map((person) => (
              <Card
                key={person.id}
                className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-emerald overflow-hidden group"
              >
                <CardHeader className="p-0">
                  <div className="relative h-64 bg-gradient-emerald-subtle overflow-hidden">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-2xl font-heading mb-1">
                        {person.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Batch {person.batch_year}
                      </Badge>
                    </div>
                    {person.linkedin_url && (
                      <a
                        href={person.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {person.current_position} at {person.company}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{person.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {person.bio}
                  </p>

                  {person.achievements && person.achievements.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {person.achievements.slice(0, 2).map((achievement, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start"
                          >
                            <span className="text-primary mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
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
}
