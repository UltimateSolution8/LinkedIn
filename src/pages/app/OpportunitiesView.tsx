
import { useParams, useOutletContext } from "react-router-dom";
import LeadsPage from "@/components/leads/LeadsPage";
import type { AppLayoutOutletContext } from "@/layouts/AppLayout";

/**
 * OpportunitiesView - Engagement Opportunities
 *
 * This is a placeholder view.
 * In Stories 008-011, this will show "Engagement -> Opportunity" leads:
 * - Medium-intent prospects for nurturing
 * - Filter and action capabilities similar to Hot Leads
 * - Separate badge count in sidebar
 */
export default function OpportunitiesView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { refreshLeadCounts } = useOutletContext<AppLayoutOutletContext>();

  if (!projectId) return null;

  return <LeadsPage projectId={projectId} mode="opportunity" onCountsRefresh={refreshLeadCounts} />;
}
