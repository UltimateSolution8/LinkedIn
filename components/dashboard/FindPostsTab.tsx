"use client";

import PostCard from "./PostCard";

const postsData = [
  {
    title: "Looking for a project management tool for a small remote team. Any recommendations?",
    excerpt: "We're a team of 8 developers and designers working remotely. We've tried Trello and Asana, but they feel a bit too complex for our needs. Looking for something simple with task tracking, deadlines, and basic collaboration features...",
    timeAgo: "5m ago",
    username: "u/SaaSWizard",
    subreddit: "r/SaaS",
    rating: 10,
  },
  {
    title: "What's the best CRM for a startup that's easy to set up and not too expensive?",
    excerpt: "Just closed our seed round and need to get a proper CRM in place. We have about 500 contacts right now but expect that to grow quickly. Main priorities are ease of use for the sales team and good integration options with other tools...",
    timeAgo: "2h ago",
    username: "u/FounderLife",
    subreddit: "r/startups",
    rating: 8,
  },
  {
    title: "Help! Our marketing team is drowning in spreadsheets. Need a good automation tool.",
    excerpt: "We're managing campaigns, content calendars, and lead tracking all in Google Sheets and it's becoming a nightmare. What are some good, all-in-one marketing automation platforms you'd recommend? Budget is flexible for the right solution.",
    timeAgo: "1d ago",
    username: "u/MarketingMaven",
    subreddit: "r/marketing",
    rating: 8,
  },
  {
    title: "Which email marketing platform has the best deliverability for B2B SaaS?",
    excerpt: "Currently using Mailchimp but our open rates have been dropping. We send a mix of newsletters and product updates to our user base. Who has the best reputation for getting into B2B inboxes these days? Considering ConvertKit or ActiveCampaign.",
    timeAgo: "3d ago",
    username: "u/EmailGeek",
    subreddit: "r/saas",
    rating: 6,
  },
];

export default function FindPostsTab() {
  return (
    <div className="flex flex-col gap-4 pt-6">
      {postsData.map((post, index) => (
        <PostCard key={index} {...post} />
      ))}
    </div>
  );
}
