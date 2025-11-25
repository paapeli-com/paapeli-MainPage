import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Eye, Activity } from "lucide-react";

const DDoSProtection = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === 'en' ? "Advanced DDoS Protection" : language === 'fa' ? "محافظت پیشرفته DDoS" : "حماية متقدمة من DDoS",
      description: language === 'en' ? "Protect your IoT infrastructure from distributed denial-of-service attacks" : language === 'fa' ? "زیرساخت IoT خود را از حملات انکار سرویس توزیع شده محافظت کنید" : "احمِ بنيتك التحتية لإنترنت الأشياء من هجمات حجب الخدمة الموزعة"
    },
    {
      icon: Zap,
      title: language === 'en' ? "Real-Time Detection" : language === 'fa' ? "تشخیص لحظه‌ای" : "الكشف في الوقت الفعلي",
      description: language === 'en' ? "Identify and mitigate attacks in milliseconds" : language === 'fa' ? "شناسایی و کاهش حملات در چند میلی‌ثانیه" : "التعرف على الهجمات والتخفيف منها في أجزاء من الثانية"
    },
    {
      icon: Eye,
      title: language === 'en' ? "Traffic Analysis" : language === 'fa' ? "تحلیل ترافیک" : "تحليل حركة المرور",
      description: language === 'en' ? "Monitor and analyze all network traffic patterns" : language === 'fa' ? "نظارت و تحلیل تمام الگوهای ترافیک شبکه" : "مراقبة وتحليل جميع أنماط حركة المرور على الشبكة"
    },
    {
      icon: Activity,
      title: language === 'en' ? "Always Available" : language === 'fa' ? "همیشه در دسترس" : "متاح دائمًا",
      description: language === 'en' ? "99.99% uptime guarantee with redundant infrastructure" : language === 'fa' ? "تضمین 99.99٪ زمان فعالیت با زیرساخت اضافی" : "ضمان توفر بنسبة 99.99٪ مع بنية تحتية احتياطية"
    }
  ];

  const firstOnlineText = language === 'en' 
    ? "First Online Platform with DDoS Protection" 
    : language === 'fa' 
    ? "اولین پلتفرم آنلاین با محافظت DDoS" 
    : "أول منصة عبر الإنترنت مع حماية DDoS";

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/20 rounded-full">
              <span className="text-primary font-semibold">{firstOnlineText}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {t('ddosProtection')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('ddosProtectionNavDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Protected Now</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' ? "Security Features" : language === 'fa' ? "ویژگی‌های امنیتی" : "ميزات الأمان"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            {language === 'en' ? "Secure Your IoT Infrastructure Today" : language === 'fa' ? "امروز زیرساخت IoT خود را امن کنید" : "أمّن بنيتك التحتية لإنترنت الأشياء اليوم"}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'en' ? "Don't let DDoS attacks disrupt your operations" : language === 'fa' ? "اجازه ندهید حملات DDoS عملیات شما را مختل کنند" : "لا تدع هجمات DDoS تعطل عملياتك"}
          </p>
          <Button size="lg">Start Free Trial</Button>
        </div>
      </section>
    </div>
  );
};

export default DDoSProtection;
