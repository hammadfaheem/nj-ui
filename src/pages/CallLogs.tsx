import React, { useState } from "react";
import { FileText, Search, Filter, Download, RefreshCw } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { Table } from "../components/UI/Table";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";
export const CallLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState(25);

  const {
    data: callLogs,
    loading: logsLoading,
    refetch,
  } = useApiData(
    (params) =>
      apiService.getCallLogs({
        ...params,
        status: statusFilter || undefined,
        limit: limitFilter,
      }),
    [statusFilter, limitFilter]
  );

  // Calculate today's and yesterday's calls for summary stats
  const todaysCalls =
    callLogs?.data?.filter((log: import("../types/api").CallLog) => {
      const logDate = new Date(log.created_at).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length || 0;

  const yesterdaysCalls =
    callLogs?.data?.filter((log: import("../types/api").CallLog) => {
      const logDate = new Date(log.created_at).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      return logDate === yesterday;
    }).length || 0;

  const inboundCalls =
    callLogs?.data?.filter(
      (log: import("../types/api").CallLog) =>
        log.direction.includes("inbound") ||
        log.direction.includes("originating")
    ).length || 0;

  const outboundCalls =
    callLogs?.data?.filter(
      (log: import("../types/api").CallLog) =>
        log.direction.includes("outbound") ||
        log.direction.includes("terminating")
    ).length || 0;

  // Filter logs based on search term
  const filteredLogs =
    callLogs?.data?.filter((log: import("../types/api").CallLog) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        log.call_id.toLowerCase().includes(searchLower) ||
        log.to.toLowerCase().includes(searchLower) ||
        log.from_.toLowerCase().includes(searchLower) ||
        log.status.toLowerCase().includes(searchLower)
      );
    }) || [];

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting call logs...");
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950 min-h-screen">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Call Logs
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Detailed call logs with recordings and analytics
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Inbound"
              value={inboundCalls.toString()}
              change="↓"
              changeType="neutral"
              icon={FileText}
              loading={logsLoading}
            />
            <StatCard
              title="Outbound"
              value={outboundCalls.toString()}
              change="↑"
              changeType="positive"
              icon={FileText}
              loading={logsLoading}
            />
            <StatCard
              title="Total Calls Today"
              value={todaysCalls.toString()}
              icon={FileText}
              loading={logsLoading}
            />
            <StatCard
              title="Total Calls Yesterday"
              value={yesterdaysCalls.toString()}
              icon={FileText}
              loading={logsLoading}
            />
          </div>

          {/* Filters and Controls */}
          <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="no-answer">No Answer</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>

                {/* Limit Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Show:</span>
                  <select
                    value={limitFilter}
                    onChange={(e) => setLimitFilter(Number(e.target.value))}
                    className="bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={logsLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${logsLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-red hover:bg-brand-red-secondary rounded-lg text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Call Logs Table */}
          <Table data={filteredLogs} loading={logsLoading} />
        </div>
      </div>
    </div>
  );
};
