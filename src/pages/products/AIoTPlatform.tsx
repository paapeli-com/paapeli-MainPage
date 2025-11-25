import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cloud, Shield, Zap, Database, Network, Settings } from "lucide-react";

const AIoTPlatform = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description: "Built on scalable cloud infrastructure that grows with your business"
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Military-grade encryption for all data in transit and at rest"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Process millions of events per second with sub-millisecond latency"
    },
    {
      icon: Database,
      title: "Flexible Data Storage",
      description: "Store and query terabytes of IoT data efficiently"
    },
    {
      icon: Network,
      title: "Multi-Protocol Support",
      description: "MQTT, HTTP, CoAP, LoRaWAN, ZigBee, and more"
    },
    {
      icon: Settings,
      title: "Custom Integrations",
      description: "Easy integration with your existing systems and tools"
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
              {t('aiotPlatform')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('aiotPlatformNavDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Started Free</Button>
              <Button size="lg" variant="outline">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Ready to Transform Your IoT Infrastructure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of companies using Paapeli to build and scale their IoT solutions
          </p>
          <Button size="lg">Start Building Today</Button>
        </div>
      </section>
    </div>
  );
};

export default AIoTPlatform;
