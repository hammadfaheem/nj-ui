import React, { useState } from "react";
import { ChevronUp, ChevronDown, Play, Copy } from "lucide-react";
import type { CallLog } from "../../types/api";

interface TableProps {
  data: CallLog[];
  loading?: boolean;
}

export const Table: React.FC<TableProps> = ({ data, loading = false }) => {
  const columns = [
    { key: "index" as keyof CallLog, label: "#", width: "w-16" },
    { key: "call_id" as keyof CallLog, label: "Call ID", width: "w-32" },
    { key: "created_at" as keyof CallLog, label: "Created At", width: "w-40" },
    { key: "direction" as keyof CallLog, label: "Direction", width: "w-32" },
    { key: "to" as keyof CallLog, label: "To", width: "w-48" },
    { key: "from_" as keyof CallLog, label: "From", width: "w-32" },
    { key: "recording" as keyof CallLog, label: "Recording", width: "w-32" },
    { key: "status" as keyof CallLog, label: "Status", width: "w-24" },
    { key: "duration" as keyof CallLog, label: "Duration", width: "w-24" },
    { key: "price" as keyof CallLog, label: "Price", width: "w-24" },
    {
      key: "agent_price" as keyof CallLog,
      label: "Agent Price",
      width: "w-24",
    },
  ];
  const [sortField, setSortField] = useState<keyof CallLog | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof CallLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [data, sortField, sortDirection]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-400/10 text-green-400 border-green-400/20";
      case "failed":
        return "bg-red-400/10 text-red-400 border-red-400/20";
      case "no-answer":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
      case "busy":
        return "bg-orange-400/10 text-orange-400 border-orange-400/20";
      default:
        return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction.includes("inbound") || direction.includes("originating")) {
      return "↓";
    }
    return "↑";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
    }).format(Math.abs(price));
  };

  const formatDuration = (duration: string) => {
    // Extract numeric value from duration string (e.g., "132s" -> 132)
    const seconds = parseInt(duration.replace(/[^\d]/g, ""));
    if (isNaN(seconds)) return duration;

    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const SortIcon = ({ field }: { field: keyof CallLog }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-500" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-brand-red" />
    ) : (
      <ChevronDown className="h-4 w-4 text-brand-red" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-48"></div>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-dark-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors ${column.width}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <SortIcon field={column.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {sortedData.map((log, index) => (
              <tr
                key={log.call_id}
                className="hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white font-mono text-xs">
                      {log.call_id.substring(0, 8)}...
                    </span>
                    <button
                      onClick={() => copyToClipboard(log.call_id)}
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(log.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-brand-red font-bold">
                      {getDirectionIcon(log.direction)}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize text-xs">
                      {log.direction.replace("-", " ")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                  {log.to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {log.from_}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {log.recording ? (
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-brand-red hover:text-brand-red-secondary transition-colors">
                        <Play className="h-3 w-3" />
                        <span className="text-xs">Play</span>
                      </button>
                      <span className="text-gray-500 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-xs text-gray-400">0:00 / 1:00</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      No recording
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      log.status
                    )}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right font-mono">
                  {formatDuration(log.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right font-mono">
                  {formatPrice(log.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right font-mono">
                  {formatPrice(log.agent_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No call logs found</p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-dark-900 px-6 py-3 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 1 to {sortedData.length} of {sortedData.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
