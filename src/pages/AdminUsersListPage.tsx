import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, RefreshCw, ChevronRight } from "lucide-react";
import { getUsersList, type UserListItem, type UsersListResponse } from "@/lib/api/admin";
import Pagination from "@/components/ui/pagination";

export default function AdminUsersListPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalUsers: 0,
    pageSize: 50,
  });

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: UsersListResponse = await getUsersList(page, 50);
      setUsers(response.data);
      setPagination({
        totalPages: response.pagination.totalPages,
        totalUsers: response.pagination.totalUsers,
        pageSize: response.pagination.pageSize,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchUsers(currentPage);
  };

  const handleUserClick = (userId: number) => {
    navigate(`/admin/users/${userId}`);
  };

  const getSubscriptionBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400";
      case 'cancelled':
      case 'canceled':
        return "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400";
      case 'trialing':
        return "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400";
      default:
        return "bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400";
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
              Users & Projects
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {pagination.totalUsers} total users
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    User
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Projects
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Active / Disabled
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Subscription
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
                    onClick={() => handleUserClick(user.userId)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-neutral-950 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400">
                        {user.projectCount}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 text-xs">
                          {user.activeProjectCount} active
                        </Badge>
                        {user.disabledProjectCount > 0 && (
                          <Badge className="bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 text-xs">
                            {user.disabledProjectCount} disabled
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <Badge className={`${getSubscriptionBadgeStyles(user.subscriptionStatus)} text-xs`}>
                          {user.subscriptionStatus}
                        </Badge>
                        {user.subscriptionPlan && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {user.subscriptionPlan.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user.userId);
                        }}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={currentPage < pagination.totalPages}
                hasPrevPage={currentPage > 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
