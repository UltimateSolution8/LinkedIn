// @ts-nocheck
import { motion } from "framer-motion";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/lbXFZXs_BzI?rel=0&modestbranding=1";

export const VideoSection = () => {
  return (
    <section
      id="video"
      className="py-16 md:py-24 relative"
      data-testid="video-section"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-heading text-2xl md:text-3xl font-semibold tracking-tight mb-4"
            data-testid="video-title"
          >
            Watch how businesses are transforming their lead generation with our platform
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="video-container aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl">
            <iframe
              src={YOUTUBE_EMBED_URL}
              title="Rixly Platform Walkthrough"
              className="w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              data-testid="walkthrough-video"
            />
          </div>

          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
