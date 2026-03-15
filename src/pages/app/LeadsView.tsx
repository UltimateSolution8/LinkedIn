
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import LeadsPage from "@/components/leads/LeadsPage";
import type { AppLayoutOutletContext } from "@/layouts/AppLayout";

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
  const { refreshLeadCounts } = useOutletContext<AppLayoutOutletContext>();

  if (!projectId) return null;

  return <LeadsPage projectId={projectId} mode="hot" onCountsRefresh={refreshLeadCounts} />;
}
