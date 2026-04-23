// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CALENDLY_URL = "https://calendly.com/rixlyleads/30min";

export const Navbar = ({ isDark, toggleTheme, setView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#testimonials", label: "Testimonials" },
    { to: "/blogs", label: "Blog" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-navbar"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 lg:h-[76px] lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group" data-testid="logo">
          <img src="/logo.png" alt="Rixly Logo" className="h-10 w-auto max-w-[40px] object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="font-heading text-[26px] font-bold tracking-tight text-foreground">
            Rixly
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() =>
                  document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            )
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-secondary transition-colors duration-200"
            data-testid="theme-toggle"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md decoration-transparent hover:decoration-transparent"
                    data-testid="nav-book-demo"
                  >
                    Book Demo
                  </a>
                  <Link to="/dashboard">
                    <Button className="h-11 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5">
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md decoration-transparent hover:decoration-transparent"
                    data-testid="nav-book-demo"
                  >
                    Book Demo
                  </a>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-[15px] font-medium"
                      data-testid="nav-login"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="h-11 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-secondary" aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden py-4 border-t border-border/50"
        >
          <div className="mx-4 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-lg p-4 flex flex-col gap-2">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </button>
              )
            )}
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
              {!isLoading && (
                <>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-sm px-4 py-2.5 rounded-md border border-border hover:bg-secondary transition-colors text-center font-medium decoration-transparent hover:decoration-transparent"
                    data-testid="mobile-book-demo"
                  >
                    Book Demo
                  </a>
                  {isAuthenticated ? (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-12 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-12 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md">
                        Log in
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
