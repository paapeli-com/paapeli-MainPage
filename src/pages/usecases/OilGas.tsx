import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, Activity, AlertTriangle, TrendingUp, Shield, Gauge } from "lucide-react";

const OilGas = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      titleFa: "نظارت بی‌درنگ",
      titleAr: "المراقبة في الوقت الفعلي",
      description: "Monitor pipelines, wells, and equipment 24/7",
      descriptionFa: "نظارت بر خطوط لوله، چاه‌ها و تجهیزات ۲۴/۷",
      descriptionAr: "مراقبة خطوط الأنابيب والآبار والمعدات على مدار الساعة"
    },
    {
      icon: AlertTriangle,
      title: "Leak Detection",
      titleFa: "تشخیص نشت",
      titleAr: "اكتشاف التسرب",
      description: "Instantly detect and locate pipeline leaks",
      descriptionFa: "تشخیص و مکان‌یابی فوری نشت در خطوط لوله",
      descriptionAr: "كشف وتحديد تسربات خطوط الأنابيب على الفور"
    },
    {
      icon: Gauge,
      title: "Pressure Monitoring",
      titleFa: "نظارت بر فشار",
      titleAr: "مراقبة الضغط",
      description: "Track pressure levels across your infrastructure",
      descriptionFa: "ردیابی سطوح فشار در زیرساخت شما",
      descriptionAr: "تتبع مستويات الضغط عبر البنية التحتية الخاصة بك"
    },
    {
      icon: Droplet,
      title: "Flow Measurement",
      titleFa: "اندازه‌گیری جریان",
      titleAr: "قياس التدفق",
      description: "Accurate flow rate measurement and analytics",
      descriptionFa: "اندازه‌گیری دقیق نرخ جریان و تحلیل",
      descriptionAr: "قياس دقيق لمعدل التدفق والتحليلات"
    },
    {
      icon: Shield,
      title: "Safety Compliance",
      titleFa: "انطباق ایمنی",
      titleAr: "الامتثال للسلامة",
      description: "Meet industry safety and regulatory standards",
      descriptionFa: "رعایت استانداردهای ایمنی و نظارتی صنعت",
      descriptionAr: "تلبية معايير السلامة والتنظيم الصناعي"
    },
    {
      icon: TrendingUp,
      title: "Predictive Maintenance",
      titleFa: "نگهداری پیش‌بینی‌کننده",
      titleAr: "الصيانة التنبؤية",
      description: "Predict equipment failures before they happen",
      descriptionFa: "پیش‌بینی خرابی تجهیزات قبل از وقوع",
      descriptionAr: "التنبؤ بأعطال المعدات قبل حدوثها"
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
              {language === 'en' && 'Oil & Gas IoT Solutions'}
              {language === 'fa' && 'راهکارهای IoT نفت و گاز'}
              {language === 'ar' && 'حلول إنترنت الأشياء للنفط والغاز'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Optimize operations, enhance safety, and reduce costs with industrial-grade IoT monitoring for oil and gas infrastructure. Monitor remote assets and prevent costly failures.'}
              {language === 'fa' && 'عملیات را بهینه کنید، ایمنی را افزایش دهید و هزینه‌ها را با نظارت IoT درجه صنعتی برای زیرساخت نفت و گاز کاهش دهید. دارایی‌های دور را نظارت کنید و از خرابی‌های پرهزینه جلوگیری کنید.'}
              {language === 'ar' && 'قم بتحسين العمليات وتعزيز السلامة وخفض التكاليف من خلال مراقبة إنترنت الأشياء الصناعية للبنية التحتية للنفط والغاز. راقب الأصول البعيدة ومنع الأعطال المكلفة.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Request Demo'}
                {language === 'fa' && 'درخواست دمو'}
                {language === 'ar' && 'طلب عرض توضيحي'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'View Case Studies'}
                {language === 'fa' && 'مشاهده مطالعات موردی'}
                {language === 'ar' && 'عرض دراسات الحالة'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Industrial-Grade Monitoring'}
            {language === 'fa' && 'نظارت درجه صنعتی'}
            {language === 'ar' && 'المراقبة الصناعية'}
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

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Why Choose Paapeli for Oil & Gas'}
            {language === 'fa' && 'چرا پاپلی را برای نفت و گاز انتخاب کنیم'}
            {language === 'ar' && 'لماذا تختار Paapeli للنفط والغاز'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Harsh Environment Ready'}
                {language === 'fa' && 'آماده برای محیط‌های سخت'}
                {language === 'ar' && 'جاهز للبيئات القاسية'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Devices designed to withstand extreme temperatures, vibration, and conditions'}
                {language === 'fa' && 'دستگاه‌های طراحی شده برای تحمل دماهای شدید، لرزش و شرایط'}
                {language === 'ar' && 'أجهزة مصممة لتحمل درجات الحرارة الشديدة والاهتزاز والظروف'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Remote Connectivity'}
                {language === 'fa' && 'اتصال از راه دور'}
                {language === 'ar' && 'الاتصال عن بعد'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Cellular, satellite, and LoRaWAN options for remote locations'}
                {language === 'fa' && 'گزینه‌های سلولی، ماهواره‌ای و LoRaWAN برای مکان‌های دور'}
                {language === 'ar' && 'خيارات الخلوية والأقمار الصناعية و LoRaWAN للمواقع النائية'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Enterprise Security'}
                {language === 'fa' && 'امنیت سازمانی'}
                {language === 'ar' && 'أمن المؤسسات'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'End-to-end encryption and compliance with industry standards'}
                {language === 'fa' && 'رمزگذاری سرتاسری و انطباق با استانداردهای صنعت'}
                {language === 'ar' && 'التشفير من طرف إلى طرف والامتثال لمعايير الصناعة'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Scalable Architecture'}
                {language === 'fa' && 'معماری مقیاس‌پذیر'}
                {language === 'ar' && 'بنية قابلة للتوسع'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'From pilot projects to enterprise-wide deployments'}
                {language === 'fa' && 'از پروژه‌های آزمایشی تا استقرارهای سراسری سازمان'}
                {language === 'ar' && 'من المشاريع التجريبية إلى النشر على مستوى المؤسسة'}
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
              {language === 'en' && 'Ready to Transform Your Operations?'}
              {language === 'fa' && 'آماده برای تحول عملیات خود هستید؟'}
              {language === 'ar' && 'هل أنت مستعد لتحويل عملياتك؟'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Contact our team to discuss your oil & gas IoT requirements'}
              {language === 'fa' && 'با تیم ما تماس بگیرید تا در مورد نیازهای IoT نفت و گاز خود صحبت کنید'}
              {language === 'ar' && 'اتصل بفريقنا لمناقشة متطلبات إنترنت الأشياء للنفط والغاز'}
            </p>
            <Button size="lg">
              {language === 'en' && 'Contact Sales'}
              {language === 'fa' && 'تماس با فروش'}
              {language === 'ar' && 'اتصل بالمبيعات'}
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default OilGas;
