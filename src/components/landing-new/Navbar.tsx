// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

export const Navbar = ({ isDark, toggleTheme, setView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#free-resource", label: "Resources" },
    { href: "#pricing", label: "Pricing" },
    { label: "ROI", onClick: () => setView("roi"), hidden: true },
    { label: "Analytics", onClick: () => setView("dashboard"), hidden: true },
    { to: "/blogs", label: "Blogs" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
        : "bg-transparent"
        }`}
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" data-testid="logo">
            <img
              src="/logo.png"
              alt="Rixly Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-heading font-bold text-2xl tracking-tighter text-slate-900 dark:text-white">
              RIXLY
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.onClick || (() => document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" }))}
                  className={`text-muted-foreground hover:text-primary transition-colors duration-200 font-medium ${link.hidden ? "hidden" : ""}`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              data-testid="theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link to="/contactus">
              <Button
                variant="ghost"
                className="font-medium"
                data-testid="nav-contact"
              >
                Contact
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="ghost"
                className="font-medium"
                data-testid="nav-login"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                className="rounded-full font-medium glow-primary glow-primary-hover btn-press"
                data-testid="nav-get-started"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              data-testid="mobile-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="mx-1 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-xl shadow-lg p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left text-slate-900 dark:text-white hover:text-primary transition-colors duration-200 font-semibold py-2.5 text-base"
                    data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.onClick) link.onClick();
                      else document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" });
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-slate-900 dark:text-white hover:text-primary transition-colors duration-200 font-semibold py-2.5 text-base ${link.hidden ? "hidden" : ""}`}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/contactus" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full font-medium"
                    data-testid="mobile-book-demo"
                  >
                    Contact
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    className="w-full rounded-full font-medium glow-primary"
                    data-testid="mobile-get-started"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
