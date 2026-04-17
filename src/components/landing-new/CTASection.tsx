// @ts-nocheck
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import LinkedInEarlyAccessDialog from "./LinkedInEarlyAccessDialog";
import { PopupButton } from "react-calendly";
import { useAuth } from "@/contexts/AuthContext";

export const CTASection = () => {
  const { user } = useAuth();
  return (
    <section
      id="cta"
      className="py-16 md:py-24 relative"
      data-testid="cta-section"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden ribbon-container"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-primary-gradient opacity-[0.08]" />
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />

          {/* Animated Ribbons */}
          <div className="ribbon top-[-10%] left-[-10%]" />
          <div className="ribbon top-[20%] left-[-20%] [animation-delay:-5s]" />
          <div className="ribbon top-[50%] left-[-15%] [animation-delay:-10s]" />

          {/* Animated Ripples */}
          <div className="ripple top-[20%] left-[10%] w-[400px] h-[400px]" />
          <div className="ripple bottom-[10%] right-[5%] w-[300px] h-[300px] [animation-delay:-4s]" />

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              data-testid="cta-title"
            >
              Start Turning Conversations Into Customers
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Join 10,000+ businesses using Rixly to transform their lead
              generation. 
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <LinkedInEarlyAccessDialog
                triggerClassName="rounded-full font-medium text-lg px-8 glow-primary glow-primary-hover btn-press"
                triggerLabel="LinkedIn early access"
              />
              {/* <Link to="/request-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-medium text-lg px-8 btn-press"
                  data-testid="cta-book-demo"
                >
                  Book a Demo
                </Button>
              </Link> */}
              <PopupButton
                url="https://calendly.com/rixlyleads/30min"
                rootElement={document.getElementById("root")!}
                text="Book a Demo"
                className="rounded-full font-medium text-lg px-8 py-3 btn-press border-2 border-primary/20 hover:bg-primary/5 transition-colors"
                data-testid="cta-book-demo"
                prefill={{
                  email: user?.email || "",
                  name: user ? `${user.firstName} ${user.lastName}` : "",
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              Limited spots available
            </motion.p>
          </div>

          {/* Decorative glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
