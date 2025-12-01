import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Send, Building2, Users } from "lucide-react";
import { toast } from "sonner";

const RequestDemo = () => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessSegment: "",
    businessSize: "",
    description: "",
    requirements: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success(t('demoRequestSuccess'));
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        businessSegment: "",
        businessSize: "",
        description: "",
        requirements: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t('requestDemo')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('requestDemoDesc')}
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('enterName')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('enterEmail')}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('enterPhone')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('company')}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t('enterCompany')}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessSegment">{t('businessSegment')}</Label>
                    <Select
                      value={formData.businessSegment}
                      onValueChange={(value) => setFormData({ ...formData, businessSegment: value })}
                      required
                    >
                      <SelectTrigger id="businessSegment">
                        <SelectValue placeholder={t('selectSegment')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smart-cities">{t('smartCities')}</SelectItem>
                        <SelectItem value="industrial">{t('industrialIoT')}</SelectItem>
                        <SelectItem value="agriculture">{t('smartAgriculture')}</SelectItem>
                        <SelectItem value="energy">{t('energyOil')}</SelectItem>
                        <SelectItem value="healthcare">{t('healthcare')}</SelectItem>
                        <SelectItem value="retail">{t('retail')}</SelectItem>
                        <SelectItem value="other">{t('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessSize">{t('businessSize')}</Label>
                    <Select
                      value={formData.businessSize}
                      onValueChange={(value) => setFormData({ ...formData, businessSize: value })}
                      required
                    >
                      <SelectTrigger id="businessSize">
                        <SelectValue placeholder={t('selectSize')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">{t('size1to10')}</SelectItem>
                        <SelectItem value="11-50">{t('size11to50')}</SelectItem>
                        <SelectItem value="51-200">{t('size51to200')}</SelectItem>
                        <SelectItem value="201-500">{t('size201to500')}</SelectItem>
                        <SelectItem value="501+">{t('size501plus')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('projectDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('describeProject')}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">{t('specificRequirements')}</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder={t('enterRequirements')}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('submitting') : t('submitRequest')}
                  <Send className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </form>
            </Card>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <Building2 className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-2 text-foreground">{t('enterpriseSolutions')}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('enterpriseSolutionsDesc')}
                </p>
              </Card>
              <Card className="p-6">
                <Users className="h-8 w-8 text-secondary mb-3" />
                <h3 className="font-bold text-lg mb-2 text-foreground">{t('dedicatedSupport')}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('dedicatedSupportDesc')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDemo;
