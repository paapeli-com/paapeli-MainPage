import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Send, Building2, Users } from "lucide-react";
import { toast } from "sonner";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnjqowpy";

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
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Select ها واقعی نیستند → دستی چک می‌کنیم
    if (!formData.businessSegment || !formData.businessSize) {
      toast.error(t("selectSegmentAndSize") || "Please select business segment and size.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("company", formData.company);
      fd.append("businessSegment", formData.businessSegment);
      fd.append("businessSize", formData.businessSize);
      fd.append("description", formData.description);
      fd.append("requirements", formData.requirements);

      // متادیتای مفید برای ایمیل
      fd.append("_subject", `New Paapeli Demo Request — ${formData.company || formData.name}`);
      fd.append("_replyto", formData.email);

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Form submission failed");
      }

      toast.success(t("demoRequestSuccess") || "Demo request submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        businessSegment: "",
        businessSize: "",
        description: "",
        requirements: "",
      });
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t("requestDemo") || "Request a Demo"}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t("requestDemoDesc") || "Tell us about your project and we’ll get back to you."}
              </p>
            </div>

            {/* Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("fullName") || "Full Name"}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("enterName") || "Your full name"}
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
                      placeholder={t("enterEmail") || "you@company.com"}
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
                      placeholder={t("enterPhone") || "+31 ..."}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">{t("company") || "Company"}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t("enterCompany") || "Company name"}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("businessSegment") || "Business Segment"}</Label>
                    <Select
                      value={formData.businessSegment}
                      onValueChange={(value) =>
                        setFormData({ ...formData, businessSegment: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSegment") || "Select segment"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industrial">Industrial IoT</SelectItem>
                        <SelectItem value="agriculture">Smart Agriculture</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("businessSize") || "Company Size"}</Label>
                    <Select
                      value={formData.businessSize}
                      onValueChange={(value) =>
                        setFormData({ ...formData, businessSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSize") || "Select size"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1–10</SelectItem>
                        <SelectItem value="11-50">11–50</SelectItem>
                        <SelectItem value="51-200">51–200</SelectItem>
                        <SelectItem value="201-500">201–500</SelectItem>
                        <SelectItem value="501+">501+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("projectDescription") || "Project Description"}</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder={t("describeProject") || "Describe your project"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("specificRequirements") || "Specific Requirements"}</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    rows={4}
                    placeholder={t("enterRequirements") || "Optional"}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("submitting") || "Submitting..." : t("submitRequest") || "Submit Request"}
                  <Send className={`h-5 w-5 ${isRTL ? "mr-2" : "ml-2"}`} />
                </Button>
              </form>
            </Card>

            {/* Info cards */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <Building2 className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-2">
                  {t("enterpriseSolutions") || "Enterprise Solutions"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("enterpriseSolutionsDesc") || "Scalable AIoT solutions for industrial environments."}
                </p>
              </Card>

              <Card className="p-6">
                <Users className="h-8 w-8 text-secondary mb-3" />
                <h3 className="font-bold text-lg mb-2">
                  {t("dedicatedSupport") || "Dedicated Support"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("dedicatedSupportDesc") || "Expert guidance from design to deployment."}
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
