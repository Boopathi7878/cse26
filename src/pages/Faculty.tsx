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
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
            Our Faculty
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated educators and researchers shaping the future of computer science
          </p>
        </div>

        {/* Faculty Grid - 3 Per Row */}
        {faculty.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-primary/50" />
            <p className="text-xl text-muted-foreground">
              Faculty profiles will be available soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member) => (
              <Card
                key={member.id}
                className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-emerald flex flex-col overflow-hidden group"
              >
                {/* Cropped Image Container */}
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-emerald-subtle flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                        <span className="text-3xl font-bold text-primary">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  {member.experience_years > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-primary font-semibold text-xs border border-primary/20 shadow-sm"
                    >
                      {member.experience_years}+ Yrs Exp
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {member.name}
                        </h2>
                        <p className="text-sm text-primary font-semibold line-clamp-1">
                          {member.position}
                        </p>
                      </div>
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="h-4 w-4 flex-shrink-0" />
                        </a>
                      )}
                    </div>

                    {/* Qualifications */}
                    {member.qualifications && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <GraduationCap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="line-clamp-1 font-medium">{member.qualifications}</span>
                      </div>
                    )}

                    {/* Bio Snippet */}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Research Areas */}
                    {member.research_areas && member.research_areas.length > 0 && (
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1 text-xs text-foreground font-semibold">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span>Research</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.research_areas.slice(0, 3).map((area, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-primary/20 text-muted-foreground bg-primary/5"
                            >
                              {area}
                            </Badge>
                          ))}
                          {member.research_areas.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{member.research_areas.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Publications */}
                    {member.publications && member.publications.length > 0 && (
                      <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-foreground">
                          Publications ({member.publications.length})
                        </h3>
                        <ul className="space-y-0.5">
                          {member.publications.slice(0, 2).map((pub, index) => (
                            <li key={index} className="text-[11px] text-muted-foreground line-clamp-1">
                              • {pub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Contact Links Footer */}
                  <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs text-muted-foreground">
                    {member.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-primary transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-primary transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                    {member.office_location && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{member.office_location}</span>
                      </div>
                    )}
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
