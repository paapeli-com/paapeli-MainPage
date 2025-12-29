import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, Droplets, Cloud, ThermometerSun, Wifi, BarChart3 } from "lucide-react";
import { PredictiveMaintenanceStats } from "@/components/PredictiveMaintenanceStats";

const SmartAgriculture = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Droplets,
      title: "Soil Monitoring",
      titleFa: "نظارت بر خاک",
      titleAr: "مراقبة التربة",
      description: "Track soil moisture, pH, and nutrient levels",
      descriptionFa: "ردیابی رطوبت، pH و سطوح مواد مغذی خاک",
      descriptionAr: "تتبع رطوبة التربة ودرجة الحموضة ومستويات المغذيات"
    },
    {
      icon: ThermometerSun,
      title: "Climate Control",
      titleFa: "کنترل آب و هوا",
      titleAr: "التحكم في المناخ",
      description: "Monitor temperature, humidity, and weather conditions",
      descriptionFa: "نظارت بر دما، رطوبت و شرایط آب و هوا",
      descriptionAr: "مراقبة درجة الحرارة والرطوبة والظروف الجوية"
    },
    {
      icon: Sprout,
      title: "Crop Health",
      titleFa: "سلامت محصول",
      titleAr: "صحة المحاصيل",
      description: "Early detection of diseases and pests",
      descriptionFa: "تشخیص زودهنگام بیماری‌ها و آفات",
      descriptionAr: "الكشف المبكر عن الأمراض والآفات"
    },
    {
      icon: Droplets,
      title: "Smart Irrigation",
      titleFa: "آبیاری هوشمند",
      titleAr: "الري الذكي",
      description: "Automated watering based on real-time data",
      descriptionFa: "آبیاری خودکار بر اساس داده‌های بی‌درنگ",
      descriptionAr: "الري الآلي بناءً على البيانات في الوقت الفعلي"
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      titleFa: "یکپارچه‌سازی آب و هوا",
      titleAr: "التكامل مع الطقس",
      description: "Connect with weather forecasts for planning",
      descriptionFa: "اتصال با پیش‌بینی‌های آب و هوا برای برنامه‌ریزی",
      descriptionAr: "الاتصال بتوقعات الطقس للتخطيط"
    },
    {
      icon: BarChart3,
      title: "Yield Analytics",
      titleFa: "تحلیل عملکرد",
      titleAr: "تحليل الإنتاجية",
      description: "Data-driven insights to maximize crop yield",
      descriptionFa: "بینش‌های مبتنی بر داده برای به حداکثر رساندن عملکرد محصول",
      descriptionAr: "رؤى مدفوعة بالبيانات لزيادة إنتاجية المحاصيل"
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
              {language === 'en' && 'Smart Agriculture Solutions'}
              {language === 'fa' && 'راهکارهای کشاورزی هوشمند'}
              {language === 'ar' && 'حلول الزراعة الذكية'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Transform traditional farming with IoT-enabled precision agriculture. Monitor crops, optimize irrigation, and increase yields with data-driven insights.'}
              {language === 'fa' && 'کشاورزی سنتی را با کشاورزی دقیق مبتنی بر IoT تبدیل کنید. محصولات را نظارت کنید، آبیاری را بهینه کنید و عملکرد را با بینش‌های مبتنی بر داده افزایش دهید.'}
              {language === 'ar' && 'تحويل الزراعة التقليدية إلى زراعة دقيقة باستخدام إنترنت الأشياء. راقب المحاصيل، وحسّن الري، وزد الإنتاجية بالرؤى المدفوعة بالبيانات.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Start Growing Smart'}
                {language === 'fa' && 'شروع رشد هوشمند'}
                {language === 'ar' && 'ابدأ النمو الذكي'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'View Demo'}
                {language === 'fa' && 'مشاهده دمو'}
                {language === 'ar' && 'عرض توضيحي'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Comprehensive Farm Monitoring'}
            {language === 'fa' && 'نظارت جامع مزرعه'}
            {language === 'ar' && 'المراقبة الشاملة للمزرعة'}
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

      {/* Predictive Maintenance Stats */}
      <PredictiveMaintenanceStats />

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Benefits of Smart Agriculture'}
            {language === 'fa' && 'مزایای کشاورزی هوشمند'}
            {language === 'ar' && 'فوائد الزراعة الذكية'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">30%</div>
              <p className="text-muted-foreground">
                {language === 'en' && 'Water Savings'}
                {language === 'fa' && 'صرفه‌جویی در آب'}
                {language === 'ar' && 'توفير المياه'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">25%</div>
              <p className="text-muted-foreground">
                {language === 'en' && 'Yield Increase'}
                {language === 'fa' && 'افزایش عملکرد'}
                {language === 'ar' && 'زيادة الإنتاجية'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <p className="text-muted-foreground">
                {language === 'en' && 'Cost Reduction'}
                {language === 'fa' && 'کاهش هزینه'}
                {language === 'ar' && 'خفض التكلفة'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">
                {language === 'en' && 'Monitoring'}
                {language === 'fa' && 'نظارت'}
                {language === 'ar' && 'المراقبة'}
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
              {language === 'en' && 'Grow Smarter, Not Harder'}
              {language === 'fa' && 'هوشمندانه‌تر رشد کنید، نه سخت‌تر'}
              {language === 'ar' && 'انمو بذكاء، وليس بجهد أكبر'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Join farmers worldwide who are increasing yields with smart agriculture'}
              {language === 'fa' && 'به کشاورزان در سراسر جهان بپیوندید که با کشاورزی هوشمند عملکرد را افزایش می‌دهند'}
              {language === 'ar' && 'انضم إلى المزارعين في جميع أنحاء العالم الذين يزيدون الإنتاجية بالزراعة الذكية'}
            </p>
            <Button size="lg">
              {language === 'en' && 'Get Started Today'}
              {language === 'fa' && 'امروز شروع کنید'}
              {language === 'ar' && 'ابدأ اليوم'}
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SmartAgriculture;
