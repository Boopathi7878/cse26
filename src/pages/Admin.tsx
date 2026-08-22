import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FolderOpen, Key, Users, GraduationCap, KeyRound } from "lucide-react";
import { EventManagement } from "@/components/EventManagement";
import { ResourceManagement } from "@/components/ResourceManagement";
import { SignupCodeManagement } from "@/components/SignupCodeManagement";
import { FacultyManagement } from "@/components/FacultyManagement";
import { AlumniManagement } from "@/components/AlumniManagement";
import { AccountSettings } from "@/components/AccountSettings";
interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
}

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

interface SignupCode {
  id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

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

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [signupCodes, setSignupCodes] = useState<SignupCode[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Contact an administrator.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchEvents();
      fetchResources();
      fetchSignupCodes();
      fetchFaculty();
      fetchAlumni();
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const fetchSignupCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("signup_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSignupCodes(data || []);
    } catch (error) {
      console.error("Error fetching signup codes:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFaculty(data || []);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content for the CSE Department</p>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <div className="overflow-x-auto pb-2 mb-6 scrollbar-none">
            <TabsList className="inline-flex w-full min-w-[600px] md:min-w-full justify-between h-auto p-1.5 bg-muted/80 rounded-xl">
              <TabsTrigger value="events" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <FolderOpen className="h-4 w-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <Users className="h-4 w-4" />
                <span>Faculty</span>
              </TabsTrigger>
              <TabsTrigger value="alumni" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <GraduationCap className="h-4 w-4" />
                <span>Alumni</span>
              </TabsTrigger>
              <TabsTrigger value="codes" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <Key className="h-4 w-4" />
                <span>Codes</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2 py-2 px-3 text-xs sm:text-sm">
                <KeyRound className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">
            <EventManagement 
              events={events} 
              onEventsChange={fetchEvents} 
              userId={user.id} 
            />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManagement 
              resources={resources} 
              onResourcesChange={fetchResources} 
              userId={user.id} 
            />
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyManagement 
              faculty={faculty} 
              onFacultyChange={fetchFaculty} 
              userId={user.id} 
            />
          </TabsContent>

          <TabsContent value="alumni">
            <AlumniManagement 
              alumni={alumni} 
              onAlumniChange={fetchAlumni} 
              userId={user.id} 
            />
          </TabsContent>

          <TabsContent value="codes">
            <SignupCodeManagement 
              codes={signupCodes} 
              onCodesChange={fetchSignupCodes} 
              userId={user.id} 
            />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings userEmail={user.email} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
