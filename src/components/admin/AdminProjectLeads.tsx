import { useState, useEffect } from "react";
import { getAdminProjectLeads } from "@/lib/api/admin";
import AdminLeadCard from "./AdminLeadCard";
import Pagination from "@/components/ui/pagination";

interface AdminProjectLeadsProps {
  userId: number;
  projectId: number;
  projectName: string;
}

export default function AdminProjectLeads({ userId, projectId, projectName }: AdminProjectLeadsProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const LEADS_PER_PAGE = 10;

  useEffect(() => {
    fetchLeads();
  }, [currentPage, selectedSource]);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminProjectLeads(
        userId,
        projectId,
        currentPage,
        LEADS_PER_PAGE,
        selectedSource === "all" ? undefined : selectedSource
      );

      setLeads(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalLeads(response.pagination.totalLeads);
      setHasNextPage(response.pagination.hasNextPage);
      setHasPrevPage(response.pagination.hasPrevPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      setLeads([]);
      setTotalPages(1);
      setTotalLeads(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Leads for {projectName}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Total: {totalLeads} leads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600 dark:text-neutral-400">Filter:</label>
          <select
            value={selectedSource}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          >
            <option value="all">All Sources</option>
            <option value="ask">Ask</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">No leads found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {leads.map((lead) => (
              <AdminLeadCard key={lead.leadId} lead={lead} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
