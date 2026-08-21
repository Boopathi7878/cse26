import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, FileText, Code, GraduationCap, Award, Lightbulb, ExternalLink } from "lucide-react";

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

const iconMap: Record<string, any> = {
  BookOpen,
  FileText,
  Code,
  GraduationCap,
  Award,
  Lightbulb,
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("display_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Loading resources...</div>
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
            Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for academic excellence and career success, all in one place
          </p>
        </div>

        {/* Resource Categories */}
        {resources.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary/50" />
            <p className="text-xl text-muted-foreground">
              Resources will be available soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {resources.map((resource) => {
              const IconComponent = iconMap[resource.icon_name] || BookOpen;
              return (
                <Card
                  key={resource.id}
                  className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-emerald group"
                >
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-emerald mb-4 group-hover:shadow-glow transition-shadow">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-heading">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <ul className="space-y-2 mb-4">
                      {resource.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-sm text-muted-foreground flex items-start"
                        >
                          <span className="text-primary mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {resource.link_url && (
                      <a href={resource.link_url} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="ghost"
                          className="mt-4 text-primary hover:text-primary-light hover:bg-primary/10 w-full group/btn"
                        >
                          Access Resources
                          <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Additional Resources Section */}
        <section className="bg-gradient-emerald-subtle rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Need More Resources?
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Can't find what you're looking for? Reach out to us and we'll help you find the right
              resources for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-emerald hover:opacity-90 text-white shadow-emerald"
              >
                Contact Faculty
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                Submit Resource Request
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

