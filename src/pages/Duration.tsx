import React from "react";
import { Clock, Timer, BarChart3, TrendingUp } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { ChartCard } from "../components/UI/ChartCard";
import { DurationHistogram } from "../components/Charts/DurationHistogram";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";
import { BoxPlot } from "recharts";

export const Duration: React.FC = () => {
  const { data: durationDistribution, loading: distributionLoading } =
    useApiData(apiService.getDurationDistribution);
  const { data: durationBySip, loading: sipDurationLoading } = useApiData(
    apiService.getDurationBySip
  );
  const { data: summary, loading: summaryLoading } = useApiData(
    apiService.getCallSummary
  );

  const formatDuration = (seconds: number): string => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const longestSip = durationBySip?.reduce((prev, current) =>
    prev.mean > current.mean ? prev : current
  );

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950 min-h-screen">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Duration Analysis
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analyze call duration patterns and distribution
            </p>
          </div>

          {/* Duration Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Average Duration"
              value={
                summary
                  ? formatDuration(summary.average_duration_seconds)
                  : "0s"
              }
              change="+8s from last month"
              changeType="positive"
              icon={Clock}
              loading={summaryLoading}
            />
            <StatCard
              title="Median Duration"
              value={
                durationDistribution
                  ? formatDuration(durationDistribution.statistics.median)
                  : "0s"
              }
              change="+5s from last month"
              changeType="positive"
              icon={Timer}
              loading={distributionLoading}
            />
            <StatCard
              title="Max Duration"
              value={
                durationDistribution
                  ? formatDuration(durationDistribution.statistics.max)
                  : "0s"
              }
              change="Same as last month"
              changeType="neutral"
              icon={TrendingUp}
              loading={distributionLoading}
            />
            <StatCard
              title="Longest SIP Avg"
              value={longestSip ? formatDuration(longestSip.mean) : "0s"}
              change={longestSip?.sip_domain || "N/A"}
              changeType="neutral"
              icon={BarChart3}
              loading={sipDurationLoading}
            />
          </div>

          {/* Duration Distribution */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard
              title="Call Duration Distribution"
              subtitle="Histogram showing call duration patterns"
              loading={distributionLoading}
            >
              {durationDistribution && (
                <DurationHistogram data={durationDistribution} />
              )}
            </ChartCard>
          </div>

          {/* Duration Statistics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Duration Statistics
              </h3>
              {durationDistribution ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Mean:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDuration(durationDistribution.statistics.mean)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Median:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDuration(durationDistribution.statistics.median)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Standard Deviation:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {durationDistribution.statistics.std_dev.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Min Duration:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDuration(durationDistribution.statistics.min)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Max Duration:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDuration(durationDistribution.statistics.max)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Calls:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {durationDistribution.statistics.total_calls.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SIP Duration Summary
              </h3>
              {durationBySip ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {durationBySip.map((sip, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 dark:bg-dark-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-900 dark:text-white font-medium text-sm">
                          {sip.sip_domain}
                        </span>
                        <span className="text-brand-red text-sm">
                          {sip.count} calls
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Mean:
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDuration(sip.mean)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Median:
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDuration(sip.median)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 dark:bg-dark-700 rounded"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
