import { useState, useRef, useEffect } from "react";
import { ExternalLink, ArrowRight, Star, MessageSquare, FileText } from "lucide-react";
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

interface AdminLeadCardReadOnlyProps {
  leadId: string;
  source: "comment" | "post";
  username: string;
  rating: number;
  sourcePost: string;
  subreddit: string;
  postUrl?: string;
  postCreatedAt: string;
  // Comment-specific props
  commentUrl?: string;
  commentText?: string;
  leadType?: string;
  // AI-generated insights
  mainPainpoint?: string;
  matchReason?: string;
}

export default function AdminLeadCardReadOnly({
  source,
  username,
  rating,
  sourcePost,
  subreddit,
  postUrl = "#",
  postCreatedAt,
  commentUrl,
  commentText,
  leadType,
  mainPainpoint,
  matchReason,
}: AdminLeadCardReadOnlyProps) {
  const [isSourceTruncated, setIsSourceTruncated] = useState(false);
  const [isCommentTruncated, setIsCommentTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sourcePostRef = useRef<HTMLParagraphElement>(null);
  const commentRef = useRef<HTMLParagraphElement>(null);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Check if content is truncated
  useEffect(() => {
    const sourceElement = sourcePostRef.current;
    if (sourceElement) {
      setIsSourceTruncated(sourceElement.scrollHeight > sourceElement.clientHeight);
    }

    const commentElement = commentRef.current;
    if (commentElement) {
      setIsCommentTruncated(commentElement.scrollHeight > commentElement.clientHeight);
    }
  }, [sourcePost, commentText]);

  const showDialog = isSourceTruncated || isCommentTruncated;

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-neutral-950 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex flex-col">
        {/* Header - Username, Source Badge, and Rating */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={source === "comment" ? "default" : "secondary"}
                className={`text-xs font-semibold ${
                  source === "comment"
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {source === "comment" ? (
                  <><MessageSquare className="w-3 h-3 mr-1" /> Comment</>
                ) : (
                  <><FileText className="w-3 h-3 mr-1" /> Post</>
                )}
              </Badge>
              {leadType && source === "comment" && (
                <Badge variant="outline" className="text-xs">
                  {leadType}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://reddit.com/user/${username.replace('u/', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-950 dark:text-white text-lg font-semibold leading-normal hover:underline"
              >
                {username}
              </a>
              <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50">
            <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
            <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rating}/10</span>
          </div>
        </div>

        {/* AI Insights Section */}
        {(mainPainpoint || matchReason) && (
          <div className="mt-4 space-y-2">
            {matchReason && (
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
                <p className="text-teal-600 dark:text-teal-400 text-xs uppercase font-bold tracking-wider mb-1">
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

        {/* Comment Text Section (for comment leads) */}
        {source === "comment" && commentText && (
          <div className="mt-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider mb-2">
              Comment
            </p>
            <p
              ref={commentRef}
              className="text-neutral-950 dark:text-white text-sm leading-relaxed line-clamp-3"
            >
              {commentText}
            </p>
          </div>
        )}

        {/* Source Post Section */}
        <div className="mt-4">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
            {source === "comment" ? "Original Post" : "Post"}
          </p>
          <p
            ref={sourcePostRef}
            className="text-neutral-950 dark:text-white text-base font-medium mt-2 line-clamp-2"
          >
            {sourcePost}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
              <span>{formatTimeAgo(postCreatedAt)}</span>
              <span>•</span>
              <span>in {subreddit}</span>
            </div>
            <div className="flex gap-2">
              {source === "comment" && commentUrl && (
                <a
                  href={commentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline"
                >
                  <span>View Comment</span>
                  <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
                </a>
              )}
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline"
              >
                <span>{source === "comment" ? "View Post" : "View Post"}</span>
                <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
              </a>
            </div>
          </div>
        </div>

        {/* Show More Button */}
        {showDialog && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-teal-600 dark:text-teal-400 p-0 h-auto mt-2 text-sm font-medium self-start"
              >
                Show More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <span>{username}</span>
                  <a
                    href={`https://reddit.com/user/${username.replace('u/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </a>
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50 mt-2 w-fit">
                    <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                    <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rating}/10</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[70vh] space-y-4">
                {/* AI Insights */}
                {(mainPainpoint || matchReason) && (
                  <div className="space-y-2">
                    {matchReason && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
                        <p className="text-teal-600 dark:text-teal-400 text-xs uppercase font-bold tracking-wider mb-1">
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

                {/* Comment Text (for comment leads) */}
                {source === "comment" && commentText && (
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                      Comment
                    </p>
                    <p className="text-neutral-950 dark:text-white text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                      {commentText}
                    </p>
                    {commentUrl && (
                      <a
                        href={commentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline mt-2"
                      >
                        <span>View Comment</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* Source Post */}
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                    {source === "comment" ? "Original Post" : "Post"}
                  </p>
                  <p className="text-neutral-950 dark:text-white text-base font-medium mt-2">
                    {sourcePost}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                      <span>{formatTimeAgo(postCreatedAt)}</span>
                      <span>•</span>
                      <span>in {subreddit}</span>
                    </div>
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline"
                    >
                      <span>View Post</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
