import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Lightbulb, Wind, Shield, Zap, TrendingDown } from "lucide-react";

const SmartBuildings = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Lightbulb,
      title: "Smart Lighting",
      titleFa: "روشنایی هوشمند",
      titleAr: "الإضاءة الذكية",
      description: "Automated lighting control based on occupancy and daylight",
      descriptionFa: "کنترل روشنایی خودکار بر اساس اشغال و نور روز",
      descriptionAr: "التحكم التلقائي في الإضاءة بناءً على الإشغال وضوء النهار"
    },
    {
      icon: Wind,
      title: "HVAC Optimization",
      titleFa: "بهینه‌سازی تهویه مطبوع",
      titleAr: "تحسين أنظمة التدفئة والتهوية وتكييف الهواء",
      description: "Intelligent climate control for comfort and efficiency",
      descriptionFa: "کنترل هوشمند آب و هوا برای راحتی و کارایی",
      descriptionAr: "التحكم الذكي في المناخ من أجل الراحة والكفاءة"
    },
    {
      icon: Zap,
      title: "Energy Management",
      titleFa: "مدیریت انرژی",
      titleAr: "إدارة الطاقة",
      description: "Real-time energy monitoring and optimization",
      descriptionFa: "نظارت و بهینه‌سازی انرژی بی‌درنگ",
      descriptionAr: "مراقبة وتحسين الطاقة في الوقت الفعلي"
    },
    {
      icon: Shield,
      title: "Access Control",
      titleFa: "کنترل دسترسی",
      titleAr: "التحكم في الوصول",
      description: "Smart locks and entry management systems",
      descriptionFa: "قفل‌های هوشمند و سیستم‌های مدیریت ورودی",
      descriptionAr: "الأقفال الذكية وأنظمة إدارة الدخول"
    },
    {
      icon: TrendingDown,
      title: "Cost Reduction",
      titleFa: "کاهش هزینه",
      titleAr: "خفض التكلفة",
      description: "Lower operational costs through automation",
      descriptionFa: "کاهش هزینه‌های عملیاتی از طریق خودکارسازی",
      descriptionAr: "خفض تكاليف التشغيل من خلال الأتمتة"
    },
    {
      icon: Building2,
      title: "Space Management",
      titleFa: "مدیریت فضا",
      titleAr: "إدارة المساحة",
      description: "Optimize space utilization with occupancy data",
      descriptionFa: "بهینه‌سازی استفاده از فضا با داده‌های اشغال",
      descriptionAr: "تحسين استخدام المساحة مع بيانات الإشغال"
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
              {language === 'en' && 'Smart Building Solutions'}
              {language === 'fa' && 'راهکارهای ساختمان هوشمند'}
              {language === 'ar' && 'حلول المباني الذكية'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Transform buildings into intelligent, efficient spaces. Reduce energy costs, enhance comfort, and improve security with integrated IoT solutions.'}
              {language === 'fa' && 'ساختمان‌ها را به فضاهای هوشمند و کارآمد تبدیل کنید. هزینه‌های انرژی را کاهش دهید، راحتی را افزایش دهید و امنیت را با راه‌حل‌های یکپارچه IoT بهبود بخشید.'}
              {language === 'ar' && 'تحويل المباني إلى مساحات ذكية وفعالة. قلل تكاليف الطاقة، وعزز الراحة، وحسن الأمان بحلول إنترنت الأشياء المتكاملة.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Learn More'}
                {language === 'fa' && 'بیشتر بدانید'}
                {language === 'ar' && 'اعرف المزيد'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'Request Quote'}
                {language === 'fa' && 'درخواست قیمت'}
                {language === 'ar' && 'طلب عرض أسعار'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Integrated Building Management'}
            {language === 'fa' && 'مدیریت یکپارچه ساختمان'}
            {language === 'ar' && 'إدارة المباني المتكاملة'}
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

      {/* Building Types */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Perfect for Any Building Type'}
            {language === 'fa' && 'مناسب برای هر نوع ساختمان'}
            {language === 'ar' && 'مثالي لأي نوع من المباني'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {language === 'en' && 'Offices'}
                {language === 'fa' && 'دفاتر'}
                {language === 'ar' && 'المكاتب'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en' && 'Optimize workplace efficiency'}
                {language === 'fa' && 'بهینه‌سازی کارایی محل کار'}
                {language === 'ar' && 'تحسين كفاءة مكان العمل'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {language === 'en' && 'Hotels'}
                {language === 'fa' && 'هتل‌ها'}
                {language === 'ar' && 'الفنادق'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en' && 'Enhance guest experience'}
                {language === 'fa' && 'بهبود تجربه مهمان'}
                {language === 'ar' && 'تحسين تجربة الضيوف'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {language === 'en' && 'Hospitals'}
                {language === 'fa' && 'بیمارستان‌ها'}
                {language === 'ar' && 'المستشفيات'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en' && 'Improve patient care'}
                {language === 'fa' && 'بهبود مراقبت از بیمار'}
                {language === 'ar' && 'تحسين رعاية المرضى'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {language === 'en' && 'Retail'}
                {language === 'fa' && 'خرده‌فروشی'}
                {language === 'ar' && 'التجزئة'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en' && 'Boost customer comfort'}
                {language === 'fa' && 'افزایش راحتی مشتری'}
                {language === 'ar' && 'تعزيز راحة العملاء'}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              {language === 'en' && 'Proven Return on Investment'}
              {language === 'fa' && 'بازگشت سرمایه اثبات شده'}
              {language === 'ar' && 'عائد استثمار مثبت'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">35%</div>
                <p className="text-muted-foreground">
                  {language === 'en' && 'Energy Cost Savings'}
                  {language === 'fa' && 'صرفه‌جویی در هزینه انرژی'}
                  {language === 'ar' && 'توفير تكاليف الطاقة'}
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">50%</div>
                <p className="text-muted-foreground">
                  {language === 'en' && 'Maintenance Reduction'}
                  {language === 'fa' && 'کاهش تعمیر و نگهداری'}
                  {language === 'ar' && 'خفض الصيانة'}
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">20%</div>
                <p className="text-muted-foreground">
                  {language === 'en' && 'Productivity Increase'}
                  {language === 'fa' && 'افزایش بهره‌وری'}
                  {language === 'ar' && 'زيادة الإنتاجية'}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {language === 'en' && 'Make Your Building Smarter'}
              {language === 'fa' && 'ساختمان خود را هوشمندتر کنید'}
              {language === 'ar' && 'اجعل مبناك أكثر ذكاءً'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Contact us to discuss your smart building project'}
              {language === 'fa' && 'با ما تماس بگیرید تا در مورد پروژه ساختمان هوشمند خود صحبت کنید'}
              {language === 'ar' && 'اتصل بنا لمناقشة مشروع مبناك الذكي'}
            </p>
            <Button size="lg">
              {language === 'en' && 'Get Started'}
              {language === 'fa' && 'شروع کنید'}
              {language === 'ar' && 'ابدأ'}
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SmartBuildings;
