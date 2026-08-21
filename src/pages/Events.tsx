import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  created_at: string;
}

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data: upcoming, error: upcomingError } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", now)
        .order("event_date", { ascending: true });

      const { data: past, error: pastError } = await supabase
        .from("events")
        .select("*")
        .lt("event_date", now)
        .order("event_date", { ascending: false })
        .limit(6);

      if (upcomingError) throw upcomingError;
      if (pastError) throw pastError;

      setUpcomingEvents(upcoming || []);
      setPastEvents(past || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <Card
      className={`bg-card border-border hover:border-primary/30 transition-all hover:shadow-emerald overflow-hidden group ${
        isPast ? "opacity-75" : ""
      }`}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-emerald-subtle overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-16 w-16 text-primary/50" />
            </div>
          )}
          {isPast && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                Past Event
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-2xl font-heading mb-3">{event.title}</CardTitle>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{format(new Date(event.event_date), "PPP")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{format(new Date(event.event_date), "p")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Loading events...</div>
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
            Events & Activities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected with our vibrant community through workshops, seminars, and networking events
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold mb-8 text-foreground">
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-primary/50" />
              <p className="text-xl text-muted-foreground">
                No upcoming events scheduled. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8 text-foreground">
              Past Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
