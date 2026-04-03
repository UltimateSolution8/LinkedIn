import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getAdminUsers,
  createJobRun,
  type AdminUser,
  type UserProject,
} from "@/lib/api/admin";

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TYPE_OPTIONS: { value: string; label: string; description: string }[] = [
  {
    value: "quickrun",
    label: "Quick Run",
    description: "One-shot post discovery across project subreddits",
  },
  {
    value: "quickrun_comment",
    label: "Quick Run Comments",
    description: "Fetch & NLP-filter comments from recently discovered posts",
  },
  {
    value: "marathon_posts",
    label: "Marathon Posts",
    description: "Recurring post monitoring job",
  },
];

// ─── Searchable User Select ────────────────────────────────────────────────────

interface SearchableUserSelectProps {
  users: AdminUser[];
  value: number | null;
  onValueChange: (userId: number) => void;
  disabled?: boolean;
}

function SearchableUserSelect({
  users,
  value,
  onValueChange,
  disabled,
}: SearchableUserSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = users.find((u) => u.userId === value);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      (u.lastName ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (userId: number) => {
    onValueChange(userId);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!open) setTimeout(() => inputRef.current?.focus(), 60);
          setOpen((o) => !o);
        }}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
          "focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selected
            ? `${selected.firstName} ${selected.lastName ?? ""}`.trim() +
              (selected.email ? ` — ${selected.email}` : "")
            : "Select a user…"}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {/* Search */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Options */}
          <div className="max-h-72 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              filtered.map((u) => {
                const isSelected = value === u.userId;
                return (
                  <button
                    key={u.userId}
                    type="button"
                    onClick={() => handleSelect(u.userId)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-left outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    <span>
                      <span className="font-medium">
                        {`${u.firstName} ${u.lastName ?? ""}`.trim()}
                      </span>
                      {u.email && (
                        <span className="ml-1 text-muted-foreground">— {u.email}</span>
                      )}
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({u.projectCount} project{u.projectCount !== 1 ? "s" : ""})
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCreateJobRunPage() {
  const navigate = useNavigate();

  // Data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form state
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdJob, setCreatedJob] = useState<{
    id: number;
    projectId: number;
    jobType: string;
    status: string;
  } | null>(null);

  // Load users on mount
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingUsers(true);
        setLoadError(null);
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    load();
  }, []);

  // Reset project when user changes
  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedProjectId("");
    setSubmitError(null);
  };

  // Projects for the selected user
  const projectsForUser: UserProject[] =
    users.find((u) => u.userId === selectedUserId)?.projects ?? [];

  const canSubmit =
    selectedUserId !== null &&
    selectedProjectId !== "" &&
    selectedJobType !== "" &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createJobRun(parseInt(selectedProjectId), selectedJobType);
      setCreatedJob(result.jobRun);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create job run");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedJob(null);
    setSelectedUserId(null);
    setSelectedProjectId("");
    setSelectedJobType("");
    setSubmitError(null);
  };

  const jobTypeLabel = JOB_TYPE_OPTIONS.find((o) => o.value === selectedJobType)?.label ?? selectedJobType;

  // ─── Success state ───────────────────────────────────────────────────────────
  if (createdJob) {
    return (
      <div className="container mx-auto p-4 lg:p-8 max-w-lg">
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">
                <Check className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-neutral-950 dark:text-white mb-1">
              Job Run Created
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Job run #{createdJob.id} has been queued and will be picked up by the worker shortly.
            </p>

            <div className="mb-6 rounded-lg border bg-neutral-50 dark:bg-neutral-900 p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Job Run ID</span>
                <span className="font-mono font-medium text-neutral-950 dark:text-white">
                  #{createdJob.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Job Type</span>
                <span className="font-medium text-neutral-950 dark:text-white">{jobTypeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium text-teal-600">{createdJob.status}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCreateAnother}>
                <Plus className="w-4 h-4 mr-2" />
                Create Another
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => navigate("/admin")}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Job Run</CardTitle>
          <CardDescription>
            Queue a job run for any project. The worker will pick it up on the next polling cycle.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Load error */}
          {loadError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
              {loadError}
            </div>
          )}

          {/* User */}
          <div className="space-y-2">
            <Label htmlFor="user-select">User</Label>
            {isLoadingUsers ? (
              <div className="flex items-center gap-2 h-9 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading users…
              </div>
            ) : (
              <SearchableUserSelect
                users={users}
                value={selectedUserId}
                onValueChange={handleUserChange}
                disabled={isLoadingUsers}
              />
            )}
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={selectedProjectId}
              onValueChange={(v) => {
                setSelectedProjectId(v);
                setSubmitError(null);
              }}
              disabled={!selectedUserId || projectsForUser.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedUserId
                      ? "Select a user first"
                      : projectsForUser.length === 0
                      ? "No projects for this user"
                      : "Select a project…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {projectsForUser.map((p) => (
                  <SelectItem key={p.projectId} value={String(p.projectId)}>
                    <span>{p.projectName}</span>
                    {p.status !== "active" && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({p.status})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select
              value={selectedJobType}
              onValueChange={(v) => {
                setSelectedJobType(v);
                setSubmitError(null);
              }}
              disabled={!selectedProjectId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedProjectId ? "Select a project first" : "Select a job type…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Job type description hint */}
            {selectedJobType && (
              <p className="text-xs text-muted-foreground">
                {JOB_TYPE_OPTIONS.find((o) => o.value === selectedJobType)?.description}
              </p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/admin")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job Run
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
