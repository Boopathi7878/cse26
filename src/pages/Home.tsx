import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, BookOpen, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-emerald-subtle opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <span className="text-primary font-semibold text-sm">
                Department of Computer Science & Engineering
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
              AVS Engineering College
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Empowering future innovators through excellence in computer science education,
              fostering a vibrant community of alumni, students, and faculty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button
                  size="lg"
                  className="bg-gradient-emerald hover:opacity-90 text-white shadow-emerald group"
                >
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/alumni">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Meet Our Alumni
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Alumni Network", value: "500+" },
              { icon: Award, label: "Excellence Awards", value: "50+" },
              { icon: Calendar, label: "Annual Events", value: "30+" },
              { icon: BookOpen, label: "Research Papers", value: "100+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:shadow-glow transition-shadow">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="font-heading text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              What We Offer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the resources and opportunities available through our department
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Alumni Network",
                description:
                  "Connect with successful graduates working at top tech companies worldwide. Share experiences, find mentors, and build lasting professional relationships.",
                icon: Users,
                link: "/alumni",
              },
              {
                title: "Upcoming Events",
                description:
                  "Stay updated with workshops, seminars, hackathons, and networking events. Engage with industry experts and enhance your skills.",
                icon: Calendar,
                link: "/events",
              },
              {
                title: "Resources Hub",
                description:
                  "Access study materials, research papers, project ideas, and career guidance. Everything you need for academic and professional success.",
                icon: BookOpen,
                link: "/resources",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card hover:bg-card/80 border-border hover:border-primary/30 transition-all hover:shadow-emerald group"
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-emerald mb-4 group-hover:shadow-glow transition-shadow">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary-light hover:bg-primary/10 p-0 h-auto font-semibold group/btn"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 bg-gradient-emerald-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Our Achievements
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Celebrating milestones and excellence in education, research, and innovation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  {
                    year: "2024",
                    title: "CSE Alumini",
                    description: "CSE Alumina currently serves as a Talent Acquisition Analyst and is involved in hiring for organizations and D,E.Shaw.",
                  },
                  {
                    year: "2025",
                    title: "Research Breakthrough",
                    description:"The Head of the CSE Department authored an academic book on Advanced Wireless Communication and Terahertz Networks.",
                  },
                  {
                    year: "2025",
                    title: "100% Placement Record",
                    description: "CSE Students secured placements at Hexaware Technologies with a salary package of 4 LPA.",
                  },
                  {
                    year: "2022",
                    title: "Innovation Hub Launch",
                    description: "Inaugurated state-of-the-art AI & Machine Learning research lab with industry partnerships.",
                  },
                  {
                    year: "2021",
                    title: "International Collaboration",
                    description: "Established research partnerships with 10+ international universities for student exchange programs.",
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`md:w-5/12 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                      <Card className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-emerald">
                        <CardContent className="p-6">
                          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-3">
                            <span className="text-primary font-bold text-sm">{achievement.year}</span>
                          </div>
                          <h3 className="font-heading text-xl font-bold mb-2 text-foreground">
                            {achievement.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-glow" />

                    {/* Spacer */}
                    <div className="hidden md:block md:w-5/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Join Our Community
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a current student, alumni, or prospective member, become part of our
              thriving CSE community.
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-gradient-emerald hover:opacity-90 text-white shadow-emerald"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
