"use client";

import { Star } from "lucide-react";

interface PostCardProps {
  title: string;
  excerpt: string;
  timeAgo: string;
  username: string;
  subreddit: string;
  rating: number;
}

export default function PostCard({
  title,
  excerpt,
  timeAgo,
  username,
  subreddit,
  rating,
}: PostCardProps) {
  const maxStars = 5;
  const filledStars = Math.round((rating / 10) * maxStars);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal">
        {title}
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal -mt-2">
        {excerpt}
      </p>

      <div className="flex items-center justify-between">
        {/* Post Metadata */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span>{timeAgo}</span>
          <span>•</span>
          <span>{username}</span>
          <span>•</span>
          <span>{subreddit}</span>
        </div>

        {/* AI Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(maxStars)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < filledStars
                    ? "fill-teal-500 text-teal-500"
                    : "fill-neutral-300 text-neutral-300 dark:fill-neutral-600 dark:text-neutral-600"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-teal-500">{rating}/10</span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
            RIXLY AI RATING
          </span>
        </div>
      </div>
    </div>
  );
}
