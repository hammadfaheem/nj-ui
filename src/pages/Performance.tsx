import React from "react";
import { Activity, Target, Zap, TrendingUp } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { ChartCard } from "../components/UI/ChartCard";
import { SipPerformanceChart } from "../components/Charts/SipPerformanceChart";
import { CorrelationHeatmap } from "../components/Charts/CorrelationHeatmap";
import { PerformanceScatter } from "../components/Charts/PerformanceScatter";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";
import type {
  SipPerformance,
  CorrelationMatrix,
  PerformanceQuadrant,
  MetricsStatusBreakdown,
} from "../types/api";

export const Performance: React.FC = () => {
  // Use new metrics endpoints
  const { data: sipPerformance, loading: sipLoading } = useApiData<
    SipPerformance[]
  >(() => apiService.getMetricsSipPerformance());
  const safeSipPerformance = sipPerformance ?? [];
  const { data: correlationMatrix = {}, loading: correlationLoading } =
    useApiData<CorrelationMatrix>(() =>
      apiService.getMetricsCorrelationMatrix()
    );
  const { data: performanceQuadrant = [], loading: quadrantLoading } =
    useApiData<PerformanceQuadrant[]>(() =>
      apiService.getMetricsPerformanceQuadrant()
    );
  const { data: summary, loading: summaryLoading } =
    useApiData<MetricsStatusBreakdown>(() =>
      apiService.getMetricsStatusBreakdown()
    );

  const topPerformer =
    safeSipPerformance.length > 0
      ? safeSipPerformance.reduce((prev, current) =>
          prev.success_rate > current.success_rate ? prev : current
        )
      : undefined;

  const avgSuccessRate =
    safeSipPerformance.length > 0
      ? safeSipPerformance.reduce((sum, sip) => sum + sip.success_rate, 0) /
        safeSipPerformance.length
      : 0;

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950 min-h-screen">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Performance Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Deep dive into call performance and SIP domain analysis
            </p>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Overall Success Rate"
              value={
                summary ? `${summary.completed.percent.toFixed(1)}%` : "0%"
              }
              change="+2.3% from last month"
              changeType="positive"
              icon={Target}
              loading={summaryLoading}
            />
            <StatCard
              title="Top Performer"
              value={
                topPerformer ? `${topPerformer.success_rate.toFixed(1)}%` : "0%"
              }
              change={topPerformer?.sip_domain || "N/A"}
              changeType="positive"
              icon={Zap}
              loading={sipLoading}
            />
            <StatCard
              title="Avg SIP Performance"
              value={avgSuccessRate ? `${avgSuccessRate.toFixed(1)}%` : "0%"}
              change="+1.8% from last month"
              changeType="positive"
              icon={Activity}
              loading={sipLoading}
            />
            <StatCard
              title="Performance Score"
              value={
                summary
                  ? Math.round(summary.completed.percent * 10).toString()
                  : "0"
              }
              change="+5 points from last month"
              changeType="positive"
              icon={TrendingUp}
              loading={summaryLoading}
            />
          </div>

          {/* SIP Performance Chart */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard
              title="SIP Domain Performance"
              subtitle="Success rates and call volumes by SIP domain"
              loading={sipLoading}
            >
              {sipPerformance && <SipPerformanceChart data={sipPerformance} />}
            </ChartCard>
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <ChartCard
              title="Performance Correlation Matrix"
              subtitle="Relationships between key metrics"
              loading={correlationLoading}
              className="overflow-x-auto p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700"
            >
              <div className="overflow-x-auto">
                {correlationMatrix && (
                  <CorrelationHeatmap data={correlationMatrix} />
                )}
              </div>
            </ChartCard>

            <ChartCard
              title="Performance Quadrant Analysis"
              subtitle="Success rate vs cost efficiency"
              loading={quadrantLoading}
            >
              {performanceQuadrant && (
                <PerformanceScatter data={performanceQuadrant} />
              )}
            </ChartCard>
          </div>

          {/* Performance Insights */}
          <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Best Performing SIP
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {topPerformer
                    ? `${
                        topPerformer.sip_domain
                      } with ${topPerformer.success_rate.toFixed(
                        1
                      )}% success rate`
                    : "Loading..."}
                </p>
              </div>
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Optimization Opportunity
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Focus on improving call completion rates during peak hours
                </p>
              </div>
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Cost Efficiency
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  High-performing SIPs show better cost-per-successful-call
                  ratios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
