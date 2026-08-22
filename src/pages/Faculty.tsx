import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Linkedin, GraduationCap, BookOpen } from "lucide-react";

interface Faculty {
  id: string;
  name: string;
  position: string;
  department: string;
  image_url: string;
  email: string;
  phone: string;
  office_location: string;
  qualifications: string;
  experience_years: number;
  research_areas: string[];
  publications: string[];
  bio: string;
  linkedin_url: string;
  display_order: number;
}

export default function Faculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setFaculty(data || []);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Loading faculty...</div>
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
            Our Faculty
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated educators and researchers shaping the future of computer science
          </p>
        </div>

        {/* Faculty Grid */}
        {faculty.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-primary/50" />
            <p className="text-xl text-muted-foreground">
              Faculty profiles will be available soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {faculty.map((member) => (
              <Card
                key={member.id}
                className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-emerald overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Profile Image */}
                    <div className="md:col-span-1 p-6">
                      <div className="relative h-64 md:h-full bg-gradient-emerald-subtle rounded-lg overflow-hidden">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-4xl font-bold text-primary">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 p-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="font-heading text-3xl font-bold text-foreground mb-1">
                              {member.name}
                            </h2>
                            <p className="text-lg text-primary font-semibold mb-2">
                              {member.position}
                            </p>
                          </div>
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-light transition-colors"
                            >
                              <Linkedin className="h-6 w-6" />
                            </a>
                          )}
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {member.experience_years}+ Years Experience
                        </Badge>
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>
                      )}

                      {/* Qualifications */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-foreground">Qualifications</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.qualifications}</p>
                      </div>

                      {/* Research Areas */}
                      {member.research_areas && member.research_areas.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-foreground">Research Areas</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {member.research_areas.map((area, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-primary/30 text-muted-foreground"
                              >
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Publications */}
                      {member.publications && member.publications.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-foreground mb-2">
                            Recent Publications
                          </h3>
                          <ul className="space-y-1">
                            {member.publications.slice(0, 3).map((pub, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {pub}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="border-t border-border pt-4 space-y-2">
                        {member.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-primary transition-colors"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 text-primary" />
                            <a
                              href={`tel:${member.phone}`}
                              className="hover:text-primary transition-colors"
                            >
                              {member.phone}
                            </a>
                          </div>
                        )}
                        {member.office_location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>{member.office_location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
