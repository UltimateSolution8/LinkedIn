
import { useState, useRef, useEffect } from "react";
import { ExternalLink, Star, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GenerateCommentDialog from "./GenerateCommentDialog";

interface PostCardProps {
  postId: string;
  leadId: string;
  title: string;
  excerpt: string;
  timeAgo: string;
  username: string;
  subreddit: string;
  rating: number;
  postUrl?: string;
  leadType: "SALES" | "ENGAGEMENT";
}

export default function PostCard({
  postId,
  leadId,
  title,
  excerpt,
  timeAgo,
  username,
  subreddit,
  rating,
  postUrl = "#",
  leadType,
}: PostCardProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const excerptRef = useRef<HTMLParagraphElement>(null);

  const maxStars = 5;
  const filledStars = Math.round((rating / 10) * maxStars);

  // Lead type configuration
  const leadTypeConfig = {
    SALES: {
      label: "Sale Lead",
      icon: DollarSign,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-700 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
    },
    ENGAGEMENT: {
      label: "Engagement Lead",
      icon: TrendingUp,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-700 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const config = leadTypeConfig[leadType] ?? leadTypeConfig.ENGAGEMENT;
  const LeadIcon =  config.icon;

  // Check if content is truncated
  useEffect(() => {
    const element = excerptRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [excerpt]);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Lead Type Badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bgColor} ${config.borderColor} w-fit`}>
        <LeadIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
        <span className={`text-xs font-semibold ${config.textColor}`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
          <Link
          href={postUrl}
          target="_blank"
          className="flex items-center gap-1.5 text-black-600 dark:text-teal-400 text-sm font-bold hover:underline"
        >
          <h3 className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal">
            {title}
          </h3>
        </Link>
        <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
      </div>
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
                {/* Lead Type Badge in Dialog */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bgColor} ${config.borderColor} w-fit mb-2`}>
                  <LeadIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                  <span className={`text-xs font-semibold ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
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

      {/* Generate Comment Button - Only for ENGAGEMENT leads */}
      {leadType === "ENGAGEMENT" && (
        <div className="flex items-center justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            onClick={() => setIsCommentDialogOpen(true)}
            variant="outline"
            className="gap-2 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Generate Comment</span>
          </Button>
        </div>
      )}

      {/* Generate Comment Dialog */}
      <GenerateCommentDialog
        isOpen={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        leadId={leadId}
        postTitle={title}
      />
    </div>
  );
}
