import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/avs-logo.png"
                alt="AVS Engineering College Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div>
                <div className="font-heading font-bold text-foreground">CSE Department</div>
                <div className="text-xs text-muted-foreground">AVS Engineering College</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering future innovators through excellence in computer science education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Faculty", path: "/faculty" },
                { label: "Alumni", path: "/alumni" },
                { label: "Events", path: "/events" },
                { label: "Resources", path: "/resources" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Department of CSE</p>
              <p>AVS Engineering College</p>
              <p>Email:info@avsenggcollege.ac.in,</p>
              <p>Phone: +91 944 270 0201</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AVS Engineering College - CSE Department. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Developed with</span>
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span>by</span>
            <span className="font-semibold text-primary">TECH AURA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
