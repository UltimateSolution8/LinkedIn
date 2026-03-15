// @ts-nocheck
import { motion } from "framer-motion";
import { Play, Pause, MessageCircle, ArrowUp, ThumbsUp } from "lucide-react";
import { useState, useRef } from "react";

const mockRedditPosts = [
  {
    subreddit: "r/SaaS",
    title: "Looking for project management tool - what do you all use?",
    relevance: "98%",
    comments: 47,
    upvotes: 124,
  },
  {
    subreddit: "r/startups",
    title: "Best CRM for early stage startup? Need something affordable",
    relevance: "95%",
    comments: 32,
    upvotes: 89,
  },
  {
    subreddit: "r/B2B",
    title: "How do you handle lead generation? Cold outreach not working",
    relevance: "92%",
    comments: 56,
    upvotes: 201,
  },
];

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
          <div className="video-container aspect-video rounded-2xl overflow-hidden bg-card border border-border/50">
            {/* Video element with sample video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=675&fit=crop"
              data-testid="walkthrough-video"
              onEnded={() => setIsPlaying(false)}
            >
              <source
                src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-300 group"
              data-testid="video-play-button"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center glow-primary"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
