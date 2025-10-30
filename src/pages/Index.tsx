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
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import architectureDiagram from "@/assets/architecture-diagram.png";
import otaUpdate from "@/assets/ota-update.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Index = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Paapeli</div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-accent mb-8 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                {t('getStarted')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 text-lg px-8 py-6">
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            {t('keyFeatures')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Link2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t('deviceManagement')}</h3>
              <p className="text-muted-foreground">
                {t('deviceManagementDesc')}
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Cloud className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t('cloudNative')}</h3>
              <p className="text-muted-foreground">
                {t('cloudNativeDesc')}
              </p>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-to-b from-card to-muted/20">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t('aiInsights')}</h3>
              <p className="text-muted-foreground">
                {t('aiInsightsDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
            {t('dataFlowTitle')}
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('dataFlowDesc')}
          </p>
          <div className="max-w-5xl mx-auto">
            <img 
              src={architectureDiagram} 
              alt="Architecture Diagram" 
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            {t('useCasesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Building2 className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">{t('smartCities')}</h3>
              <p className="text-muted-foreground">
                {t('smartCitiesDesc')}
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Cog className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">{t('industrialIoT')}</h3>
              <p className="text-muted-foreground">
                {t('industrialIoTDesc')}
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Sprout className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">{t('smartAgriculture')}</h3>
              <p className="text-muted-foreground">
                {t('smartAgricultureDesc')}
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <Droplet className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">{t('energyOil')}</h3>
              <p className="text-muted-foreground">
                {t('energyOilDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* OTA Updates Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'md:order-2' : ''}>
              <img 
                src={otaUpdate} 
                alt="OTA Updates" 
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div className={isRTL ? 'md:order-1' : ''}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                {t('otaTitle')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('otaDesc')}
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {t('exploreOTA')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">
            {t('dashboardTitle')}
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('dashboardDesc')}
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
              {t('seeLiveDemo')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
              {t('tryDashboard')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
              {t('requestDemo')}
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
                {t('tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">{t('product')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t('home')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('docs')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">{t('resources')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t('status')}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t('contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">{t('connect')}</h4>
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
            {t('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;