
import { useState, useRef, useEffect } from "react";
import { ExternalLink, ThumbsUp, ThumbsDown, ArrowRight, Star, Sparkles, MessageSquare, FileText } from "lucide-react";
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
import GenerateMessageDialog from "./GenerateMessageDialog";
import StarRating from "./StarRating";
import { rateMatch } from "@/lib/api/leads";

interface LeadCardProps {
  leadId: string;
  source: "comment" | "post";
  username: string;
  rating: number;
  sourcePost: string;
  subreddit: string;
  reasonForMatch: string;
  postUrl?: string;
  postCreatedAt: string;
  // Comment-specific props
  commentUrl?: string;
  commentText?: string;
  leadType?: string;
  // AI-generated fields
  mainPainpoint?: string;
  matchReason?: string;
  userRating?: number;
}

export default function LeadCard({
  leadId,
  source,
  username,
  rating,
  sourcePost,
  subreddit,
  reasonForMatch,
  postUrl = "#",
  postCreatedAt,
  commentUrl,
  commentText,
  leadType,
  mainPainpoint,
  matchReason,
  userRating = 0,
}: LeadCardProps) {
  const [isSourceTruncated, setIsSourceTruncated] = useState(false);
  const [isReasonTruncated, setIsReasonTruncated] = useState(false);
  const [isCommentTruncated, setIsCommentTruncated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const sourcePostRef = useRef<HTMLParagraphElement>(null);
  const reasonRef = useRef<HTMLParagraphElement>(null);
  const commentRef = useRef<HTMLParagraphElement>(null);

  const handleRating = async (leadId: string, userRating: number) => {
    await rateMatch(leadId, userRating);
  };

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

    const reasonElement = reasonRef.current;
    if (reasonElement) {
      setIsReasonTruncated(reasonElement.scrollHeight > reasonElement.clientHeight);
    }

    const commentElement = commentRef.current;
    if (commentElement) {
      setIsCommentTruncated(commentElement.scrollHeight > commentElement.clientHeight);
    }
  }, [sourcePost, reasonForMatch, commentText]);

  const showDialog = isSourceTruncated || isReasonTruncated || isCommentTruncated;

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
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
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
          {rating > 0 && (
            <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50">
              <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
              <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rating}/10</span>
            </div>
          )}
        </div>

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
                  className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
                >
                  <span>View Comment</span>
                  <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
                </a>
              )}
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
              >
                <span>{source === "comment" ? "View Post" : "View Post"}</span>
                <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400 " />
              </a>
            </div>
          </div>
        </div>

        {/* Main Painpoint & Match Reason */}
        {(mainPainpoint || matchReason) && (
          <div className="mt-4 space-y-3">
            {mainPainpoint && (
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30">
                <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-2">
                  Pain Point
                </p>
                <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                  {mainPainpoint}
                </p>
              </div>
            )}
            {matchReason && (
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">
                  How It Fits
                </p>
                <p className="text-neutral-950 dark:text-white text-sm leading-relaxed">
                  {matchReason}
                </p>
              </div>
            )}
          </div>
        )}

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
                  <a
                    href={`https://reddit.com/user/${username.replace('u/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </a>
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  {rating > 0 && (
                    <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50 mt-2 w-fit">
                      <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                      <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{rating}/10</span>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto max-h-[70vh] space-y-4">
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
                        className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline mt-2"
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
                      className="flex items-center gap-1.5 text-purple-600 dark:text-teal-400 text-sm font-bold hover:underline"
                    >
                      <span>View Post</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Main Painpoint & Match Reason */}
                {mainPainpoint && (
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30">
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      Main Pain Point
                    </p>
                    <p className="text-neutral-950 dark:text-white text-sm font-normal leading-normal mt-1 whitespace-pre-wrap">
                      {mainPainpoint}
                    </p>
                  </div>
                )}

                {matchReason && (
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                      How It Fits
                    </p>
                    <p className="text-neutral-950 dark:text-white text-sm font-normal leading-normal mt-1 whitespace-pre-wrap">
                      {matchReason}
                    </p>
                  </div>
                )}

                {/* Reason for Match (fallback) */}
                {!mainPainpoint && !matchReason && (
                  <div className="p-4 rounded-lg bg-purple-600/5 dark:bg-neutral-900">
                    <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                      Reason for Match
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal mt-1 whitespace-pre-wrap">
                      {reasonForMatch}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Feedback Buttons */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMessageDialogOpen(true)}
            className="text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Response
          </Button>
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

        {/* User Rating Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Rate this match
            </span>
            <StarRating
              leadId={leadId}
              initialRating={userRating}
              onRate={handleRating}
            />
          </div>
        </div>

        {/* Message Generation Dialog */}
        <GenerateMessageDialog
          isOpen={isMessageDialogOpen}
          onOpenChange={setIsMessageDialogOpen}
          leadId={leadId}
          username={username}
        />
      </div>
    </div>
  );
}
