import React from "react";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { ChartCard } from "../components/UI/ChartCard";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";

export const Monitoring: React.FC = () => {
  const { data: currentStatus, loading: statusLoading } = useApiData(
    apiService.getCurrentStatus
  );

  const getHealthColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case "operational":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getActivityLevel = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return { color: "text-red-400", bg: "bg-red-400/10" };
      case "medium":
        return { color: "text-yellow-400", bg: "bg-yellow-400/10" };
      case "low":
        return { color: "text-green-400", bg: "bg-green-400/10" };
      default:
        return { color: "text-gray-400", bg: "bg-gray-400/10" };
    }
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950 min-h-screen">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Monitoring
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Real-time system health and activity monitoring
            </p>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="System Health"
              value={currentStatus?.system_health || "Unknown"}
              icon={CheckCircle}
              loading={statusLoading}
            />
            <StatCard
              title="24h Calls"
              value={
                currentStatus?.last_24_hours.total_calls?.toLocaleString() ||
                "0"
              }
              change={`${
                currentStatus?.last_24_hours.success_rate?.toFixed(1) || "0"
              }% success`}
              changeType="positive"
              icon={Activity}
              loading={statusLoading}
            />
            <StatCard
              title="Last Hour"
              value={
                currentStatus?.last_hour.total_calls?.toLocaleString() || "0"
              }
              change={currentStatus?.last_hour.activity_level || "Unknown"}
              changeType="neutral"
              icon={Clock}
              loading={statusLoading}
            />
            <StatCard
              title="Failed Calls (24h)"
              value={
                currentStatus?.last_24_hours.failed_calls?.toLocaleString() ||
                "0"
              }
              change="Monitoring"
              changeType="negative"
              icon={AlertTriangle}
              loading={statusLoading}
            />
          </div>

          {/* System Health Dashboard */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Overall Health
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${getHealthColor(
                      currentStatus?.system_health || ""
                    )}`}
                  >
                    {currentStatus?.system_health || "Loading..."}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Activity Level
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      getActivityLevel(
                        currentStatus?.last_hour.activity_level || ""
                      ).color
                    } ${
                      getActivityLevel(
                        currentStatus?.last_hour.activity_level || ""
                      ).bg
                    }`}
                  >
                    {currentStatus?.last_hour.activity_level || "Loading..."}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Last Update
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                24-Hour Summary
              </h3>
              {currentStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 text-center border border-gray-200 dark:border-dark-600">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentStatus.last_24_hours.total_calls.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total Calls
                      </div>
                    </div>
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 text-center border border-gray-200 dark:border-dark-600">
                      <div className="text-2xl font-bold text-green-400">
                        {currentStatus.last_24_hours.completed_calls.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 text-center border border-gray-200 dark:border-dark-600">
                      <div className="text-2xl font-bold text-red-400">
                        {currentStatus.last_24_hours.failed_calls.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Failed
                      </div>
                    </div>
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 text-center border border-gray-200 dark:border-dark-600">
                      <div className="text-2xl font-bold text-brand-red">
                        {currentStatus.last_24_hours.success_rate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-200 dark:bg-dark-700 rounded"></div>
                    <div className="h-16 bg-gray-200 dark:bg-dark-700 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-200 dark:bg-dark-700 rounded"></div>
                    <div className="h-16 bg-gray-200 dark:bg-dark-700 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alerts and Notifications */}
          <div className="bg-green-50 dark:bg-green-400/10 border border-green-200 dark:border-green-400/20 rounded-lg flex items-center space-x-3 p-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">System Operational</p>
              <p className="text-sm text-gray-400">
                All services running normally
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 rounded-lg flex items-center space-x-3 p-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-blue-400 font-medium">
                Performance Monitoring Active
              </p>
              <p className="text-sm text-gray-400">
                Real-time metrics collection enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
