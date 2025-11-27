import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { 
  Lightbulb, 
  Car, 
  Wind, 
  Building2,
  Camera,
  Trash2,
  Droplet,
  Wifi,
  ArrowRight
} from "lucide-react";

const SmartCities = () => {
  const { t, isRTL } = useLanguage();

  const applications = [
    {
      icon: Lightbulb,
      title: {
        en: "Smart Street Lighting",
        fa: "روشنایی هوشمند خیابان",
        ar: "إضاءة الشوارع الذكية"
      },
      description: {
        en: "Automated street lighting with energy optimization, dimming schedules, and remote control. Reduce energy consumption by up to 60% while improving public safety.",
        fa: "روشنایی خودکار خیابان با بهینه‌سازی انرژی، زمان‌بندی کاهش نور و کنترل از راه دور. کاهش مصرف انرژی تا 60% با بهبود ایمنی عمومی.",
        ar: "إضاءة الشوارع الآلية مع تحسين الطاقة، جداول التعتيم، والتحكم عن بعد. تقليل استهلاك الطاقة بنسبة تصل إلى 60٪ مع تحسين السلامة العامة."
      }
    },
    {
      icon: Car,
      title: {
        en: "Intelligent Traffic Management",
        fa: "مدیریت هوشمند ترافیک",
        ar: "إدارة حركة المرور الذكية"
      },
      description: {
        en: "Real-time traffic monitoring with AI-powered signal optimization, congestion prediction, and dynamic routing. Reduce commute times by 25% and emissions by 30%.",
        fa: "نظارت بر ترافیک در زمان واقعی با بهینه‌سازی چراغ راهنمایی مبتنی بر هوش مصنوعی، پیش‌بینی ترافیک و مسیریابی پویا. کاهش زمان رفت و آمد 25% و انتشار گاز 30%.",
        ar: "مراقبة حركة المرور في الوقت الفعلي مع تحسين الإشارات بالذكاء الاصطناعي، والتنبؤ بالازدحام، والتوجيه الديناميكي. تقليل أوقات التنقل بنسبة 25٪ والانبعاثات بنسبة 30٪."
      }
    },
    {
      icon: Wind,
      title: {
        en: "Environmental Monitoring",
        fa: "نظارت محیط زیست",
        ar: "مراقبة البيئة"
      },
      description: {
        en: "Track air quality (PM2.5, PM10, CO2, NO2), noise levels, temperature, and humidity across the city. Early detection of pollution hotspots and automated alerts.",
        fa: "ردیابی کیفیت هوا (PM2.5، PM10، CO2، NO2)، سطح صدا، دما و رطوبت در سطح شهر. تشخیص زودهنگام نقاط گرم آلودگی و هشدارهای خودکار.",
        ar: "تتبع جودة الهواء (PM2.5، PM10، CO2، NO2)، مستويات الضوضاء، درجة الحرارة، والرطوبة في جميع أنحاء المدينة. الكشف المبكر عن بؤر التلوث والتنبيهات الآلية."
      }
    },
    {
      icon: Camera,
      title: {
        en: "Smart Surveillance",
        fa: "نظارت هوشمند",
        ar: "المراقبة الذكية"
      },
      description: {
        en: "AI-powered video analytics for public safety, crowd detection, incident response, and facial recognition. Integrated with emergency services for faster response times.",
        fa: "تحلیل ویدیو مبتنی بر هوش مصنوعی برای ایمنی عمومی، تشخیص جمعیت، پاسخ به حوادث و تشخیص چهره. یکپارچه با خدمات اضطراری برای زمان پاسخ سریعتر.",
        ar: "تحليلات الفيديو بالذكاء الاصطناعي للسلامة العامة، واكتشاف الحشود، والاستجابة للحوادث، والتعرف على الوجه. متكامل مع خدمات الطوارئ لأوقات استجابة أسرع."
      }
    },
    {
      icon: Trash2,
      title: {
        en: "Smart Waste Management",
        fa: "مدیریت هوشمند زباله",
        ar: "إدارة النفايات الذكية"
      },
      description: {
        en: "IoT sensors in bins monitor fill levels and optimize collection routes. Reduce operational costs by 40% and improve city cleanliness with predictive maintenance.",
        fa: "سنسورهای IoT در سطل‌ها سطح پری را نظارت کرده و مسیرهای جمع‌آوری را بهینه می‌کنند. کاهش هزینه‌های عملیاتی 40% و بهبود پاکیزگی شهر با نگهداری پیش‌بینانه.",
        ar: "أجهزة استشعار إنترنت الأشياء في الصناديق تراقب مستويات الامتلاء وتحسن مسارات الجمع. تقليل التكاليف التشغيلية بنسبة 40٪ وتحسين نظافة المدينة مع الصيانة التنبؤية."
      }
    },
    {
      icon: Droplet,
      title: {
        en: "Water Management",
        fa: "مدیریت آب",
        ar: "إدارة المياه"
      },
      description: {
        en: "Monitor water quality, detect leaks in real-time, and optimize water distribution networks. Save up to 20% of water through smart metering and leak prevention.",
        fa: "نظارت بر کیفیت آب، تشخیص نشتی در زمان واقعی و بهینه‌سازی شبکه‌های توزیع آب. صرفه‌جویی تا 20% از آب از طریق اندازه‌گیری هوشمnd و جلوگیری از نشتی.",
        ar: "مراقبة جودة المياه، واكتشاف التسربات في الوقت الفعلي، وتحسين شبكات توزيع المياه. توفير ما يصل إلى 20٪ من المياه من خلال القياس الذكي ومنع التسرب."
      }
    },
    {
      icon: Wifi,
      title: {
        en: "Public Wi-Fi & Connectivity",
        fa: "وای‌فای عمومی و اتصال",
        ar: "واي فاي عام والاتصال"
      },
      description: {
        en: "City-wide public Wi-Fi infrastructure with analytics on foot traffic patterns, popular areas, and citizen behavior insights to improve urban planning.",
        fa: "زیرساخت وای‌فای عمومی در سطح شهر با تحلیل الگوهای ترافیک پیاده، مناطق محبوب و بینش رفتار شهروندان برای بهبود برنامه‌ریزی شهری.",
        ar: "بنية تحتية عامة للواي فاي على مستوى المدينة مع تحليلات حول أنماط حركة المشاة، والمناطق الشعبية، ورؤى سلوك المواطنين لتحسين التخطيط الحضري."
      }
    },
    {
      icon: Building2,
      title: {
        en: "Smart Building Integration",
        fa: "یکپارچگی ساختمان هوشمند",
        ar: "تكامل المبنى الذكي"
      },
      description: {
        en: "Connect municipal buildings with automated HVAC, lighting, and energy management. Reduce building operational costs by 35% while improving occupant comfort.",
        fa: "اتصال ساختمان‌های شهری با تهویه مطبوع، روشنایی و مدیریت انرژی خودکار. کاهش هزینه‌های عملیاتی ساختمان 35% با بهبود راحتی ساکنان.",
        ar: "ربط المباني البلدية مع التدفئة والتهوية وتكييف الهواء الآلي، والإضاءة، وإدارة الطاقة. تقليل تكاليف تشغيل المباني بنسبة 35٪ مع تحسين راحة الركاب."
      }
    }
  ];

  const benefits = [
    {
      stat: "60%",
      label: {
        en: "Energy Savings",
        fa: "صرفه‌جویی در انرژی",
        ar: "توفير الطاقة"
      }
    },
    {
      stat: "40%",
      label: {
        en: "Cost Reduction",
        fa: "کاهش هزینه",
        ar: "خفض التكلفة"
      }
    },
    {
      stat: "25%",
      label: {
        en: "Traffic Improvement",
        fa: "بهبود ترافیک",
        ar: "تحسين حركة المرور"
      }
    },
    {
      stat: "30%",
      label: {
        en: "Emission Reduction",
        fa: "کاهش انتشار",
        ar: "تقليل الانبعاثات"
      }
    }
  ];

  const getContent = (content: { en: string; fa: string; ar: string }) => {
    return content[t('lang') as 'en' | 'fa' | 'ar'] || content.en;
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
                {t('smartCities')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                {t('smartCitiesDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  {t('getStarted')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  {t('requestDemo')}
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {benefit.stat}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {getContent(benefit.label)}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t('smartCityApplications')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('smartCityApplicationsDesc')}
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {applications.map((app, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <app.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground flex-1">
                      {getContent(app.title)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {getContent(app.description)}
                  </p>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                {t('readyToTransform')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  {t('getStarted')} <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  {t('contactSales')}
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default SmartCities;
