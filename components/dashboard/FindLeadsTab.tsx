"use client";

import { useEffect, useState } from "react";
import LeadCard from "./LeadCard";
import Pagination from "@/components/ui/pagination";
import { getLeads, type Lead } from "@/lib/api/leads";

interface FindLeadsTabProps {
  projectId: string;
}

export default function FindLeadsTab({ projectId }: FindLeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getLeads(projectId, currentPage, 10);
        setLeads(response.data);
        setPagination({
          totalPages: response.pagination.totalPages,
          totalLeads: response.pagination.totalLeads,
          hasNextPage: response.pagination.hasNextPage,
          hasPrevPage: response.pagination.hasPrevPage,
          pageSize: response.pagination.pageSize,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leads");
        console.error("Error fetching leads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchLeads();
    }
  }, [projectId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Loading leads...</p>
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

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          No leads found yet. We will let you know once we found your potential customers!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-6">
      <div className="flex flex-col gap-4 mb-6">
        {leads.map((lead, index) => (
          <LeadCard
            key={index}
            username={lead.redditId}
            rating={lead.relevanceRating}
            sourcePost={lead.title}
            subreddit={lead.subreddit}
            reasonForMatch={lead.reason}
            postUrl={`https://reddit.com/comments/${lead.postId}`}
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
