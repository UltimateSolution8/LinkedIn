
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, BellOff, Search, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { getAllNotifications, markAllAsRead, type Notification } from "@/lib/api/notifications";

type FilterType = "all" | "unread";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeFilter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotifications = () => {
    if (activeFilter === "unread") {
      setFilteredNotifications(notifications.filter((n) => !n.isRead));
    } else {
      setFilteredNotifications(notifications);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingRead(true);
      await markAllAsRead();
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) {
      return "Just now";
    } else if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else {
      return `${diffInDays} days ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leads_found":
        return <Search className="w-5 h-5" />;
      case "ai_suggestion":
        return <Sparkles className="w-5 h-5" />;
      case "weekly_summary":
      case "summary":
        return <FileText className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="text-center">
          <BellOff className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-lg text-red-600 dark:text-red-400 mb-2">
            Error loading notifications
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center overflow-y-auto py-8 px-4">
      <div className="w-full max-w-3xl">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <h1 className="text-neutral-950 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingRead}
              className="bg-teal-600/20 dark:bg-teal-600/30 text-teal-600 dark:text-teal-400 hover:bg-teal-600/30 dark:hover:bg-teal-600/40"
            >
              {isMarkingRead ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark all as read
                </>
              )}
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex px-4 py-3">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-1">
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-neutral-950 has-[:checked]:shadow-sm has-[:checked]:text-teal-600 dark:has-[:checked]:text-teal-400 text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-normal transition-colors">
              <span className="truncate">All</span>
              <input
                checked={activeFilter === "all"}
                onChange={() => setActiveFilter("all")}
                className="invisible w-0"
                name="notification-filter"
                type="radio"
                value="all"
              />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-neutral-950 has-[:checked]:shadow-sm has-[:checked]:text-teal-600 dark:has-[:checked]:text-teal-400 text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-normal transition-colors">
              <span className="truncate flex items-center gap-2">
                Unread
                {unreadCount > 0 && (
                  <Badge className="bg-teal-600/20 dark:bg-teal-600/30 text-teal-600 dark:text-teal-400 hover:bg-teal-600/20">
                    {unreadCount}
                  </Badge>
                )}
              </span>
              <input
                checked={activeFilter === "unread"}
                onChange={() => setActiveFilter("unread")}
                className="invisible w-0"
                name="notification-filter"
                type="radio"
                value="unread"
              />
            </label>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-3 p-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-12 mt-8 bg-neutral-100/50 dark:bg-neutral-800/20 rounded-xl">
              <div className="flex items-center justify-center size-16 bg-teal-600/20 dark:bg-teal-600/30 rounded-full text-teal-600 dark:text-teal-400">
                <BellOff className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold text-neutral-950 dark:text-white">
                  {activeFilter === "unread" ? "All caught up!" : "No notifications yet"}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {activeFilter === "unread"
                    ? "You have no unread notifications."
                    : "New notifications from your lead monitoring will appear here."}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="group flex items-center gap-4 bg-white dark:bg-neutral-900/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-neutral-200 dark:border-neutral-800"
              >
                {/* Unread Indicator */}
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    notification.isRead
                      ? "bg-transparent"
                      : "bg-teal-600 dark:bg-teal-500"
                  }`}
                />

                {/* Icon */}
                <div className="text-teal-600 dark:text-teal-400 flex items-center justify-center rounded-lg bg-teal-600/20 dark:bg-teal-600/30 shrink-0 size-12">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-neutral-950 dark:text-white text-base font-bold leading-normal">
                      {notification.title}
                    </p>
                    {notification.project && (
                      <Badge className="bg-teal-600/10 dark:bg-teal-600/20 text-teal-600 dark:text-teal-400 hover:bg-teal-600/10 text-xs">
                        {notification.project.projectName}
                      </Badge>
                    )}
                  </div>
                  {notification.message && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal mt-1">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
