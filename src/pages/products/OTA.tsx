import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Shield, Zap, RefreshCw, CheckCircle, Clock } from "lucide-react";

const OTA = () => {
  const { t, isRTL, language } = useLanguage();

  const features = [
    {
      icon: Download,
      title: "Seamless Updates",
      titleFa: "به‌روزرسانی بدون وقفه",
      titleAr: "تحديثات سلسة",
      description: "Deploy firmware updates without device interruption",
      descriptionFa: "استقرار به‌روزرسانی‌های فریم‌ور بدون قطع دستگاه",
      descriptionAr: "نشر تحديثات البرامج الثابتة دون انقطاع الجهاز"
    },
    {
      icon: Shield,
      title: "Secure Rollout",
      titleFa: "استقرار امن",
      titleAr: "نشر آمن",
      description: "Encrypted updates with rollback capabilities",
      descriptionFa: "به‌روزرسانی‌های رمزنگاری شده با قابلیت بازگشت",
      descriptionAr: "تحديثات مشفرة مع إمكانية الرجوع"
    },
    {
      icon: Zap,
      title: "Delta Updates",
      titleFa: "به‌روزرسانی‌های تفاضلی",
      titleAr: "التحديثات التفاضلية",
      description: "Only transfer changed files to save bandwidth",
      descriptionFa: "انتقال فقط فایل‌های تغییر یافته برای صرفه‌جویی در پهنای باند",
      descriptionAr: "نقل الملفات المتغيرة فقط لتوفير النطاق الترددي"
    },
    {
      icon: RefreshCw,
      title: "Automatic Rollback",
      titleFa: "بازگشت خودکار",
      titleAr: "الرجوع التلقائي",
      description: "Auto-revert failed updates to previous stable version",
      descriptionFa: "بازگشت خودکار به‌روزرسانی‌های ناموفق به نسخه پایدار قبلی",
      descriptionAr: "التراجع التلقائي عن التحديثات الفاشلة إلى الإصدار المستقر السابق"
    },
    {
      icon: CheckCircle,
      title: "Version Control",
      titleFa: "کنترل نسخه",
      titleAr: "التحكم في الإصدار",
      description: "Track and manage firmware versions across all devices",
      descriptionFa: "ردیابی و مدیریت نسخه‌های فریم‌ور در تمام دستگاه‌ها",
      descriptionAr: "تتبع وإدارة إصدارات البرامج الثابتة عبر جميع الأجهزة"
    },
    {
      icon: Clock,
      title: "Scheduled Deployment",
      titleFa: "استقرار زمان‌بندی شده",
      titleAr: "النشر المجدول",
      description: "Deploy updates during maintenance windows",
      descriptionFa: "استقرار به‌روزرسانی‌ها در بازه‌های زمانی تعمیر و نگهداری",
      descriptionAr: "نشر التحديثات خلال نوافذ الصيانة"
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
              {language === 'en' && 'Over-The-Air Updates'}
              {language === 'fa' && 'به‌روزرسانی از راه دور (OTA)'}
              {language === 'ar' && 'التحديثات عبر الهواء (OTA)'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Keep your IoT devices up-to-date with secure, reliable firmware updates delivered wirelessly. Deploy updates to millions of devices with confidence.'}
              {language === 'fa' && 'دستگاه‌های IoT خود را با به‌روزرسانی‌های فریم‌ور امن و قابل اعتماد که به صورت بی‌سیم ارسال می‌شوند، به‌روز نگه دارید. به‌روزرسانی‌ها را با اطمینان برای میلیون‌ها دستگاه استقرار دهید.'}
              {language === 'ar' && 'حافظ على تحديث أجهزة إنترنت الأشياء الخاصة بك مع تحديثات البرامج الثابتة الآمنة والموثوقة المقدمة لاسلكيًا. انشر التحديثات على ملايين الأجهزة بثقة.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                {language === 'en' && 'Get Started'}
                {language === 'fa' && 'شروع کنید'}
                {language === 'ar' && 'ابدأ الآن'}
              </Button>
              <Button size="lg" variant="outline">
                {language === 'en' && 'Documentation'}
                {language === 'fa' && 'مستندات'}
                {language === 'ar' && 'الوثائق'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'Enterprise-Grade OTA Features'}
            {language === 'fa' && 'قابلیت‌های OTA سطح سازمانی'}
            {language === 'ar' && 'ميزات OTA على مستوى المؤسسات'}
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

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {language === 'en' && 'How OTA Updates Work'}
            {language === 'fa' && 'نحوه عملکرد به‌روزرسانی‌های OTA'}
            {language === 'ar' && 'كيف تعمل تحديثات OTA'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Upload Firmware'}
                {language === 'fa' && 'آپلود فریم‌ور'}
                {language === 'ar' && 'تحميل البرامج الثابتة'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Upload your firmware to our secure cloud platform'}
                {language === 'fa' && 'فریم‌ور خود را به پلتفرم ابری امن ما آپلود کنید'}
                {language === 'ar' && 'قم بتحميل البرامج الثابتة الخاصة بك إلى منصة السحابة الآمنة لدينا'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Target Devices'}
                {language === 'fa' && 'هدف‌گیری دستگاه‌ها'}
                {language === 'ar' && 'استهداف الأجهزة'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Select which devices or groups should receive the update'}
                {language === 'fa' && 'دستگاه‌ها یا گروه‌هایی که باید به‌روزرسانی را دریافت کنند انتخاب کنید'}
                {language === 'ar' && 'حدد الأجهزة أو المجموعات التي يجب أن تتلقى التحديث'}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {language === 'en' && 'Deploy & Monitor'}
                {language === 'fa' && 'استقرار و نظارت'}
                {language === 'ar' && 'النشر والمراقبة'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' && 'Track deployment progress and ensure successful updates'}
                {language === 'fa' && 'پیشرفت استقرار را ردیابی کنید و از به‌روزرسانی‌های موفق اطمینان حاصل کنید'}
                {language === 'ar' && 'تتبع تقدم النشر وتأكد من التحديثات الناجحة'}
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
              {language === 'en' && 'Ready to Deploy OTA Updates?'}
              {language === 'fa' && 'آماده استقرار به‌روزرسانی‌های OTA هستید؟'}
              {language === 'ar' && 'هل أنت مستعد لنشر تحديثات OTA؟'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'en' && 'Start updating your devices wirelessly today'}
              {language === 'fa' && 'همین امروز دستگاه‌های خود را به صورت بی‌سیم به‌روز کنید'}
              {language === 'ar' && 'ابدأ في تحديث أجهزتك لاسلكيًا اليوم'}
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

export default OTA;
