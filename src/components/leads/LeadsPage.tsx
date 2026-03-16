import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  ExternalLink,
  Flame,
  Loader2,
  Sparkles,
  Star,
  Target,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getLeads,
  patchLeadFollowUp,
  patchLeadStar,
  patchLeadStatus,
  saveReplyStyle,
  type Lead,
  type LeadListType,
  type LeadSort,
} from "@/lib/api/leads";
import { useScanStatus } from "@/hooks/useScanStatus";
import LeadDetailDrawer from "./LeadDetailDrawer";

interface LeadsPageProps {
  projectId: string;
  mode: LeadListType;
  onCountsRefresh?: () => Promise<void>;
}

const PAGE_SIZE = 20;

function formatRelativeTime(timestamp?: string) {
  if (!timestamp) return "just now";
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function buildHowToHelpFallback(lead: Lead) {
  const snippets = [
    "Lead shows explicit intent and urgency around this pain point.",
    "Mention your fastest path to value and expected time savings.",
    "Offer a clear next step with a lightweight trial or walkthrough.",
  ];

  if (lead.matchReason && lead.matchReason.length > 16) {
    snippets[0] = lead.matchReason;
  }

  return snippets;
}

export default function LeadsPage({ projectId, mode, onCountsRefresh }: LeadsPageProps) {
  const navigate = useNavigate();
  const scan = useScanStatus(projectId);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState({ hot: 0, opportunity: 0, total: 0 });
  const [availablePainTags, setAvailablePainTags] = useState<string[]>([]);
  const [selectedPainTags, setSelectedPainTags] = useState<string[]>([]);
  const [starredOnly, setStarredOnly] = useState(false);
  const [followUpOnly, setFollowUpOnly] = useState(false);
  const [sort, setSort] = useState<LeadSort>("score");
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeFiltersCount = selectedPainTags.length + (starredOnly ? 1 : 0) + (followUpOnly ? 1 : 0);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
  }, []);

  const updateLeadInList = useCallback((leadId: number, updater: (lead: Lead) => Lead) => {
    setLeads((current) => current.map((lead) => (lead.leadId === leadId ? updater(lead) : lead)));
  }, []);

  const removeLeadFromList = useCallback((leadId: number) => {
    setLeads((current) => current.filter((lead) => lead.leadId !== leadId));
    setTotalLeads((current) => Math.max(0, current - 1));
  }, []);

  const fetchLeads = useCallback(
    async (targetPage: number, append: boolean, pageSize: number = PAGE_SIZE) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const response = await getLeads(projectId, {
          page: targetPage,
          limit: pageSize,
          type: mode,
          painTags: selectedPainTags,
          starred: starredOnly || undefined,
          followUp: followUpOnly || undefined,
          sort,
          source: "all",
        });

        setCounts(response.counts ?? response.meta?.counts ?? { hot: 0, opportunity: 0, total: 0 });
        setAvailablePainTags(response.availablePainTags ?? response.meta?.availablePainTags ?? []);
        setTotalLeads(response.pagination.totalLeads);
        setError(null);

        const incoming = response.data;
        if (append) {
          setLeads((current) => {
            const existing = new Set(current.map((lead) => lead.leadId));
            const merged = [...current];
            for (const lead of incoming) {
              if (!existing.has(lead.leadId)) {
                merged.push(lead);
              }
            }
            return merged;
          });
        } else {
          setLeads(incoming);
        }

        if (onCountsRefresh) {
          await onCountsRefresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leads");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [projectId, mode, selectedPainTags, starredOnly, followUpOnly, sort, onCountsRefresh]
  );

  useEffect(() => {
    setPage(1);
    void fetchLeads(1, false);
  }, [fetchLeads]);

  useEffect(() => {
    if (!scan.isScanning) return;
    const id = window.setInterval(() => {
      const loadedItems = Math.max(PAGE_SIZE, page * PAGE_SIZE);
      void fetchLeads(1, false, loadedItems);
    }, 30_000);

    return () => window.clearInterval(id);
  }, [fetchLeads, page, scan.isScanning]);

  const canLoadMore = leads.length < totalLeads;

  const onLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchLeads(nextPage, true);
  };

  const onToggleTag = (tag: string) => {
    setSelectedPainTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedPainTags([]);
    setStarredOnly(false);
    setFollowUpOnly(false);
  };

  const onToggleStar = async (lead: Lead) => {
    setActionError(null);
    const previous = lead.isStarred ?? false;
    updateLeadInList(lead.leadId, (item) => ({ ...item, isStarred: !previous }));
    try {
      await patchLeadStar(String(lead.leadId), !previous);
      showSuccess(!previous ? "Lead starred" : "Lead unstarred");
      if (drawerLead?.leadId === lead.leadId) {
        setDrawerLead((current) => (current ? { ...current, isStarred: !previous } : null));
      }
      if (onCountsRefresh) await onCountsRefresh();
    } catch (err) {
      updateLeadInList(lead.leadId, (item) => ({ ...item, isStarred: previous }));
      setActionError(err instanceof Error ? err.message : "Failed to update starred status");
    }
  };

  const onSetFollowUp = async (lead: Lead, followUpAt: string | null) => {
    setActionError(null);
    const previous = lead.followUpAt;
    updateLeadInList(lead.leadId, (item) => ({
      ...item,
      followUpAt: followUpAt ?? undefined,
      isFollowUp: !!followUpAt,
      status: followUpAt ? "FOLLOW_UP_SCHEDULED" : item.status,
    }));
    try {
      await patchLeadFollowUp(String(lead.leadId), followUpAt);
      showSuccess(followUpAt ? "Follow-up scheduled" : "Follow-up cleared");
      if (onCountsRefresh) await onCountsRefresh();
    } catch (err) {
      updateLeadInList(lead.leadId, (item) => ({
        ...item,
        followUpAt: previous ?? undefined,
        isFollowUp: !!previous,
      }));
      setActionError(err instanceof Error ? err.message : "Failed to update follow-up");
    }
  };

  const onMarkContacted = async (
    lead: Lead,
    replyText: string,
    tone: "casual" | "professional" | "friendly"
  ) => {
    setActionError(null);
    const previousLeads = leads;
    removeLeadFromList(lead.leadId);
    try {
      if (replyText.trim().length > 0) {
        await saveReplyStyle(String(lead.leadId), { replyText, tone });
      } else {
        await saveReplyStyle(String(lead.leadId), { tone });
      }
      await patchLeadStatus(String(lead.leadId), { status: "CONTACTED" });
      showSuccess("Lead marked as contacted");
      if (onCountsRefresh) await onCountsRefresh();
    } catch (err) {
      setLeads(previousLeads);
      setActionError(err instanceof Error ? err.message : "Failed to mark contacted");
    }
  };

  const onArchive = async (lead: Lead) => {
    const confirmed = window.confirm("Archive this lead?");
    if (!confirmed) return;

    setActionError(null);
    const previousLeads = leads;
    removeLeadFromList(lead.leadId);
    try {
      await patchLeadStatus(String(lead.leadId), { status: "ARCHIVED" });
      showSuccess("Lead archived");
      if (onCountsRefresh) await onCountsRefresh();
    } catch (err) {
      setLeads(previousLeads);
      setActionError(err instanceof Error ? err.message : "Failed to archive lead");
    }
  };

  const pageTitle = mode === "hot" ? "Hot Leads" : "Opportunities";
  const pageSubtitle =
    mode === "hot"
      ? "High-intent prospects ready for outreach"
      : "Engagement opportunities to nurture into pipeline";

  const leadCountLabel = useMemo(() => {
    if (mode === "hot") return counts.hot;
    return counts.opportunity;
  }, [counts.hot, counts.opportunity, mode]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">{pageTitle}</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{pageSubtitle}</p>
      </header>

      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-6">
          <button
            className={`py-3 border-b-2 text-sm font-semibold ${mode === "hot" ? "border-teal-600 text-teal-700 dark:text-teal-400" : "border-transparent text-neutral-500"}`}
            onClick={() => navigate(`/app/${projectId}/leads`)}
          >
            Hot Leads ({counts.hot})
          </button>
          <button
            className={`py-3 border-b-2 text-sm font-semibold ${mode === "opportunity" ? "border-teal-600 text-teal-700 dark:text-teal-400" : "border-transparent text-neutral-500"}`}
            onClick={() => navigate(`/app/${projectId}/opportunities`)}
          >
            Opportunities ({counts.opportunity})
          </button>
        </div>
      </div>

      {scan.scanState !== "complete" && (
        <div className="rounded-xl border border-teal-300 bg-teal-50 dark:bg-teal-950/20 dark:border-teal-800 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-teal-900 dark:text-teal-200">
                Still scanning... {scan.leadsFound} leads found so far
              </p>
              <p className="text-sm text-teal-800/80 dark:text-teal-300/80">
                Progress: {scan.scanProgress}% {scan.etaMinutes ? `• ETA ~${scan.etaMinutes}m` : ""}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => void scan.triggerScan()}>
              Run again
            </Button>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/80 dark:bg-neutral-900">
            <div
              className="h-2 rounded-full bg-teal-600 transition-all duration-500"
              style={{ width: `${Math.max(4, Math.min(100, scan.scanProgress))}%` }}
            />
          </div>
        </div>
      )}

      {successMessage && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-3">
          {successMessage}
        </div>
      )}

      {actionError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
          {actionError}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {availablePainTags.map((tag) => {
            const active = selectedPainTags.includes(tag);
            return (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${active
                  ? "bg-teal-100 border-teal-400 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                  }`}
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}

          <button
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 ${starredOnly
              ? "bg-teal-100 border-teal-400 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700"
              : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
              }`}
            onClick={() => setStarredOnly((current) => !current)}
          >
            <Star className="w-3.5 h-3.5" />
            Starred
          </button>

          <button
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 ${followUpOnly
              ? "bg-teal-100 border-teal-400 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700"
              : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
              }`}
            onClick={() => setFollowUpOnly((current) => !current)}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            Follow-up
          </button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {leads.length} of {totalLeads} leads
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-neutral-500">Sort</span>
            <Select value={sort} onValueChange={(value) => setSort(value as LeadSort)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Highest score</SelectItem>
                <SelectItem value="date">Most recent</SelectItem>
                <SelectItem value="subreddit">By subreddit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-14 text-neutral-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading leads...
        </div>
      ) : error ? (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
          <p className="font-semibold text-neutral-900 dark:text-white">
            {activeFiltersCount > 0
              ? "No leads match your filters"
              : mode === "hot"
                ? "No hot leads found yet"
                : "No opportunities found yet"}
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            {activeFiltersCount > 0
              ? "Try clearing filters to view more results."
              : "Rixly will populate this view as scanning discovers relevant leads."}
          </p>
          <div className="mt-4">
            {activeFiltersCount > 0 ? (
              <Button variant="outline" onClick={clearAllFilters}>
                Clear filters
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate(`/app/${projectId}/dashboard`)}>
                Go to dashboard
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const expanded = expandedLeadId === lead.leadId;
            const scoreColor = mode === "hot" ? "text-orange-600 border-orange-400" : "text-amber-600 border-amber-400";
            return (
              <article
                key={lead.leadId}
                className={`rounded-xl border bg-white dark:bg-neutral-950 transition-all cursor-pointer ${expanded
                  ? "border-teal-500 shadow-sm"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-teal-300"
                  }`}
                onClick={() => setExpandedLeadId((current) => (current === lead.leadId ? null : lead.leadId))}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full border-2 ${scoreColor} flex items-center justify-center font-bold text-sm`}>
                    {lead.score?.toFixed(1) || 0}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2">
                        {lead.title}
                      </h3>
                      <button
                        className={`p-1.5 rounded-md ${lead.isStarred ? "text-amber-500" : "text-neutral-400"}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          void onToggleStar(lead);
                        }}
                      >
                        <Star className={`w-4 h-4 ${lead.isStarred ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-transparent">
                        r/{lead.subreddit}
                      </Badge>
                      <span>{formatRelativeTime(lead.postCreatedAt || lead.createdAt)}</span>
                      <span>•</span>
                      <span>{lead.author || lead.originalPosterId || "Unknown"}</span>
                    </div>

                    {lead.painTags && lead.painTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {lead.painTags.slice(0, 3).map((tag) => (
                          <span
                            key={`${lead.leadId}-${tag}`}
                            className="text-[10px] px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold uppercase tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {expanded && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <section className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-3">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          Pain Point They're Facing
                        </h4>
                        <p className="text-orange-900/80 dark:text-orange-200/90">
                          {lead.mainPainpoint || lead.body?.slice(0, 180) || "Pain point details unavailable."}
                        </p>
                      </section>

                      <section className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/20 p-3">
                        <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          Why We Picked This Lead
                        </h4>
                        <p className="text-teal-900/80 dark:text-teal-200/90">
                          {lead.matchReason || "Strong buying intent and relevance signals detected."}
                        </p>
                      </section>

                      <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1">
                          <WandSparkles className="w-4 h-4" />
                          How Your Product Can Help
                        </h4>
                        <ul className="list-disc list-inside text-blue-900/80 dark:text-blue-200/90 space-y-1">
                          {buildHowToHelpFallback(lead).map((item) => (
                            <li key={`${lead.leadId}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDrawerLead(lead);
                        }}
                      >
                        Draft Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(lead.postUrl, "_blank", "noopener,noreferrer");
                        }}
                      >
                        Open on Reddit
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDrawerLead(lead);
                        }}
                      >
                        Mark Contacted
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          void onArchive(lead);
                        }}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          <div className="pt-4 flex items-center justify-center">
            {canLoadMore ? (
              <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
                {isLoadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Load more leads
              </Button>
            ) : (
              <p className="text-sm text-neutral-500">
                Showing all {leadCountLabel} {mode === "hot" ? "hot leads" : "opportunities"}
              </p>
            )}
          </div>
        </div>
      )}

      <LeadDetailDrawer
        open={!!drawerLead}
        lead={drawerLead}
        onOpenChange={(open) => {
          if (!open) setDrawerLead(null);
        }}
        onToggleStar={onToggleStar}
        onSetFollowUp={onSetFollowUp}
        onMarkContacted={onMarkContacted}
        onArchive={onArchive}
      />

      {scan.newLeadsSince > 0 && (
        <div className="fixed bottom-4 right-4 bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm inline-flex items-center gap-2">
          {mode === "hot" ? <Target className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
          {scan.newLeadsSince} new lead{scan.newLeadsSince > 1 ? "s" : ""} found
        </div>
      )}
    </div>
  );
}
