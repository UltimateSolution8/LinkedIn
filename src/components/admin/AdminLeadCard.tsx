import { ExternalLink, Star, MessageSquare, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminLeadCardProps {
  lead: {
    source: string;
    leadId: number;
    isViewed: boolean;
    originalPosterId: string;
    postCreatedAt: string;
    postUrl: string;
    redditId: string;
    relevanceRating: number;
    userVote: string | null;
    postId: number;
    subreddit: string;
    title: string;
    commentUrl: string | null;
    commentText: string | null;
    commentId: number | null;
    redditCommentId: string | null;
    author: string | null;
    confidenceScore: number | null;
    createdUtc: string | null;
  };
}

export default function AdminLeadCard({ lead }: AdminLeadCardProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const isComment = lead.source === "comment";
  const username = isComment ? lead.author : lead.originalPosterId;
  const url = isComment ? lead.commentUrl : lead.postUrl;

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            {isComment ? (
              <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
            )}
            <Badge variant="outline" className="text-xs">
              r/{lead.subreddit}
            </Badge>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatTimeAgo(lead.postCreatedAt)}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-medium text-neutral-950 dark:text-white mb-2 line-clamp-2">
            {lead.title}
          </h4>

          {/* Comment Text if available */}
          {isComment && lead.commentText && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
              {lead.commentText}
            </p>
          )}

          {/* User and Link */}
          <div className="flex items-center gap-3 text-sm">
            {username && (
              <a
                href={`https://reddit.com/user/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                u/{username}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:underline flex items-center gap-1"
              >
                View {isComment ? "comment" : "post"}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800/50 flex-shrink-0">
          <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
          <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">
            {lead.relevanceRating}/10
          </span>
        </div>
      </div>
    </div>
  );
}
