
import { useState } from "react";
import { useParams } from "react-router-dom";
import FindLeadsTab from "@/components/dashboard/FindLeadsTab";

/**
 * LeadsView - Hot Leads List
 *
 * This is a temporary view that wraps the existing FindLeadsTab.
 * In Stories 008-011, this will be replaced with the new leads page showing:
 * - Filter tabs (All, Hot, Warm, Cold, Starred)
 * - Lead cards with expandable details
 * - Actions (star, follow-up, contact, archive)
 * - Live updates during scans
 */
export default function LeadsView() {
  const { projectId } = useParams<{ projectId: string }>();
  const [_leadsCount, setLeadsCount] = useState(0);

  return (
    <div className="p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">
          Hot Leads
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          High-intent prospects ready for outreach
        </p>
      </div>

      {/* Temporary: Show existing Find Leads Tab */}
      {/* TODO: Replace with new leads page in Stories 008-011 */}
      {projectId && (
        <FindLeadsTab projectId={projectId} onCountChange={setLeadsCount} />
      )}
    </div>
  );
}
