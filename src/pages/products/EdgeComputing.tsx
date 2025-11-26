import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Server, Zap, Shield, TrendingDown, Network, Globe } from "lucide-react";

const EdgeComputing = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: "Ultra-Low Latency",
      description: "Process data at the edge with millisecond response times"
    },
    {
      icon: TrendingDown,
      title: "Reduced Bandwidth",
      description: "Minimize data transfer costs by processing locally"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Keep sensitive data processing close to the source"
    },
    {
      icon: Network,
      title: "Distributed Architecture",
      description: "Deploy workloads across multiple edge locations"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Edge nodes in strategic locations worldwide"
    },
    {
      icon: Server,
      title: "Scalable Infrastructure",
      description: "Auto-scale resources based on demand"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {t('edgeComputing')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Process data closer to your devices for lightning-fast performance and reduced latency. 
              Deploy intelligent edge computing solutions that scale with your needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Powerful Edge Computing Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Edge Computing Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">Industrial IoT</h3>
              <p className="text-muted-foreground">
                Real-time monitoring and control of manufacturing equipment with instant feedback loops
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Cities</h3>
              <p className="text-muted-foreground">
                Process traffic data, surveillance feeds, and environmental sensors locally
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">Retail Analytics</h3>
              <p className="text-muted-foreground">
                Analyze customer behavior and inventory in real-time at store locations
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">Healthcare</h3>
              <p className="text-muted-foreground">
                Process medical device data instantly for critical patient monitoring
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Deploy Edge Computing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start processing data at the edge today and experience the performance difference
            </p>
            <Button size="lg">Start Free Trial</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default EdgeComputing;
