"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, ThumbsUp, ThumbsDown, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [isSourceTruncated, setIsSourceTruncated] = useState(false);
  const [isReasonTruncated, setIsReasonTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sourcePostRef = useRef<HTMLParagraphElement>(null);
  const reasonRef = useRef<HTMLParagraphElement>(null);

  const maxStars = 10;

  // Check if content is truncated
  useEffect(() => {
    const sourceElement = sourcePostRef.current;
    if (sourceElement) {
      setIsSourceTruncated(sourceElement.scrollHeight > sourceElement.clientHeight);
    }

    const reasonElement = reasonRef.current;
    if (reasonElement) {
      setIsReasonTruncated(reasonElement.scrollHeight > reasonElement.clientHeight);
    }
  }, [sourcePost, reasonForMatch]);

  const showDialog = isSourceTruncated || isReasonTruncated;

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
              <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
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
          <p
            ref={sourcePostRef}
            className="text-neutral-950 dark:text-white text-base font-medium mt-2 line-clamp-2"
          >
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
               <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
            </Link>
          </div>
        </div>

        {/* Reason for Match */}
        <div className="p-4 rounded-lg bg-purple-600/5 dark:bg-neutral-900 mt-4">
          <p className="text-sm font-semibold text-neutral-950 dark:text-white">
            Reason for Match
          </p>
          <p
            ref={reasonRef}
            className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal mt-1 line-clamp-3"
          >
            {reasonForMatch}
          </p>
        </div>

        {/* Show More Button */}
        {showDialog && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-purple-600 dark:text-purple-400 p-0 h-auto mt-2 text-sm font-medium self-start"
              >
                Show More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <span>{username}</span>
                  <Link
                    href={`https://reddit.com/user/${username.replace('u/', '')}`}
                    target="_blank"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </Link>
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2 mt-2">
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
                    <span className="font-bold text-teal-500">{rating}/10</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[70vh] space-y-4">
                {/* Source Post */}
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                    Source Post
                  </p>
                  <p className="text-neutral-950 dark:text-white text-base font-medium mt-2">
                    {sourcePost}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                      in {subreddit}
                    </span>
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
                <div className="p-4 rounded-lg bg-purple-600/5 dark:bg-neutral-900">
                  <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                    Reason for Match
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal mt-1 whitespace-pre-wrap">
                    {reasonForMatch}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

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
