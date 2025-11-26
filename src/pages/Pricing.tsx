import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Clock, Shield } from "lucide-react";

const Pricing = () => {
  const { t, isRTL } = useLanguage();
  const [isPayAsYouGo, setIsPayAsYouGo] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: isPayAsYouGo ? "$0" : "$29",
      period: isPayAsYouGo ? "/month" : "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 10 devices",
        "1GB data storage",
        "Basic analytics",
        "Email support",
        "Community access"
      ]
    },
    {
      name: "Professional",
      price: isPayAsYouGo ? "Custom" : "$99",
      period: isPayAsYouGo ? "pricing" : "/month",
      description: "For growing businesses",
      features: [
        "Up to 100 devices",
        "10GB data storage",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom dashboards"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large scale deployments",
      features: [
        "Unlimited devices",
        "Unlimited storage",
        "AI-powered insights",
        "24/7 dedicated support",
        "On-premise deployment",
        "Custom integrations",
        "SLA guarantee"
      ]
    }
  ];

  const supportPackages = [
    {
      name: "Basic Support",
      price: "Included",
      features: [
        "Email support",
        "Community forum access",
        "Documentation",
        "48h response time"
      ]
    },
    {
      name: "Priority Support",
      price: "$299/month",
      features: [
        "Phone & email support",
        "Priority response",
        "Dedicated account manager",
        "4h response time"
      ]
    },
    {
      name: "Enterprise Support",
      price: "Custom",
      features: [
        "24/7 support",
        "Dedicated team",
        "On-site training",
        "1h response time",
        "Custom SLA"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {t('pricing')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Start free with Pay-as-you-Go pricing, or choose a plan that fits your needs
            </p>
            
            {/* Free Usage Info Section */}
            <Card className="max-w-4xl mx-auto p-8 mb-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Start Free, Scale as You Grow</h3>
                  <p className="text-muted-foreground mb-6">
                    With our Pay-as-you-Go model, you only pay for what you use. No upfront costs, no hidden fees. 
                    Perfect for startups and enterprises alike. Get started immediately with generous free tier limits.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-foreground">Instant activation - no credit card required</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-foreground">Free tier: 5 devices, 100MB storage</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-foreground">Transparent pricing with real-time monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" 
                    alt="Pricing dashboard" 
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                </div>
              </div>
            </Card>
            
            {/* Toggle between Pay-as-you-Go and Plans */}
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-full mb-8">
              <button
                onClick={() => setIsPayAsYouGo(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isPayAsYouGo 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pay-as-You-Go
              </button>
              <button
                onClick={() => setIsPayAsYouGo(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isPayAsYouGo 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Plans
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl scale-105"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>

          {/* Support Packages */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Support Packages
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportPackages.map((pkg, index) => (
                <Card key={index} className="p-6 border-border">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {pkg.name}
                  </h3>
                  <div className="text-2xl font-bold mb-4 text-primary">
                    {pkg.price}
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
