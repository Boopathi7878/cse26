import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  user?: any;
}

export const Navigation = ({ user }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        description: "Signed out successfully",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/faculty", label: "Faculty" },
    { path: "/alumni", label: "Alumni" },
    { path: "/events", label: "Events" },
    { path: "/resources", label: "Resources" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/avs-logo.png"
              alt="AVS Engineering College Logo"
              className="w-14 h-14 object-contain"
            />
            <div className="hidden md:block">
              <div className="font-heading font-bold text-xl text-foreground leading-tight">
                CSE Department
              </div>
              <div className="text-sm text-muted-foreground">
                AVS Engineering College
              </div>
          </div>
        </Link>
        {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  className={`transition-all ${
                    isActive(link.path)
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Admin
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-gradient-emerald hover:opacity-90">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                <div
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <div className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                    Admin
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <div className="block px-4 py-2 rounded-lg bg-gradient-emerald text-white font-semibold">
                  Admin Login
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
