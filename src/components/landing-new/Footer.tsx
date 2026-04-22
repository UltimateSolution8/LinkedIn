// @ts-nocheck
import { Link } from "react-router-dom";

const footerLinks = {
  services: [
    { label: "Profile Optimization", href: "#" },
    { label: "Lead Generation", href: "#" },
    { label: "Outreach", href: "#" },
    { label: "Content Strategy", href: "#" },
    { label: "Appointment Setting", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Blog", to: "/blogs" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "Refund Policy", to: "/refund-policy" },
  ],
};

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "Twitter", href: "#", icon: "X" },
  { label: "Instagram", href: "#", icon: "ig" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
                <span className="text-lg font-bold text-white">U</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">userixly</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              LinkedIn lead generation that actually works. Get 20-50 qualified meetings every month.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-muted-foreground transition-all hover:bg-primary hover:text-white hover:-translate-y-0.5" aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Services</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((l) => (
                <li key={l.label}><a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Company</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                  ) : (
                    <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <Link to={l.to!} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-border/30 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Userixly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
