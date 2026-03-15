import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TodaysLeadsByProject } from "@/lib/api/admin";
import { ArrowUpDown } from "lucide-react";

interface TodaysLeadsTableProps {
  leads: TodaysLeadsByProject[];
}

type SortField = 'projectName' | 'saleLeads' | 'engagementLeads' | 'commentSourceLeads' | 'totalLeadsToday';
type SortDirection = 'asc' | 'desc';

export default function TodaysLeadsTable({ leads }: TodaysLeadsTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('totalLeadsToday');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleProjectClick = (projectId: number, userId: number) => {
    navigate(`/admin/users/${userId}/projects/${projectId}`);
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        No leads generated today
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th
              className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => handleSort('projectName')}
            >
              <div className="flex items-center gap-2">
                Project Name
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => handleSort('saleLeads')}
            >
              <div className="flex items-center justify-end gap-2">
                Sale Leads
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => handleSort('engagementLeads')}
            >
              <div className="flex items-center justify-end gap-2">
                Engagement Leads
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => handleSort('commentSourceLeads')}
            >
              <div className="flex items-center justify-end gap-2">
                Comment Source
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => handleSort('totalLeadsToday')}
            >
              <div className="flex items-center justify-end gap-2">
                Total
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLeads.map((lead) => (
            <tr
              key={lead.projectId}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              onClick={() => handleProjectClick(lead.projectId, lead.userId)}
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-neutral-950 dark:text-white">
                    {lead.projectName}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {lead.userName}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <Badge className="bg-teal-600/10 dark:bg-teal-600/20 text-teal-600 dark:text-teal-400">
                  {lead.saleLeads}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <Badge className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
                  {lead.engagementLeads}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <Badge className="bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400">
                  {lead.commentSourceLeads}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="font-semibold text-neutral-950 dark:text-white">
                  {lead.totalLeadsToday}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
