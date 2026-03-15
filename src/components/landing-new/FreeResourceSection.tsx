// @ts-nocheck
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, BookOpen, ArrowRight, CheckCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// Subreddits to show after form submission
const freeSubreddits = [
  { name: "r/marketing", url: "https://www.reddit.com/r/marketing" },
  { name: "r/entrepreneur", url: "https://www.reddit.com/r/entrepreneur" },
  { name: "r/startups", url: "https://www.reddit.com/r/startups" },
  { name: "r/smallbusiness", url: "https://www.reddit.com/r/smallbusiness" },
  { name: "r/business", url: "https://www.reddit.com/r/business" },
];

export const FreeResourceSection = () => {
  const [playbookModalOpen, setPlaybookModalOpen] = useState(false);
  const [subredditsModalOpen, setSubredditsModalOpen] = useState(false);
  const [playbookFormData, setPlaybookFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
  });
  const [subredditsFormData, setSubredditsFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
  });
  const [playbookSubmitted, setPlaybookSubmitted] = useState(false);
  const [subredditsSubmitted, setSubredditsSubmitted] = useState(false);
  const [playbookErrors, setPlaybookErrors] = useState({});
  const [subredditsErrors, setSubredditsErrors] = useState({});

  useEffect(() => {
    const handleHashOpen = () => {
      if (window.location.hash === "#free-subreddits") {
        document.getElementById("free-resource")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSubredditsModalOpen(true);
      }
    };

    handleHashOpen();
    window.addEventListener("hashchange", handleHashOpen);
    return () => window.removeEventListener("hashchange", handleHashOpen);
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = "Name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email format";
    if (!data.mobile.trim()) errors.mobile = "Mobile is required";
    if (!data.companyName.trim()) errors.companyName = "Company Name is required";
    return errors;
  };

  const handlePlaybookSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(playbookFormData);
    if (Object.keys(errors).length > 0) {
      setPlaybookErrors(errors);
      return;
    }
    setPlaybookErrors({});
    setPlaybookSubmitted(true);
  };

  const handleSubredditsSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(subredditsFormData);
    if (Object.keys(errors).length > 0) {
      setSubredditsErrors(errors);
      return;
    }
    setSubredditsErrors({});
    setSubredditsSubmitted(true);
  };

  const handlePlaybookDownload = () => {
    const link = document.createElement("a");
    link.href = "../Rixly_Reddit_LeadGen_Playbook.pdf";
    link.download = "Rixly_Reddit_LeadGen_Playbook.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPlaybookModalOpen(false);
  };

  const handlePlaybookInputChange = (field, value) => {
    setPlaybookFormData((prev) => ({ ...prev, [field]: value }));
    if (playbookErrors[field]) {
      setPlaybookErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubredditsInputChange = (field, value) => {
    setSubredditsFormData((prev) => ({ ...prev, [field]: value }));
    if (subredditsErrors[field]) {
      setSubredditsErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetPlaybookForm = () => {
    setPlaybookFormData({ name: "", email: "", mobile: "", companyName: "" });
    setPlaybookSubmitted(false);
    setPlaybookErrors({});
  };

  const resetSubredditsForm = () => {
    setSubredditsFormData({ name: "", email: "", mobile: "", companyName: "" });
    setSubredditsSubmitted(false);
    setSubredditsErrors({});
  };

  return (
    <section 
      id="free-resource" 
      className="py-16 md:py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Card */}
          <div className="bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-teal-100 dark:border-teal-900/30">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Book Image */}
              <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-teal-600/5 dark:from-teal-900/20 dark:to-teal-800/10">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-teal-200/20 rounded-full blur-xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-teal-300/20 rounded-full blur-lg" />
                
                {/* Book Cover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-48 h-64 md:w-56 md:h-72 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 rounded-lg shadow-2xl flex flex-col items-center justify-center p-6 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                    {/* Book spine effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-lg" />
                    
                    {/* Book content */}
                    <div className="text-center text-white">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
                      <div className="text-xs uppercase tracking-widest opacity-75 mb-2">Free Guide</div>
                      <h3 className="font-heading text-xl font-bold leading-tight">Reddit Lead Gen Playbook</h3>
                      <div className="mt-4 text-sm opacity-80">2026 Edition</div>
                    </div>
                  </div>
                  
                  {/* Shadow under book */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 blur-xl rounded-full" />
                </motion.div>
              </div>

              {/* Right Side - Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Free Resource</span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white"
                >
                  Free Reddit Lead Gen Playbook
                </motion.h2>

                {/* Subtitle/Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-lg text-slate-600 dark:text-slate-300 mb-6"
                >
                  Learn how to generate leads from Reddit with proven strategies and actionable tips.
                </motion.p>

                {/* What's inside */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">What's inside:</h3>
                  <ul className="space-y-2">
                    {[
                      "How to find your ideal customers on Reddit",
                      "Proven engagement strategies that convert",
                      "Templates and scripts for cold outreach",
                      "Case studies from successful campaigns"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-4"
                >
                  {/* Download Playbook Button */}
                  <Dialog open={playbookModalOpen} onOpenChange={(open) => {
                    setPlaybookModalOpen(open);
                    if (!open) resetPlaybookForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 text-lg font-medium group w-full"
                      >
                        <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        Download Free Playbook
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      {!playbookSubmitted ? (
                        <>
                          <DialogHeader>
                            <DialogTitle>Download Free Playbook</DialogTitle>
                            <DialogDescription>
                              Enter your details below to download the Reddit Lead Gen Playbook.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handlePlaybookSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="playbook-name">Name *</Label>
                              <Input
                                id="playbook-name"
                                placeholder="Your full name"
                                value={playbookFormData.name}
                                onChange={(e) => handlePlaybookInputChange("name", e.target.value)}
                                className={playbookErrors.name ? "border-red-500" : ""}
                              />
                              {playbookErrors.name && (
                                <p className="text-xs text-red-500">{playbookErrors.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="playbook-email">Email *</Label>
                              <Input
                                id="playbook-email"
                                type="email"
                                placeholder="your@email.com"
                                value={playbookFormData.email}
                                onChange={(e) => handlePlaybookInputChange("email", e.target.value)}
                                className={playbookErrors.email ? "border-red-500" : ""}
                              />
                              {playbookErrors.email && (
                                <p className="text-xs text-red-500">{playbookErrors.email}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="playbook-mobile">Mobile *</Label>
                              <Input
                                id="playbook-mobile"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={playbookFormData.mobile}
                                onChange={(e) => handlePlaybookInputChange("mobile", e.target.value)}
                                className={playbookErrors.mobile ? "border-red-500" : ""}
                              />
                              {playbookErrors.mobile && (
                                <p className="text-xs text-red-500">{playbookErrors.mobile}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="playbook-company">Company Name *</Label>
                              <Input
                                id="playbook-company"
                                placeholder="Your company name"
                                value={playbookFormData.companyName}
                                onChange={(e) => handlePlaybookInputChange("companyName", e.target.value)}
                                className={playbookErrors.companyName ? "border-red-500" : ""}
                              />
                              {playbookErrors.companyName && (
                                <p className="text-xs text-red-500">{playbookErrors.companyName}</p>
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-teal-600 hover:bg-teal-700"
                            >
                              Submit & Download
                            </Button>
                          </form>
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                          <p className="text-slate-600 mb-6">
                            Your details have been submitted. Click below to download the playbook.
                          </p>
                          <Button
                            onClick={handlePlaybookDownload}
                            className="bg-teal-600 hover:bg-teal-700 w-full"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Get 5 Subreddits Free Button */}
                  <Dialog open={subredditsModalOpen} onOpenChange={(open) => {
                    setSubredditsModalOpen(open);
                    if (!open) resetSubredditsForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="cta-attention border-teal-600 text-teal-700 hover:bg-teal-50 rounded-full px-8 text-lg font-medium group w-full"
                      >
                        Get 5 Subreddits for FREE
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      {!subredditsSubmitted ? (
                        <>
                          <DialogHeader>
                            <DialogTitle>Get 5 High-Value Subreddits</DialogTitle>
                            <DialogDescription>
                              Enter your details below to get 5 hand-picked subreddits for your niche.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubredditsSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="subreddits-name">Name *</Label>
                              <Input
                                id="subreddits-name"
                                placeholder="Your full name"
                                value={subredditsFormData.name}
                                onChange={(e) => handleSubredditsInputChange("name", e.target.value)}
                                className={subredditsErrors.name ? "border-red-500" : ""}
                              />
                              {subredditsErrors.name && (
                                <p className="text-xs text-red-500">{subredditsErrors.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subreddits-email">Email *</Label>
                              <Input
                                id="subreddits-email"
                                type="email"
                                placeholder="your@email.com"
                                value={subredditsFormData.email}
                                onChange={(e) => handleSubredditsInputChange("email", e.target.value)}
                                className={subredditsErrors.email ? "border-red-500" : ""}
                              />
                              {subredditsErrors.email && (
                                <p className="text-xs text-red-500">{subredditsErrors.email}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subreddits-mobile">Mobile *</Label>
                              <Input
                                id="subreddits-mobile"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={subredditsFormData.mobile}
                                onChange={(e) => handleSubredditsInputChange("mobile", e.target.value)}
                                className={subredditsErrors.mobile ? "border-red-500" : ""}
                              />
                              {subredditsErrors.mobile && (
                                <p className="text-xs text-red-500">{subredditsErrors.mobile}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subreddits-company">Company Name *</Label>
                              <Input
                                id="subreddits-company"
                                placeholder="Your company name"
                                value={subredditsFormData.companyName}
                                onChange={(e) => handleSubredditsInputChange("companyName", e.target.value)}
                                className={subredditsErrors.companyName ? "border-red-500" : ""}
                              />
                              {subredditsErrors.companyName && (
                                <p className="text-xs text-red-500">{subredditsErrors.companyName}</p>
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-teal-600 hover:bg-teal-700"
                            >
                              Submit & Get Subreddits
                            </Button>
                          </form>
                        </>
                      ) : (
                        <div className="py-6">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                            <p className="text-slate-600">
                              Here are 5 high-value subreddits for your business:
                            </p>
                          </div>
                          <div className="space-y-3">
                            {freeSubreddits.map((sub, index) => (
                              <a
                                key={index}
                                href={sub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <span className="font-medium text-slate-900">{sub.name}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                              </a>
                            ))}
                          </div>
                          <Button
                            onClick={() => setSubredditsModalOpen(false)}
                            className="w-full mt-6 bg-teal-600 hover:bg-teal-700"
                          >
                            Close
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    PDF Format • 2.5 MB • All fields are mandatory
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
