"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import Pagination from "@/components/ui/pagination";
import { getPosts, type Post } from "@/lib/api/posts";

interface FindPostsTabProps {
  projectId: string;
}

export default function FindPostsTab({ projectId }: FindPostsTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getPosts(projectId, currentPage, 10);
        setPosts(response.data);
        setPagination({
          totalPages: response.pagination.totalPages,
          totalPosts: response.pagination.totalPosts,
          hasNextPage: response.pagination.hasNextPage,
          hasPrevPage: response.pagination.hasPrevPage,
          pageSize: response.pagination.pageSize,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchPosts();
    }
  }, [projectId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          No posts found. Check back later for new opportunities!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-6">
      <div className="flex flex-col gap-4 mb-6">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            title={post.title}
            excerpt={post.description}
            timeAgo={formatTimeAgo(post.timeCreated)}
            username={`u/${post.originalPosterId}`}
            subreddit={`r/${post.subreddit}`}
            rating={post.rixlyRating}
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
