// @ts-nocheck
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ankit Mehra",
    role: "Founder & CEO",
    company: "TechNova SaaS Solutions",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Finally a lead tool that actually works",
    content: "I started using Rixly about 3 weeks ago for my SaaS business. It found leads in subreddits we hadn't even considered targeting. We got three good discovery calls within the first week.",
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    role: "Head of Growth",
    company: "BrightPeak Digital",
    location: "Austin, USA",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Saves me hours every day",
    content: "Before Rixly, I was spending at least 2-3 hours daily scanning Reddit and DMs. With Rixly's alerts and reply suggestions, I cut that down to ~30 minutes.",
  },
  {
    id: 3,
    name: "James Parker",
    role: "Marketing Director",
    company: "NextWave Tech",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Unexpected but real results",
    content: "We picked Rixly as an experiment and to our surprise, we got a lead this week directly via a Reddit conversation it flagged. That lead turned into a paying client within days.",
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "VP of Sales",
    company: "CloudScale Inc",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Transformed our outreach strategy",
    content: "Rixly has completely transformed how we approach Reddit lead generation. The AI-powered suggestions are spot-on, and we've seen a 3x increase in qualified meetings.",
  },
  {
    id: 5,
    name: "Luca Moretti",
    role: "Managing Director",
    company: "SocialSeed Agency",
    location: "Milan, Italy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Great for niche markets",
    content: "We sell consulting services in a very specific niche. Most traditional lead-gen tools struggle. Rixly helped us find Reddit threads where people were discussing similar topics.",
  },
  {
    id: 6,
    name: "Rohit Sinha",
    role: "Performance Marketing Lead",
    company: "Adzoid Marketing",
    location: "Delhi NCR, India",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Good ROI from day one",
    content: "After half a month we got five new leads from Reddit via Rixly, and two converted into clients. The time saved alone is worth the investment.",
  },
  {
    id: 7,
    name: "Sarah Chen",
    role: "Founder",
    company: "GrowthStack",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Game-changer for B2B SaaS",
    content: "As a founder wearing multiple hats, Rixly has been a game-changer. It automates what used to take me hours every week. I've closed two enterprise clients directly from Reddit conversations.",
  },
  {
    id: 8,
    name: "Marcus Weber",
    role: "Growth Manager",
    company: "TechFlow GmbH",
    location: "Berlin, Germany",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    rating: 5,
    title: "Essential tool for modern growth teams",
    content: "We've tried numerous lead generation tools, but Rixly is the only one that actually delivers on Reddit. The keyword tracking and AI reply suggestions are exceptional.",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="flex-shrink-0 w-[350px]">
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 h-full flex flex-col mr-6">
      <Quote className="w-8 h-8 text-teal-500 mb-4" />
      
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
      
      <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">
        {testimonial.title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
        "{testimonial.content}"
      </p>
      
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-100"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=1e868d&color=fff`;
          }}
        />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">
            {testimonial.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {testimonial.role}, {testimonial.company}
          </p>
          <p className="text-xs text-teal-600 dark:text-teal-400">
            {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 relative overflow-hidden"
      data-testid="testimonials-section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-transparent to-teal-50/50" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Customer Success Stories</span>
          </div>
          <h2
            className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-white"
            data-testid="testimonials-title"
          >
            Trusted by growth teams worldwide
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            See how companies are using Rixly to discover leads and grow their business on Reddit
          </p>
        </motion.div>

        {/* Continuous Auto-scrolling Testimonials */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set */}
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`first-${testimonial.id}`} testimonial={testimonial} />
            ))}
            {/* Duplicate set for seamless infinite scroll */}
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`second-${testimonial.id}`} testimonial={testimonial} />
            ))}
            {/* Third set for extra smoothness */}
            {testimonials.map((testimonial) => (
              <TestimonialCard key={`third-${testimonial.id}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* CSS for continuous scroll animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
