import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, LineChart, Sparkles, MessageSquare, Award } from "lucide-react";

const IntelligenceInsight = () => {
  const { t, isRTL, language } = useLanguage();

  const isFirstOnline = language === 'fa' || language === 'ar';

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      titleFa: "پیش‌بینی با هوش مصنوعی",
      titleAr: "التنبؤات المدعومة بالذكاء الاصطناعي",
      description: "Predict device failures before they happen",
      descriptionFa: "پیش‌بینی خرابی دستگاه‌ها قبل از وقوع",
      descriptionAr: "التنبؤ بأعطال الأجهزة قبل حدوثها"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      titleFa: "تحلیل روندها",
      titleAr: "تحليل الاتجاهات",
      description: "Identify patterns and trends in your IoT data",
      descriptionFa: "شناسایی الگوها و روندها در داده‌های IoT",
      descriptionAr: "تحديد الأنماط والاتجاهات في بيانات إنترنت الأشياء"
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      titleFa: "تشخیص ناهنجاری",
      titleAr: "اكتشاف الشذوذ",
      description: "Automatically detect unusual behavior and patterns",
      descriptionFa: "تشخیص خودکار رفتارها و الگوهای غیرعادی",
      descriptionAr: "اكتشاف تلقائي للسلوك والأنماط غير العادية"
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      titleFa: "تحلیل پیشرفته",
      titleAr: "التحليلات المتقدمة",
      description: "Deep insights with customizable dashboards",
      descriptionFa: "بینش عمیق با داشبوردهای قابل تنظیم",
      descriptionAr: "رؤى عميقة مع لوحات معلومات قابلة للتخصيص"
    },
    {
      icon: MessageSquare,
      title: "AI Assistant for Executives",
      titleFa: "دستیار هوش مصنوعی برای مدیران",
      titleAr: "مساعد الذكاء الاصطناعي للمديرين",
      description: "Natural language interface for business insights",
      descriptionFa: "رابط زبان طبیعی برای بینش کسب‌وکار",
      descriptionAr: "واجهة لغة طبيعية لرؤى الأعمال"
    },
    {
      icon: Sparkles,
      title: "Automated Optimization",
      titleFa: "بهینه‌سازی خودکار",
      titleAr: "التحسين التلقائي",
      description: "AI-driven recommendations for better performance",
      descriptionFa: "توصیه‌های مبتنی بر هوش مصنوعی برای عملکرد بهتر",
      descriptionAr: "توصيات مدفوعة بالذكاء الاصطناعي لأداء أفضل"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {isFirstOnline && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
                <Award className="h-5 w-5" />
                <span className="font-semibold">
                  {language === 'fa' ? 'اولین پلتفرم آنلاین' : 'أول منصة عبر الإنترنت'}
                </span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {language === 'en' && 'Intelligence Insight'}
              {language === 'fa' && 'هوش مصنوعی'}
              {language === 'ar' && 'الذكاء الاصطناعي'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Transform your IoT data into actionable insights with AI-powered analytics. Predict failures, detect anomalies, and optimize operations automatically.'}
              {language === 'fa' && 'داده‌های IoT خود را با تحلیل‌های مبتنی بر هوش مصنوعی به بینش‌های قابل اقدام تبدیل کنید. خرابی‌ها را پیش‌بینی کنید، ناهنجاری‌ها را شناسایی کنید و عملیات را به طور خودکار بهینه کنید.'}
              {language === 'ar' && 'حوّل بيانات إنترنت الأشياء إلى رؤى قابلة للتنفيذ باستخدام التحليلات المدعومة بالذكاء الاصطناعي. تنبأ بالأعطال، واكتشف الشذوذ، وقم بتحسين العمليات تلقائيًا.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Get Started'}
                {language === 'fa' && 'شروع کنید'}
                {language === 'ar' && 'ابدأ الآن'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'Watch Demo'}
                {language === 'fa' && 'مشاهده دمو'}
                {language === 'ar' && 'شاهد العرض'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'AI-Powered Features'}
            {language === 'fa' && 'قابلیت‌های مبتنی بر هوش مصنوعی'}
            {language === 'ar' && 'الميزات المدعومة بالذكاء الاصطناعي'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {language === 'en' && feature.title}
                  {language === 'fa' && feature.titleFa}
                  {language === 'ar' && feature.titleAr}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' && feature.description}
                  {language === 'fa' && feature.descriptionFa}
                  {language === 'ar' && feature.descriptionAr}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {language === 'en' && 'Unlock AI-Powered Insights'}
              {language === 'fa' && 'بینش‌های مبتنی بر هوش مصنوعی را کشف کنید'}
              {language === 'ar' && 'اكتشف الرؤى المدعومة بالذكاء الاصطناعي'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Start leveraging AI to optimize your IoT operations today'}
              {language === 'fa' && 'همین امروز از هوش مصنوعی برای بهینه‌سازی عملیات IoT خود استفاده کنید'}
              {language === 'ar' && 'ابدأ في استخدام الذكاء الاصطناعي لتحسين عمليات إنترنت الأشياء اليوم'}
            </p>
            <Button size="lg">
              {language === 'en' && 'Start Free Trial'}
              {language === 'fa' && 'شروع دوره آزمایشی رایگان'}
              {language === 'ar' && 'ابدأ النسخة التجريبية المجانية'}
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default IntelligenceInsight;
