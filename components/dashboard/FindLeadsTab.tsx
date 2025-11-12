"use client";

import LeadCard from "./LeadCard";

const leadsData = [
  {
    username: "u/SaaSWizard",
    rating: 10,
    sourcePost: "Looking for a project management tool for a small remote team. Any recommendations?",
    subreddit: "r/SaaS",
    reasonForMatch: 'User is explicitly asking for a "project management tool" for a "remote team," which directly matches your keywords "project management" and "SaaS".',
  },
  {
    username: "u/FounderLife",
    rating: 8,
    sourcePost: "What's the best CRM for a startup that's easy to set up and not too expensive?",
    subreddit: "r/startups",
    reasonForMatch: 'User is asking for a "CRM for a startup," which matches your keyword "CRM". High purchase intent is indicated.',
  },
  {
    username: "u/MarketingMaven",
    rating: 7,
    sourcePost: "Help! Our marketing team is drowning in spreadsheets. Need a good automation tool.",
    subreddit: "r/marketing",
    reasonForMatch: 'User is seeking a "marketing automation tool", which is a strong adjacent keyword to your "SaaS marketing" project.',
  },
];

export default function FindLeadsTab() {
  return (
    <div className="flex flex-col gap-4 pt-6">
      {leadsData.map((lead, index) => (
        <LeadCard key={index} {...lead} />
      ))}
    </div>
  );
}
