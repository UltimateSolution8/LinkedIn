"use client";

import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [isTruncated, setIsTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const excerptRef = useRef<HTMLParagraphElement>(null);

  const maxStars = 5;
  const filledStars = Math.round((rating / 10) * maxStars);

  // Check if content is truncated
  useEffect(() => {
    const element = excerptRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [excerpt]);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal">
        {title}
      </h3>
      <div>
        <p
          ref={excerptRef}
          className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal line-clamp-3"
        >
          {excerpt}
        </p>
        {isTruncated && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-purple-600 dark:text-purple-400 p-0 h-auto mt-1 text-sm font-medium"
              >
                Show More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <span>{timeAgo}</span>
                  <span>•</span>
                  <span>{username}</span>
                  <span>•</span>
                  <span>{subreddit}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[70vh]">
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
            </DialogContent>
          </Dialog>
        )}
      </div>

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
