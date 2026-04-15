
import { useEffect, useState } from "react";
import LeadCard from "./LeadCard";
import Pagination from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLeads, type Lead } from "@/lib/api/leads";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import LeadDiscoveryState from "./LeadDiscoveryState";

interface FindLeadsTabProps {
  projectId: string;
  onCountChange?: (count: number) => void;
}

export default function FindLeadsTab({ projectId, onCountChange }: FindLeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "score" | "subreddit">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: 10,
  });

  const fetchLeads = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // Map frontend sortBy to API sortBy if needed
      const apiSortBy = sortBy;
      
      const response = await getLeads(projectId, currentPage, 10, apiSortBy as any, sortOrder);
      setLeads(response.data);
      setPagination({
        totalPages: response.pagination.totalPages,
        totalLeads: response.pagination.totalLeads,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage,
        pageSize: response.pagination.pageSize,
      });

      // Notify parent of total count
      if (onCountChange) {
        onCountChange(response.pagination.totalLeads);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      console.error("Error fetching leads:", err);
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
      fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentPage, sortBy, sortOrder]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchLeads(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortByChange = (value: "date" | "score" | "subreddit") => {
    setSortBy(value);
    // Auto-set order based on sort type
    if (value === "subreddit") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to first page when sorting changes
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
      <div className="flex flex-col pt-6">
        <LeadDiscoveryState
          type="leads"
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
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="score">High Score</SelectItem>
            <SelectItem value="subreddit">Subreddit</SelectItem>
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
        {leads.map((lead, index) => (
          <LeadCard
            key={index}
            leadId={String(lead.leadId)}
            source={lead.source}
            username={lead.source === "comment" ? (lead.author || "Unknown") : (lead.originalPosterId || "Unknown")}
            rating={lead.relevanceRating}
            sourcePost={lead.title}
            subreddit={lead.subreddit}
            reasonForMatch={lead.source === "comment" ? `Lead Type: ${lead.leadType || 'N/A'}` : "Post-based lead"}
            postUrl={lead.postUrl}
            postCreatedAt={lead.postCreatedAt}
            commentUrl={lead.commentUrl}
            commentText={lead.commentText}
            leadType={lead.leadType}
            mainPainpoint={lead.mainPainpoint}
            matchReason={lead.matchReason}
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
