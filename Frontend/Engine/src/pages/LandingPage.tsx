import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code, Layout, Shield, Zap, ChevronRight, Play, MessageCircle, DollarSign, CheckCircle, Bell, Target, Users, TrendingUp, Award, Lock, Clock, Mail, Github, Twitter, Linkedin, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const engineModules = [
    { 
      title: "Identity & Auth", 
      desc: "Role-based access control with enterprise-grade security. One login, infinite possibilities.", 
      icon: Shield,
      preview: null
    },
    { 
      title: "Project Management", 
      desc: "Kanban boards, milestones, and task tracking. See progress in real-time.", 
      icon: Layout,
      preview: "/api/placeholder/400/300"
    },
    { 
      title: "Real-time Chat", 
      desc: "Context-aware messaging tied to projects. No more lost conversations.", 
      icon: MessageCircle,
      preview: null
    },
    { 
      title: "Payments & Invoicing", 
      desc: "Automated billing, subscriptions, and invoice tracking. Get paid faster.", 
      icon: DollarSign,
      preview: null
    },
    { 
      title: "Tasks & Deliverables", 
      desc: "Approval workflows and file handling built-in. Ship with confidence.", 
      icon: CheckCircle,
      preview: null
    },
    { 
      title: "Smart Notifications", 
      desc: "Stay informed across channels. Never miss what matters.", 
      icon: Bell,
      preview: null
    },
  ];

  const benefits = [
    { icon: Check, title: "One Invoice. One Platform.", desc: "No more juggling multiple subscriptions" },
    { icon: MessageCircle, title: "Unified Communication", desc: "Everything in context, nothing scattered" },
    { icon: Lock, title: "Secure Deliverables", desc: "Enterprise-grade security for your files" },
    { icon: TrendingUp, title: "Efficient Workflow", desc: "Automated processes save you hours" },
    { icon: Users, title: "World-Class Talent", desc: "Access our vetted team of experts" },
    { icon: Award, title: "Dedicated Support", desc: "We build your backbone and push you forward" },
  ];

  const testimonials = [
    {
      quote: "The Engine eliminated the chaos. Everything we need is in one place.",
      author: "Sarah Chen",
      role: "CEO, TechFlow",
      rating: 5
    },
    {
      quote: "DevignBuilds delivered our MVP in 3 weeks. The Engine made collaboration seamless.",
      author: "Marcus Rodriguez",
      role: "Founder, StartupX",
      rating: 5
    },
    {
      quote: "Finally, a platform that understands agencies. Game changer.",
      author: "Emily Watson",
      role: "Creative Director, Pixel Studio",
      rating: 5
    }
  ];

  const portfolioItems = [
    { name: "Aurum E-commerce", category: "E-commerce", image: null },
    { name: "Analytics Platform", category: "SaaS", image: null },
    { name: "Creative Agency Site", category: "Website", image: null },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold italic text-lg">D</span>
            </div>
            <span className="font-bold tracking-tight text-lg">DevignBuilds</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Engine</a>
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-foreground transition-colors">Portfolio</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-foreground/80 transition-colors">Login</Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="mr-2 h-3 w-3 inline" />
              v1.0 Public Beta Now Live
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 pb-4">
              Build Better.<br/>Faster. Smoother.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              The all-in-one Service Operating System for agencies and teams. Projects, payments, communication—unified.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
             <Link to="/register">
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
                Start Building Free <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-base font-bold hover-glow">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Free 14-day trial
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-border/40 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm font-bold text-muted-foreground mb-8 uppercase tracking-widest">Trusted by Next-Gen Builders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
               <div className="flex items-center gap-2 font-bold text-xl"><Target className="h-6 w-6" /> TechFlow</div>
               <div className="flex items-center gap-2 font-bold text-xl"><Code className="h-6 w-6" /> StartupX</div>
               <div className="flex items-center gap-2 font-bold text-xl"><Layout className="h-6 w-6" /> Pixel Studio</div>
               <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6" /> VelocityLabs</div>
            </div>
        </div>
      </section>

      {/* Engine Core Modules */}
      <section id="features" className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="mb-4">The Engine</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">Modular by Design</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Enable only what you need. Every module plugs into a unified identity system. Add more as you scale.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineModules.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm h-full card-hover">
                        <CardContent className="p-8 space-y-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-black">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </CardContent>
                    </Card>
                  </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Engine Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Loved by Teams</h2>
            <p className="text-muted-foreground text-lg">See what our clients say about the Engine</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">"{testimonial.quote}"</p>
                  <div className="pt-4 border-t border-border/50">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do - Services */}
      <section id="services" className="py-24 px-6 md:px-12 bg-foreground text-background">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">We Build & Design.<br/>You Scale.</h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                DevignBuilds isn't just the Engine. We're a full-service design & development agency ready to bring your vision to life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Development Card */}
                <Card className="bg-background/5 border-white/10 backdrop-blur-sm hover:bg-background/10 transition-all card-hover">
                  <CardContent className="p-10 space-y-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Code className="h-7 w-7 text-background" />
                    </div>
                    <h3 className="text-3xl font-black">Development</h3>
                    <p className="text-background/80 text-lg leading-relaxed">
                      Full-stack web & mobile apps. From MVP to scale. React, Next.js, Node, Python, and beyond.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Badge variant="outline" className="border-background/20 text-background">React</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">Node.js</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">Python</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">AI/ML</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Design Card */}
                <Card className="bg-background/5 border-white/10 backdrop-blur-sm hover:bg-background/10 transition-all card-hover">
                  <CardContent className="p-10 space-y-6">
                    <div className="h-14 w-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <Layout className="h-7 w-7 text-background" />
                    </div>
                    <h3 className="text-3xl font-black">Design</h3>
                    <p className="text-background/80 text-lg leading-relaxed">
                      Premium UI/UX that converts. Brand identity, design systems, and motion design that stands out.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Badge variant="outline" className="border-background/20 text-background">Figma</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">Framer</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">Motion</Badge>
                      <Badge variant="outline" className="border-background/20 text-background">Branding</Badge>
                    </div>
                  </CardContent>
                </Card>
            </div>
         </div>
      </section>

      {/* Portfolio Glance */}
      <section id="portfolio" className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Work</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Recent Projects</h2>
            <p className="text-muted-foreground text-lg">A glimpse of what we've built lately</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-center space-y-2 p-6">
                      <Layout className="h-12 w-12 mx-auto text-muted-foreground/40" />
                      <p className="text-sm font-bold text-muted-foreground">Preview Coming Soon</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Why DevignBuilds?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Forget the old way. No endless invoices, scattered communication, or security concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full hover:border-primary/30 transition-all card-hover">
                  <CardContent className="p-8 space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-black">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Founder */}
      <section id="about" className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-12">
            <div>
              <Badge variant="outline" className="mb-4">Our Story</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Built by Builders</h2>
            </div>

            <div className="flex flex-col items-center space-y-8">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-2xl font-bold">JD</AvatarFallback>
              </Avatar>
              
              <div className="space-y-6 max-w-2xl">
                  <blockquote className="text-2xl md:text-3xl font-bold leading-tight text-center">
                      "We built the Engine because we were tired of stitching together 5 different tools just to run a simple project."
                  </blockquote>
                  <p className="text-lg text-muted-foreground leading-relaxed text-center">
                    After years of running client projects with scattered tools, endless invoices, and communication chaos, we decided there had to be a better way. The Engine is that way—a unified Service OS that brings everything into one place.
                  </p>
                  <div className="text-center pt-4">
                      <div className="font-black text-xl">Jane Doe</div>
                      <div className="text-muted-foreground">Founder & CEO, DevignBuilds</div>
                  </div>
              </div>
            </div>

            {/* Mission */}
            <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-border/40">
              <div className="text-center space-y-2">
                <Target className="h-8 w-8 mx-auto text-primary mb-3" />
                <h4 className="font-black">Our Mission</h4>
                <p className="text-sm text-muted-foreground">Simplify how teams build, ship, and scale projects</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-primary mb-3" />
                <h4 className="font-black">Our Team</h4>
                <p className="text-sm text-muted-foreground">Designers, developers, and dreamers from around the world</p>
              </div>
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 mx-auto text-primary mb-3" />
                <h4 className="font-black">Our Values</h4>
                <p className="text-sm text-muted-foreground">Speed, quality, and transparency in everything we do</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Ready to Build Better?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join the next generation of agencies and teams using the Engine to ship faster, smarter, and smoother.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/register">
              <Button size="lg" variant="outline" className="rounded-full px-12 h-14 text-base font-bold border-background/20 bg-background text-foreground hover:bg-background/90">
                Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="rounded-full px-12 h-14 text-base font-bold text-background hover:bg-background/10">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/40 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold italic">D</span>
                  </div>
                  <span className="font-bold tracking-tight text-lg">DevignBuilds</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Service Operating System for agencies and teams.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#portfolio" className="hover:text-foreground transition-colors">Portfolio</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <div className="flex gap-3">
                  <a href="#" className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                  © 2026 DevignBuilds. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                  <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="hover:text-foreground transition-colors">Security</a>
              </div>
            </div>
          </div>
      </footer>

    </div>
  );
}
