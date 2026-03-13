
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Pagination from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPosts, type Post } from "@/lib/api/posts";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import LeadDiscoveryState from "./LeadDiscoveryState";

interface FindPostsTabProps {
  projectId: string;
  onCountChange?: (count: number) => void;
}

export default function FindPostsTab({ projectId, onCountChange }: FindPostsTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"hotness" | "comments" | "date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: 10,
  });

  const fetchPosts = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await getPosts(projectId, currentPage, 10, sortBy, sortOrder);
      setPosts(response.data);
      setPagination({
        totalPages: response.pagination.totalPages,
        totalPosts: response.pagination.totalPosts,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage,
        pageSize: response.pagination.pageSize,
      });

      // Notify parent of total count
      if (onCountChange) {
        onCountChange(response.pagination.totalPosts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      console.error("Error fetching posts:", err);
      // Reset count on error
      if (onCountChange) {
        onCountChange(0);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentPage, sortBy, sortOrder]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchPosts(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortByChange = (value: "hotness" | "comments" | "date" | "status") => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to first page when sorting changes
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-md text-sm max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col pt-6">
        <LeadDiscoveryState
          type="posts"
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-6">
      {/* Sorting Controls */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sort by:</span>
        </div>

        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="hotness">Hotness</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-3 h-3" />
                Desc
              </div>
            </SelectItem>
            <SelectItem value="asc">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-3 h-3" />
                Asc
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            postId={post.postId}
            leadId={post.leadId}
            title={post.title}
            excerpt={post.description}
            timeAgo={formatTimeAgo(post.timeCreated)}
            username={`u/${post.originalPosterId}`}
            subreddit={`r/${post.subreddit}`}
            rating={post.rixlyRating}
            postUrl={post.url}
            leadType={post.leadType}
            status={post.status}
            followUpAt={post.followUpAt}
            notes={post.notes}
            statusReason={post.statusReason}
            assignedTo={post.assignedTo}
            updatedAt={post.updatedAt}
            mainPainpoint={post.mainPainpoint}
            matchReason={post.matchReason}
            onStatusUpdate={(updatedPost) => {
              // Update the post in the local state
              // Note: updatedPost has 'id' field instead of 'leadId', and only contains updated status fields
              setPosts(prevPosts =>
                prevPosts.map(p =>
                  p.leadId === updatedPost.id ? {
                    ...p,
                    status: updatedPost.status,
                    followUpAt: updatedPost.followUpAt,
                    notes: updatedPost.notes,
                    statusReason: updatedPost.statusReason,
                    updatedAt: updatedPost.updatedAt
                  } : p
                )
              );
            }}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
