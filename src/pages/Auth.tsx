import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, Lock, UserPlus, LogIn } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateSecretCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await supabase
      .from("signup_codes")
      .select("code")
      .eq("code", cleanCode)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate secret code first
      const isValid = await validateSecretCode(secretCode);
      if (!isValid) {
        toast({
          title: "Invalid Secret Code",
          description: "The secret code you entered is not valid or inactive.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          setIsSignUp(false);
          return;
        }
        throw error;
      }

      // Check if user was created (auto-confirm enabled)
      if (data.session) {
        toast({
          title: "Welcome!",
          description: "Your account has been created and you are now signed in.",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created. You can now sign in.",
        });
        setIsSignUp(false);
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Welcome Back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-emerald-subtle flex items-center justify-center px-4 pt-24 pb-16">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border shadow-emerald">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-emerald rounded-2xl flex items-center justify-center mx-auto shadow-glow">
            {isSignUp ? (
              <UserPlus className="h-10 w-10 text-white" />
            ) : (
              <Shield className="h-10 w-10 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-3xl font-heading">
              {isSignUp ? "Create Account" : "Admin Login"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isSignUp
                ? "Enter your details and secret code to sign up"
                : "Sign in to access the admin dashboard"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@avs.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-background border-border text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 bg-background border-border text-base"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="secretCode" className="text-base">Secret Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="secretCode"
                    type="text"
                    placeholder="Enter the secret code"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background border-border text-base"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-emerald hover:opacity-90 text-white text-base font-semibold group"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              {isSignUp ? (
                <UserPlus className="ml-2 h-5 w-5" />
              ) : (
                <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary-light"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Secure Authentication:</strong> 
                {isSignUp 
                  ? " You need a valid secret code from an administrator to create an account."
                  : " Your credentials are encrypted and secure."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
