import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Rocket, Cpu, Wrench, BookOpen, Users } from "lucide-react";

const MakersDevelopers = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Code,
      title: "Developer-Friendly APIs",
      titleFa: "APIهای دوستانه برای توسعه‌دهندگان",
      titleAr: "واجهات برمجة تطبيقات صديقة للمطورين",
      description: "RESTful APIs and SDKs for rapid integration",
      descriptionFa: "APIهای RESTful و SDK برای یکپارچه‌سازی سریع",
      descriptionAr: "واجهات RESTful وSDK للتكامل السريع"
    },
    {
      icon: Rocket,
      title: "Quick Prototyping",
      titleFa: "نمونه‌سازی سریع",
      titleAr: "النماذج الأولية السريعة",
      description: "From idea to working prototype in hours",
      descriptionFa: "از ایده تا نمونه اولیه کاری در عرض چند ساعت",
      descriptionAr: "من الفكرة إلى النموذج الأولي العامل في ساعات"
    },
    {
      icon: Cpu,
      title: "Hardware Support",
      titleFa: "پشتیبانی سخت‌افزار",
      titleAr: "دعم الأجهزة",
      description: "Compatible with Arduino, Raspberry Pi, ESP32 and more",
      descriptionFa: "سازگار با Arduino، Raspberry Pi، ESP32 و موارد دیگر",
      descriptionAr: "متوافق مع Arduino و Raspberry Pi و ESP32 والمزيد"
    },
    {
      icon: Wrench,
      title: "Flexible Tools",
      titleFa: "ابزارهای انعطاف‌پذیر",
      titleAr: "أدوات مرنة",
      description: "Build exactly what you need with customizable widgets",
      descriptionFa: "دقیقاً آنچه نیاز دارید با ویجت‌های قابل تنظیم بسازید",
      descriptionAr: "قم ببناء ما تحتاجه بالضبط باستخدام عناصر واجهة مستخدم قابلة للتخصيص"
    },
    {
      icon: BookOpen,
      title: "Rich Documentation",
      titleFa: "مستندات غنی",
      titleAr: "وثائق شاملة",
      description: "Comprehensive guides and tutorials for makers",
      descriptionFa: "راهنماها و آموزش‌های جامع برای سازندگان",
      descriptionAr: "أدلة شاملة ودروس للمصنعين"
    },
    {
      icon: Users,
      title: "Community Support",
      titleFa: "پشتیبانی انجمن",
      titleAr: "دعم المجتمع",
      description: "Active maker community and forums",
      descriptionFa: "انجمن فعال سازندگان و انجمن‌های گفتگو",
      descriptionAr: "مجتمع نشط من المصنعين والمنتديات"
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
              {language === 'en' && 'Built for Makers & Developers'}
              {language === 'fa' && 'ساخته شده برای سازندگان و توسعه‌دهندگان'}
              {language === 'ar' && 'مصمم للصانعين والمطورين'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'The perfect IoT platform for hobbyists, students, and professional developers. Start building your next IoT project with powerful tools and unlimited creativity.'}
              {language === 'fa' && 'پلتفرم IoT کامل برای علاقه‌مندان، دانشجویان و توسعه‌دهندگان حرفه‌ای. ساخت پروژه IoT بعدی خود را با ابزارهای قدرتمند و خلاقیت نامحدود شروع کنید.'}
              {language === 'ar' && 'منصة إنترنت الأشياء المثالية للهواة والطلاب والمطورين المحترفين. ابدأ في بناء مشروع إنترنت الأشياء التالي باستخدام أدوات قوية وإبداع غير محدود.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Start Building'}
                {language === 'fa' && 'شروع به ساخت'}
                {language === 'ar' && 'ابدأ البناء'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'View Examples'}
                {language === 'fa' && 'مشاهده نمونه‌ها'}
                {language === 'ar' && 'عرض الأمثلة'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Everything You Need to Build'}
            {language === 'fa' && 'هر چیزی که برای ساخت نیاز دارید'}
            {language === 'ar' && 'كل ما تحتاجه للبناء'}
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

      {/* Project Ideas */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Project Inspiration'}
            {language === 'fa' && 'الهام از پروژه'}
            {language === 'ar' && 'إلهام المشروع'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Home Automation'}
                {language === 'fa' && 'اتوماسیون خانه'}
                {language === 'ar' && 'أتمتة المنزل'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Build smart home devices with sensors and controllers'}
                {language === 'fa' && 'ساخت دستگاه‌های خانه هوشمند با سنسورها و کنترلرها'}
                {language === 'ar' && 'بناء أجهزة منزلية ذكية مع أجهزة الاستشعار ووحدات التحكم'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Weather Station'}
                {language === 'fa' && 'ایستگاه هواشناسی'}
                {language === 'ar' && 'محطة الطقس'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Monitor temperature, humidity, and air quality'}
                {language === 'fa' && 'نظارت بر دما، رطوبت و کیفیت هوا'}
                {language === 'ar' && 'مراقبة درجة الحرارة والرطوبة وجودة الهواء'}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Plant Monitor'}
                {language === 'fa' && 'مانیتور گیاه'}
                {language === 'ar' && 'مراقب النبات'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Track soil moisture and automate watering'}
                {language === 'fa' && 'ردیابی رطوبت خاک و خودکارسازی آبیاری'}
                {language === 'ar' && 'تتبع رطوبة التربة وأتمتة الري'}
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
              {language === 'en' && 'Start Your IoT Journey'}
              {language === 'fa' && 'سفر IoT خود را شروع کنید'}
              {language === 'ar' && 'ابدأ رحلتك في إنترنت الأشياء'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Join thousands of makers building amazing IoT projects'}
              {language === 'fa' && 'به هزاران سازنده که پروژه‌های شگفت‌انگیز IoT می‌سازند بپیوندید'}
              {language === 'ar' && 'انضم إلى آلاف الصانعين الذين يبنون مشاريع إنترنت الأشياء المذهلة'}
            </p>
            <Button size="lg">
              {language === 'en' && 'Get Started Free'}
              {language === 'fa' && 'شروع رایگان'}
              {language === 'ar' && 'ابدأ مجانًا'}
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MakersDevelopers;
