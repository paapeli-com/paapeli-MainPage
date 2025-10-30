import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Link2, 
  Cloud, 
  Brain, 
  Building2, 
  Cog, 
  Sprout, 
  Droplet,
  ArrowRight,
  Github,
  Linkedin
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import dataFlow from "@/assets/data-flow.jpg";
import otaUpdate from "@/assets/ota-update.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build, Connect, and Manage<br />IoT Infrastructure — Intelligently.
            </h1>
            <p className="text-xl md:text-2xl text-accent mb-8 max-w-3xl mx-auto">
              Paapeli is an AI-powered IoT cloud that helps you connect devices, 
              collect insights, and control your infrastructure from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Link2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">Device Management</h3>
              <p className="text-muted-foreground">
                Connect and monitor thousands of IoT devices with full telemetry and remote control.
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Cloud className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">Cloud-Native Architecture</h3>
              <p className="text-muted-foreground">
                Built on scalable, secure cloud infrastructure — ready for industrial and smart city applications.
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Detect anomalies, predict trends, and optimize performance using real-time AI analytics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Flow Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
            From Sensor to Insight — Seamlessly.
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Paapeli securely collects data from your devices, processes it in real time, 
            and delivers actionable insights directly to your dashboard.
          </p>
          <div className="max-w-5xl mx-auto">
            <img 
              src={dataFlow} 
              alt="Data Flow Diagram" 
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            Designed for Every Industry
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Building2 className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Cities</h3>
              <p className="text-muted-foreground">
                Monitor energy usage, traffic, and environment sensors in real time.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Cog className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Industrial IoT</h3>
              <p className="text-muted-foreground">
                Connect PLCs and sensors to automate and optimize manufacturing operations.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Sprout className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Agriculture</h3>
              <p className="text-muted-foreground">
                Track soil moisture, temperature, and automate irrigation systems.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Droplet className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Energy & Oil</h3>
              <p className="text-muted-foreground">
                Monitor gas, temperature, and safety parameters remotely and securely.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* OTA Updates Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={otaUpdate} 
                alt="OTA Updates" 
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Secure Firmware Updates, Simplified.
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Manage firmware versions, sign updates, and roll out releases gradually — 
                all through a simple OTA dashboard.
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Explore OTA <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
            Visualize and Control with Ease
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Build your own dashboards, set alert rules, and manage your entire IoT network from one place.
          </p>
          <div className="max-w-6xl mx-auto mb-8">
            <img 
              src={dashboardPreview} 
              alt="Dashboard Preview" 
              className="w-full rounded-lg shadow-2xl border border-border"
            />
          </div>
          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              See Live Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Build Your IoT Cloud?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start connecting your devices and visualizing data in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
              Try Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Paapeli</h3>
              <p className="text-muted-foreground text-sm">
                AI-Powered Cloud Platform for IoT and Smart Infrastructure
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            © 2025 Paapeli. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;