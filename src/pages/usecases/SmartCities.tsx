import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Lightbulb, Car, Wind } from "lucide-react";

const SmartCities = () => {
  const { t, isRTL } = useLanguage();

  const useCases = [
    {
      icon: Lightbulb,
      title: "Smart Lighting",
      description: "Automated street lighting with energy optimization and remote control"
    },
    {
      icon: Car,
      title: "Traffic Management",
      description: "Real-time traffic monitoring and intelligent signal control"
    },
    {
      icon: Wind,
      title: "Environmental Monitoring",
      description: "Track air quality, noise levels, and weather conditions"
    },
    {
      icon: Building2,
      title: "Smart Buildings",
      description: "Integrated building management for energy efficiency"
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
              {t('smartCities')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('smartCitiesDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Start Your Project</Button>
              <Button size="lg" variant="outline">View Case Studies</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Smart City Applications
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border">
                <useCase.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">
                  {useCase.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmartCities;
