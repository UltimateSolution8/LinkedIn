// @ts-nocheck
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const articles = [
  { title: "7 LinkedIn Outreach Tips That Get Replies", category: "Outreach", gradient: "from-blue-500/10 to-indigo-500/10" },
  { title: "How to Optimize Your LinkedIn Profile for Leads", category: "Profile", gradient: "from-purple-500/10 to-pink-500/10" },
  { title: "LinkedIn Content Strategy That Works", category: "Content", gradient: "from-emerald-500/10 to-teal-500/10" },
];

export function ResourcesSection() {
  return (
    <section id="blog" className="relative bg-background py-20 md:py-28">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Blog</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Resources & Insights</h2>
            <p className="mt-3 text-base text-muted-foreground">Tips, strategies, and insights to grow your business with LinkedIn.</p>
            <div className="mt-8 grid gap-4">
              {articles.map((article) => (
                <div key={article.title} className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${article.gradient}`}>
                      <span className="text-xs font-bold text-primary">{article.category.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-primary">{article.category}</span>
                      <h3 className="mt-0.5 text-base font-semibold text-foreground">{article.title}</h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              ))}
            </div>
            <Link to="/blogs">
              <Button variant="outline" className="mt-6 h-11 rounded-xl border-border bg-card px-6 text-sm font-semibold transition-all hover:border-primary/30">
                View All Articles
              </Button>
            </Link>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-card md:p-10">
              <h3 className="font-heading text-2xl font-bold text-foreground">Get LinkedIn Growth Tips Straight to Your Inbox</h3>
              <p className="mt-3 text-base text-muted-foreground">Join 1000+ founders & marketers.</p>
              <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="h-12 flex-1 rounded-xl border border-border bg-secondary/50 px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <Button type="submit" className="h-12 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
