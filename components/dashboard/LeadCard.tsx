"use client";

import { ExternalLink, ThumbsUp, ThumbsDown, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeadCardProps {
  username: string;
  rating: number;
  sourcePost: string;
  subreddit: string;
  reasonForMatch: string;
  postUrl?: string;
}

export default function LeadCard({
  username,
  rating,
  sourcePost,
  subreddit,
  reasonForMatch,
  postUrl = "#",
}: LeadCardProps) {
  const maxStars = 10;

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex flex-col">
        {/* Header - Username and Rating */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`https://reddit.com/user/${username.replace('u/', '')}`}
                target="_blank"
                className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal hover:underline"
              >
                {username}
              </Link>
              <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 -rotate-45" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(maxStars)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < rating
                      ? "fill-teal-500 text-teal-500"
                      : "fill-neutral-300 text-neutral-300 dark:fill-neutral-600 dark:text-neutral-600"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-teal-500 text-sm">{rating}/10</span>
          </div>
        </div>

        {/* Source Post Section */}
        <div className="mt-4">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
            Source Post
          </p>
          <p className="text-neutral-950 dark:text-white text-base font-medium mt-2">
            {sourcePost}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">in {subreddit}</span>
            <Link
              href={postUrl}
              target="_blank"
              className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
            >
              <span>View Post</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Reason for Match */}
        <div className="p-4 rounded-lg bg-purple-600/5 dark:bg-neutral-900 mt-4">
          <p className="text-sm font-semibold text-neutral-950 dark:text-white">
            Reason for Match
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal mt-1">
            {reasonForMatch}
          </p>
        </div>

        {/* Feedback Buttons */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4 flex justify-end">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <ThumbsUp className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <ThumbsDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
