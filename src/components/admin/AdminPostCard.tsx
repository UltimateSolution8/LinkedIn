import { useState, useRef, useEffect } from "react";
import { ExternalLink, ArrowRight, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AdminPostCardProps {
  postId: string;
  leadId: string;
  title: string;
  description?: string;
  timeCreated: string;
  subreddit: string;
  originalPosterId: string;
  rixlyRating: number;
  url: string;
  leadType: "SALES" | "ENGAGEMENT";
  mainPainpoint?: string;
  matchReason?: string;
  status: "NEW" | "IN_PROGRESS" | "FOLLOW_UP_SCHEDULED" | "CONVERTED" | "NOT_INTERESTED" | "DUPLICATE" | "DONE";
}

export default function AdminPostCard({
  title,
  description,
  timeCreated,
  subreddit,
  originalPosterId,
  rixlyRating,
  url,
  leadType,
  mainPainpoint,
  matchReason,
  status,
}: AdminPostCardProps) {
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "FOLLOW_UP_SCHEDULED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "CONVERTED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "NOT_INTERESTED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "DUPLICATE":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "DONE":
        return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

  // Check if content is truncated
  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement) {
      setIsTitleTruncated(titleElement.scrollHeight > titleElement.clientHeight);
    }

    const descElement = descriptionRef.current;
    if (descElement) {
      setIsDescriptionTruncated(descElement.scrollHeight > descElement.clientHeight);
    }
  }, [title, description]);

  const showDialog = isTitleTruncated || isDescriptionTruncated;

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex flex-col">
        {/* Header - Username, Source Badge, and Rating */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold"
              >
                <FileText className="w-3 h-3 mr-1" /> Post
              </Badge>
              <Badge variant="outline" className={`text-xs ${getStatusColor(status)}`}>
                {status.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {leadType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://reddit.com/user/${originalPosterId.replace('u/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal hover:underline"
              >
                {originalPosterId}
              </a>
              <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50">
            <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
            <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rixlyRating}/10</span>
          </div>
        </div>

        {/* AI Insights Section */}
        {(mainPainpoint || matchReason) && (
          <div className="mt-4 space-y-2">
            {matchReason && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <p className="text-purple-600 dark:text-purple-400 text-xs uppercase font-bold tracking-wider mb-1">
                  Match Reason
                </p>
                <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                  {matchReason}
                </p>
              </div>
            )}
            {mainPainpoint && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-amber-600 dark:text-amber-400 text-xs uppercase font-bold tracking-wider mb-1">
                  Main Pain Point
                </p>
                <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                  {mainPainpoint}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Post Title */}
        <div className="mt-4">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
            Post Title
          </p>
          <p
            ref={titleRef}
            className="text-neutral-950 dark:text-white text-base font-medium mt-2 line-clamp-2"
          >
            {title}
          </p>
        </div>

        {/* Post Description (if available) */}
        {description && (
          <div className="mt-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider mb-2">
              Description
            </p>
            <p
              ref={descriptionRef}
              className="text-neutral-950 dark:text-white text-sm leading-relaxed line-clamp-3"
            >
              {description}
            </p>
          </div>
        )}

        {/* Footer - Metadata and Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
            <span>{formatTimeAgo(timeCreated)}</span>
            <span>•</span>
            <span>in {subreddit}</span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
          >
            <span>View Post</span>
            <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
          </a>
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
                  <span>{originalPosterId}</span>
                  <a
                    href={`https://reddit.com/user/${originalPosterId.replace('u/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </a>
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50 mt-2 w-fit">
                    <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                    <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rixlyRating}/10</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[70vh] space-y-4">
                {/* AI Insights */}
                {(mainPainpoint || matchReason) && (
                  <div className="space-y-2">
                    {matchReason && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                        <p className="text-purple-600 dark:text-purple-400 text-xs uppercase font-bold tracking-wider mb-1">
                          Match Reason
                        </p>
                        <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                          {matchReason}
                        </p>
                      </div>
                    )}
                    {mainPainpoint && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                        <p className="text-amber-600 dark:text-amber-400 text-xs uppercase font-bold tracking-wider mb-1">
                          Main Pain Point
                        </p>
                        <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                          {mainPainpoint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Title */}
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                    Post Title
                  </p>
                  <p className="text-neutral-950 dark:text-white text-base font-medium mt-2">
                    {title}
                  </p>
                </div>

                {/* Post Description */}
                {description && (
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                      Description
                    </p>
                    <p className="text-neutral-950 dark:text-white text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                    <span>{formatTimeAgo(timeCreated)}</span>
                    <span>•</span>
                    <span>in {subreddit}</span>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
                  >
                    <span>View Post</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
