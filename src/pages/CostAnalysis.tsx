import React from "react";
import { DollarSign, TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { ChartCard } from "../components/UI/ChartCard";
import { CostTrendsChart } from "../components/Charts/CostTrendsChart";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";
import type { MetricsCostTrend, MetricsStatusBreakdown } from "../types/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const CostAnalysis: React.FC = () => {
  // New metrics endpoints
  const { data: costTrends, loading: costLoading } = useApiData<
    MetricsCostTrend[]
  >(() => apiService.getMetricsCostTrends());
  const safeCostTrends = costTrends ?? [];
  const { data: statusBreakdown, loading: statusLoading } =
    useApiData<MetricsStatusBreakdown>(() =>
      apiService.getMetricsStatusBreakdown()
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === "total_cost" ? "Cost" : "Calls"}: ${
                entry.dataKey === "total_cost" ? "$" : ""
              }${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cost Analysis
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Detailed cost breakdown and optimization insights
            </p>
          </div>

          {/* Cost Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Cost"
              value={
                safeCostTrends.length > 0
                  ? formatCurrency(
                      safeCostTrends.reduce(
                        (sum, day) => sum + day.total_cost,
                        0
                      )
                    )
                  : "$0.00"
              }
              change="-5.2% from last month"
              changeType="positive"
              icon={DollarSign}
              loading={costLoading}
            />
            <StatCard
              title="Cost per Call"
              value={
                safeCostTrends.length > 0
                  ? formatCurrency(
                      safeCostTrends.reduce(
                        (sum, day) => sum + day.avg_cost_per_call,
                        0
                      ) / safeCostTrends.length
                    )
                  : "$0.00"
              }
              change="+0.003 from last month"
              changeType="negative"
              icon={Calculator}
              loading={costLoading}
            />
            <StatCard
              title="Daily Average"
              value={
                safeCostTrends.length > 0
                  ? formatCurrency(
                      safeCostTrends.reduce(
                        (sum, day) => sum + day.total_cost,
                        0
                      ) / safeCostTrends.length
                    )
                  : "$0.00"
              }
              change="-2.1% from last month"
              changeType="positive"
              icon={TrendingDown}
              loading={costLoading}
            />
            <StatCard
              title="Cost Efficiency"
              value={
                statusBreakdown
                  ? `${statusBreakdown.completed.percent.toFixed(0)}%`
                  : "0%"
              }
              change="+15% from last month"
              changeType="positive"
              icon={TrendingUp}
              loading={statusLoading}
            />
          </div>

          {/* Cost Trends Chart */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard
              title="Daily Cost Trends"
              subtitle="Track cost patterns over time"
              loading={costLoading}
            >
              {costTrends && <CostTrendsChart data={costTrends} />}
            </ChartCard>
          </div>

          {/* Cost by Direction and Status */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <ChartCard
              title="Cost by Direction"
              subtitle="Inbound vs Outbound cost analysis"
              loading={costLoading}
            >
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">
                    Feature Coming Soon
                  </p>
                  <p className="text-sm">
                    Cost by direction analysis will be available soon.
                  </p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Cost by Status"
              subtitle="Cost breakdown by call outcome"
              loading={costLoading}
            >
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">
                    Feature Coming Soon
                  </p>
                  <p className="text-sm">
                    Cost by status analysis will be available soon.
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};
