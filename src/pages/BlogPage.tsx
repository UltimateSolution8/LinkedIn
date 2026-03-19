// @ts-nocheck
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Search, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getPosts, getCategories } from "@/lib/sanity";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL || "";

// Sample fallback posts - used when Sanity is not configured
const samplePosts = [
  {
    id: 1,
    slug: "why-cold-email-is-dead",
    title: "Why Cold Email Is Dead (And What's Quietly Replacing It)",
    excerpt: "The average cold email response rate in 2025 is 1-3%. That's 97 emails out of 100 that disappear into the void. Here's what's quietly replacing it...",
    coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60",
    author: { name: "Rixly Team", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60" },
    publishedAt: "2026-03-13",
    readTime: "8 min read",
    category: "Lead Generation",
    featured: true,
    body: `
      <p class="text-xl text-slate-600 mb-6">Let's start with a number nobody in sales wants to say out loud: <strong class="text-primary">the average cold email response rate in 2025 is 1-3%.</strong></p>
      
      <p class="text-lg text-slate-600 mb-6">That means for every 100 emails your team carefully crafts, personalizes, and sends, 97 of them disappear into the void. No reply. No meeting booked. No deal.</p>
      
      <p class="text-lg text-slate-600 mb-6"><strong>And it's getting worse.</strong></p>
      
      <p class="text-slate-600 mb-6">Inboxes are more protected than ever. Spam filters have become ruthless. Decision-makers have trained themselves to ignore anything that smells like outreach. The average person receives 121 business emails per day, and buyers have become remarkably efficient at deleting them.</p>
      
      <div class="bg-amber-50 border-l-4 border-amber-500 p-6 my-8">
        <p class="text-amber-800 font-medium">Yet most B2B companies are still doubling down on cold email. More sequences. More A/B tests on subject lines. More tools to "personalize at scale."</p>
      </div>
      
      <p class="text-lg text-slate-600 mb-6">Meanwhile, a small group of growth teams discovered something quietly powerful, and it doesn't involve a single cold email.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">The Channel Nobody Is Competing In</h2>
      
      <p class="text-slate-600 mb-6">Every day, your ideal buyers open Reddit and do something remarkable: <strong class="text-primary">they ask for help publicly.</strong></p>
      
      <p class="text-slate-600 mb-4">They post things like:</p>
      <ul class="list-disc list-inside space-y-2 text-slate-600 mb-6 bg-slate-50 p-6 rounded-lg">
        <li>"We're a 20-person SaaS team outgrowing HubSpot. What are you using for CRM?"</li>
        <li>"Our agency needs a tool that does X. Has anyone tried Y or Z?"</li>
        <li>"Comparing [Competitor A] vs [Competitor B]. Anyone made this switch recently?"</li>
      </ul>
      
      <p class="text-lg text-slate-600 mb-6">These aren't passive browsers. These are buyers in active decision mode, describing their exact problem, often naming their budget, and asking their community for recommendations.</p>
      
      <div class="bg-teal-50 border-l-4 border-teal-500 p-6 my-8">
        <p class="text-teal-800 font-medium">This is a gold mine. And almost no one is showing up for it.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">What Happens When You Stop Interrupting and Start Listening</h2>
      
      <p class="text-slate-600 mb-6">Here's the fundamental shift:</p>
      
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-red-50 p-6 rounded-lg">
          <h3 class="font-bold text-red-800 mb-3">❌ Cold Email</h3>
          <p class="text-slate-600 text-sm">You interrupt a stranger who didn't ask to hear from you, hope they read it, hope your timing is right, hope your offer matches a need they have right now.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="font-bold text-green-800 mb-3">✅ Reddit Monitoring</h3>
          <p class="text-slate-600 text-sm">You find someone who already has the problem you solve, already wants help, and is actively asking for it in a public forum.</p>
        </div>
      </div>
      
      <p class="text-lg text-slate-600 mb-6">The intent gap between these two channels is enormous. Cold email buyers might be interested. Reddit buyers are already looking.</p>
      
      <div class="bg-primary-gradient text-white p-8 rounded-2xl my-12 text-center">
        <p class="text-3xl font-bold mb-2">6 demos in 30 days</p>
        <p class="text-teal-100">$8,000 in pipeline generated purely from Reddit conversations</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">Why Reddit Converts Better Than You'd Expect</h2>
      
      <p class="text-slate-600 mb-6">Reddit's reputation as a "weird internet forum" has kept most B2B marketers away. That's actually the opportunity.</p>
      
      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-slate-100">
              <th class="p-4 text-left font-bold text-slate-900">Channel</th>
              <th class="p-4 text-left font-bold text-slate-900">Cost</th>
              <th class="p-4 text-left font-bold text-slate-900">Intent Level</th>
              <th class="p-4 text-left font-bold text-slate-900">Competition</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="p-4 text-slate-600">Cold Email</td>
              <td class="p-4 text-slate-600">Medium</td>
              <td class="p-4 text-red-500">Low</td>
              <td class="p-4 text-red-500">Very High</td>
            </tr>
            <tr class="border-b">
              <td class="p-4 text-slate-600">LinkedIn Ads</td>
              <td class="p-4 text-slate-600">High</td>
              <td class="p-4 text-yellow-500">Medium</td>
              <td class="p-4 text-red-500">High</td>
            </tr>
            <tr class="bg-green-50">
              <td class="p-4 text-slate-900 font-medium">Reddit Conversations</td>
              <td class="p-4 text-green-600 font-medium">Low</td>
              <td class="p-4 text-green-600 font-medium">High</td>
              <td class="p-4 text-green-600 font-medium">Low</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="text-slate-600 mb-6">Reddit users are notoriously sceptic of overt marketing, which means the bar for authentic, valuable engagement is higher, but the reward is proportionally bigger.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p class="text-blue-800"><strong>SEO Bonus:</strong> Reddit threads rank on Google. When someone searches "best CRM for small SaaS teams," they often land on a Reddit thread. Your presence in that thread is SEO exposure, brand awareness, and lead generation all in one comment.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">The Problem With Doing This Manually</h2>
      
      <p class="text-slate-600 mb-6">The logic is simple. The execution is painful.</p>
      
      <p class="text-slate-600 mb-4">To monitor Reddit conversations manually, you'd need to:</p>
      <ol class="list-decimal list-inside space-y-3 text-slate-600 mb-6 bg-slate-50 p-6 rounded-lg">
        <li>Identify every relevant subreddit for your ICP (there are often 15 to 30 of them)</li>
        <li>Check each one multiple times per day for new posts</li>
        <li>Filter out noise to find genuinely high-intent conversations</li>
        <li>Craft responses that are helpful enough to be upvoted and not flagged as spam</li>
        <li>Track which conversations led to clicks, demos, or deals</li>
        <li>Do this across your entire team, consistently, every single day</li>
      </ol>
      
      <div class="bg-red-50 border-l-4 border-red-500 p-6 my-8">
        <p class="text-red-800 font-medium">Most teams try this for two weeks, burn out, and go back to cold email.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">How Rixly Changes the Equation</h2>
      
      <p class="text-slate-600 mb-8">Rixly was built specifically for this problem. Here's how it works:</p>
      
      <div class="space-y-6">
        <div class="flex gap-4">
          <div class="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
          <div>
            <h3 class="font-bold text-slate-900 mb-2">Monitor</h3>
            <p class="text-slate-600">Tell Rixly which subreddits matter for your business. It watches them in real time and surfaces conversations where your ideal buyer is showing purchase intent.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
          <div>
            <h3 class="font-bold text-slate-900 mb-2">Engage</h3>
            <p class="text-slate-600">Rixly's AI suggests contextual replies for each conversation. You review, edit, and post. You stay in control.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
          <div>
            <h3 class="font-bold text-slate-900 mb-2">Convert</h3>
            <p class="text-slate-600">Every engagement is tracked with CRM-connected links. You see exactly which conversations turned into clicks, demo bookings, and pipeline.</p>
          </div>
        </div>
      </div>
      
      <div class="bg-primary-gradient text-white p-8 rounded-2xl my-12 text-center">
        <p class="text-2xl font-bold mb-2">20-30 minutes per day</p>
        <p class="text-teal-100">The results look like the work of a full-time community manager.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">This Isn't Scraping. It Isn't Spam.</h2>
      
      <p class="text-slate-600 mb-6">Rixly is not a scraping tool. It doesn't automate mass replies. It doesn't blast comments across subreddits. Every response is reviewed and posted by a real person on your team.</p>
      
      <div class="bg-green-50 border-l-4 border-green-500 p-6 my-8">
        <p class="text-green-800"><strong>Strategic Position:</strong> Brands that try to automate Reddit spam get banned fast. The companies quietly winning on Reddit are the ones who show up like a knowledgeable human, not a bot.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">What's Coming: LinkedIn, Then Twitter</h2>
      
      <p class="text-slate-600 mb-6">Reddit is where Rixly lives today. But the same principle applies to every social platform. LinkedIn conversation monitoring is launching in the next 60 days.</p>
      
      <h2 class="text-2xl font-bold text-slate-900 mt-12 mb-6">The Bottom Line</h2>
      
      <p class="text-lg text-slate-600 mb-6">Cold email had a good run. That era is over.</p>
      
      <p class="text-lg text-slate-600 mb-6">The teams winning at lead generation in 2025 aren't the ones with the cleverest email sequences. They're the ones who stopped shouting and started listening.</p>
      
      <div class="bg-teal-900 text-white p-8 rounded-2xl my-12 text-center">
        <p class="text-2xl font-bold mb-4">The only question is whether you find them before your competitors do.</p>
        <a href="/#pricing" class="inline-block">
          <Button className="bg-white text-teal-700 hover:bg-teal-50 font-bold text-lg px-8 py-3">
            Start Finding Warm Leads for Free
          </Button>
        </a>
      </div>
    `,
  },
];

const defaultCategories = ["All", "Lead Generation", "AI & Automation", "Sales", "Marketing", "Strategy"];
const fallbackCoverImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=70",
];

export default function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  
  const postsPerPage = 6;
  const normalizeSlug = (value) => String(value || "").replace(/^\/+/, "").trim();

  // Check if Sanity is configured and fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts from Sanity first (required).
        // sanityClient already includes safe project/dataset fallbacks.
        const postsData = await getPosts();

        // Fetch categories separately (optional). A category query failure should not hide all posts.
        let categoriesData = [];
        try {
          categoriesData = await getCategories();
        } catch (categoryError) {
          console.warn("Sanity categories fetch failed; deriving categories from posts.", categoryError);
        }

        const transformedPosts = (postsData || []).map((post, index) => {
          const normalizedSlug = normalizeSlug(post.slug || `post-${index}`);
          return {
            id: post._id || index + 1,
            slug: normalizedSlug,
          title: post.title,
          excerpt: post.excerpt,
          coverImage: post.coverImageUrl || fallbackCoverImages[index % fallbackCoverImages.length],
          author: {
            name: post.author?.name || "Unknown Author",
            avatar: post.author?.avatarUrl || "",
          },
          publishedAt: post.publishedAt || new Date().toISOString(),
          readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
          category: post.category || "Uncategorized",
          featured: !!post.featured,
          body: post.body || "",
          };
        }).filter((post) => post.slug.length > 0 && post.title);

        const categoryFromPosts = Array.from(
          new Set(transformedPosts.map((post) => post.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        const categoryFromSanity = (categoriesData || []).map((cat) => cat.title).filter(Boolean);
        const mergedCategories = Array.from(
          new Set([...categoryFromSanity, ...categoryFromPosts])
        );

        if (transformedPosts.length === 0) {
          console.warn("Sanity returned no publishable posts. Falling back to sample content.");
          setPosts(samplePosts);
          setCategories(defaultCategories);
          return;
        }

        setPosts(transformedPosts);
        setCategories(["All", ...(mergedCategories.length > 0 ? mergedCategories : defaultCategories.slice(1))]);
      } catch (err) {
        console.error("Error fetching from Sanity:", err);
        setError("Failed to load blog posts from Sanity. Showing fallback content.");

        // Always provide visible content fallback on runtime/API failures.
        setPosts(samplePosts);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handle slug parameter from URL
  useEffect(() => {
    if (slug && posts.length > 0) {
      const normalizedSlug = normalizeSlug(slug);
      const post = posts.find(p => normalizeSlug(p.slug) === normalizedSlug);
      if (post) {
        setExpandedPost(post);
      }
    }
  }, [slug, posts]);

  // Filter posts by category and search
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Get featured post (first post with featured: true or first post)
  const featuredPost = posts.find(p => p.featured) || posts[0];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openPost = (post) => {
    const normalizedSlug = normalizeSlug(post?.slug);
    if (!normalizedSlug) return;
    setExpandedPost(post);
    navigate(`/blog/${normalizedSlug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubscribe = async (event) => {
    event.preventDefault();

    const email = newsletterEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNewsletterError("Please enter a valid email address");
      setNewsletterMessage("");
      return;
    }

    if (!RIXLY_API_BASE_URL) {
      setNewsletterError("Newsletter service is not configured.");
      setNewsletterMessage("");
      return;
    }

    setNewsletterLoading(true);
    setNewsletterError("");
    setNewsletterMessage("");
    try {
      const response = await fetch(`${RIXLY_API_BASE_URL}/api/public/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          source: "blog_newsletter",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to subscribe");
      }

      setNewsletterMessage("Subscribed successfully. We’ll keep you updated.");
      setNewsletterEmail("");
    } catch (subscribeError) {
      setNewsletterError(subscribeError instanceof Error ? subscribeError.message : "Failed to subscribe");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const renderPostContent = (body, excerpt) => {
    if (typeof body === "string" && body.trim().length > 0) {
      return (
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      );
    }

    if (Array.isArray(body) && body.length > 0) {
      const nodes = [];
      let listType = null;
      let listItems = [];
      let listIndex = 0;

      const flushList = () => {
        if (!listType || listItems.length === 0) return;
        if (listType === "ol") {
          nodes.push(
            <ol key={`ol-${listIndex}`} className="list-decimal pl-6 my-4 space-y-2">
              {listItems}
            </ol>
          );
        } else {
          nodes.push(
            <ul key={`ul-${listIndex}`} className="list-disc pl-6 my-4 space-y-2">
              {listItems}
            </ul>
          );
        }
        listType = null;
        listItems = [];
        listIndex += 1;
      };

      body.forEach((block, index) => {
        if (block?._type !== "block") return;
        const text = (block.children || [])
          .map((child) => child?.text || "")
          .join("")
          .trim();
        if (!text) return;

        if (block.listItem) {
          const currentListType = block.listItem === "number" ? "ol" : "ul";
          if (listType && listType !== currentListType) flushList();
          listType = currentListType;
          listItems.push(<li key={`li-${index}`}>{text}</li>);
          return;
        }

        flushList();

        if (block.style === "h2") {
          nodes.push(
            <h2 key={`h2-${index}`} className="text-2xl font-bold mt-10 mb-4">
              {text}
            </h2>
          );
          return;
        }

        if (block.style === "h3") {
          nodes.push(
            <h3 key={`h3-${index}`} className="text-xl font-semibold mt-8 mb-3">
              {text}
            </h3>
          );
          return;
        }

        if (block.style === "blockquote") {
          nodes.push(
            <blockquote key={`quote-${index}`} className="border-l-4 border-primary/40 pl-4 italic my-4 text-slate-700 dark:text-slate-300">
              {text}
            </blockquote>
          );
          return;
        }

        nodes.push(
          <p key={`p-${index}`} className="my-4 leading-8 text-slate-700 dark:text-slate-300">
            {text}
          </p>
        );
      });

      flushList();

      if (nodes.length > 0) {
        return <div className="prose prose-lg max-w-none dark:prose-invert">{nodes}</div>;
      }
    }

    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>{excerpt || ""}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Render expanded post view
  if (expandedPost) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative h-96">
          <img
            src={expandedPost.coverImage}
            alt={expandedPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Blogs
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl -mt-32 relative z-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12"
          >
            <Badge className="w-fit bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground mb-4">
              {expandedPost.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {expandedPost.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              {expandedPost.author?.avatar && (
                <img
                  src={expandedPost.author.avatar}
                  alt={expandedPost.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{expandedPost.author?.name}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(expandedPost.publishedAt)}
                  <span className="mx-1">•</span>
                  <Clock className="w-4 h-4" />
                  {expandedPost.readTime}
                </div>
              </div>
            </div>
            
            {/* Blog Content */}
            {renderPostContent(expandedPost.body, expandedPost.excerpt)}
            
            {/* CTA */}
            <div className="mt-12 pt-8 border-t">
              <div className="bg-primary-gradient rounded-2xl p-8 text-center text-white">
                <h3 className="text-xl font-bold mb-4">Ready to transform your lead generation?</h3>
                <p className="text-teal-100 mb-6">Start finding warm leads from Reddit conversations today.</p>
                <Link to="/#pricing">
                  <Button className="bg-white text-primary hover:bg-primary/5 font-bold px-8">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-primary-gradient py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Rixly Blog
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Insights, tips, and strategies to help you grow your business with AI-powered lead generation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 max-w-7xl -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full ${
                    selectedCategory === category
                      ? "bg-primary hover:bg-primary/90"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Post */}
      {selectedCategory === "All" && searchQuery === "" && currentPage === 1 && featuredPost && (
        <div className="container mx-auto px-4 max-w-7xl mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Featured Article</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden trace-beam border border-border/50">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    {featuredPost.author?.avatar && (
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{featuredPost.author?.name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredPost.publishedAt)}
                        <span className="mx-1">•</span>
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openPost(featuredPost)}
                    className="bg-primary hover:bg-primary/90 rounded-full w-fit inline-flex items-center text-white px-6 py-3 font-medium cursor-pointer"
                  >
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
          </h2>

          {currentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="trace-beam bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 hover:text-primary dark:hover:text-primary-400 transition-colors">
                      <button onClick={() => openPost(post)}>{post.title}</button>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        {post.author?.avatar && (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {post.author?.name}
                        </span>
                      </div>
                      <button
                        onClick={() => openPost(post)}
                        className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        View Article <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No articles found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-primary mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={`rounded-full ${
                  currentPage === page ? "bg-primary hover:bg-primary/90" : ""
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="container mx-auto px-4 max-w-7xl mt-16 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-primary-gradient rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stay Updated with Our Latest Insights
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto mb-6">
            Subscribe to our newsletter and get the latest articles, tips, and strategies delivered straight to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
            />
            <Button
              type="submit"
              disabled={newsletterLoading}
              className="h-12 bg-white text-primary hover:bg-white/90 font-medium px-8 disabled:opacity-70"
            >
              {newsletterLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          {newsletterMessage && (
            <p className="mt-4 text-sm text-teal-100">{newsletterMessage}</p>
          )}
          {newsletterError && (
            <p className="mt-4 text-sm text-red-100">{newsletterError}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
