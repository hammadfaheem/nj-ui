import React from "react";
import { TrendingUp, DollarSign, Phone, CheckCircle } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";
import { useDashboardStore } from "../store/dashboardStore";
import type { MetricsCostTrend, MetricsStatusBreakdown } from "../types/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export const Metrics: React.FC = () => {
  const { dateRange } = useDashboardStore();

  // Create a key that changes when dateRange changes to force re-fetch
  const dateRangeKey = `${dateRange.start_date}-${dateRange.end_date}`;

  // Only the 6 specified metrics APIs - reactive to date range changes
  const { data: costTrends, loading: costLoading } = useApiData<
    MetricsCostTrend[]
  >(
    () =>
      apiService.getMetricsCostTrends({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      }),
    [dateRangeKey] // Re-fetch when date range changes
  );

  const { data: statusBreakdown, loading: statusLoading } =
    useApiData<MetricsStatusBreakdown>(
      () =>
        apiService.getMetricsStatusBreakdown({
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
        }),
      [dateRangeKey]
    );

  const { data: volumeOverTime, loading: volumeLoading } = useApiData(
    () =>
      apiService.getMetricsVolumeOverTime({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      }),
    [dateRangeKey]
  );

  const { data: callDirection, loading: directionLoading } = useApiData(
    () =>
      apiService.getMetricsCallDirection({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      }),
    [dateRangeKey]
  );

  const { data: successEvaluation, loading: successEvalLoading } = useApiData(
    () =>
      apiService.getMetricsSuccessEvaluation({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        limit: 10,
      }),
    [dateRangeKey]
  );

  const { data: successDonut, loading: donutLoading } = useApiData(
    () =>
      apiService.getMetricsSuccessDonut({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      }),
    [dateRangeKey]
  );

  // Safe data arrays with proper data transformation
  const safeCostTrends = (costTrends ?? []).map((item) => {
    console.log("🔍 Cost Trends Item:", item);
    return {
      ...item,
      date: item.time, // Transform 'time' to 'date' for chart compatibility
    };
  });

  const safeVolumeOverTime = (volumeOverTime ?? []).map((item) => {
    console.log("🔍 Volume Over Time Item:", item);
    return {
      ...item,
      date: item.time, // Transform 'time' to 'date'
      total_calls: item["Total Calls"], // Transform 'Total Calls' to 'total_calls'
    };
  });

  // Debug logging for transformed data
  React.useEffect(() => {
    console.log("🔍 Transformed Cost Trends:", safeCostTrends);
    console.log("🔍 Transformed Volume Over Time:", safeVolumeOverTime);
    console.log("🔍 Status Breakdown:", statusBreakdown);
    console.log("🔍 Success Donut:", successDonut);
    console.log("🔍 Success Evaluation:", successEvaluation);
  }, [
    safeCostTrends,
    safeVolumeOverTime,
    statusBreakdown,
    successDonut,
    successEvaluation,
  ]);

  // Calculations
  const totalCost = safeCostTrends.reduce(
    (sum: number, day: any) => sum + (day.total_cost || 0),
    0
  );

  const totalCalls = safeVolumeOverTime.reduce(
    (sum: number, day: any) => sum + (day.total_calls || 0),
    0
  );

  const successRate = statusBreakdown
    ? (statusBreakdown.completed?.count /
        (statusBreakdown.completed?.count +
          statusBreakdown.failed?.count +
          statusBreakdown.no_answer?.count)) *
      100
    : 0;

  // Debug calculations
  React.useEffect(() => {
    console.log("🔍 Key Metrics Calculations:");
    console.log("  - Total Cost:", totalCost);
    console.log("  - Total Calls:", totalCalls);
    console.log("  - Success Rate:", successRate);
    console.log("  - Cost Trends Length:", safeCostTrends.length);
    console.log("  - Volume Over Time Length:", safeVolumeOverTime.length);
    console.log("  - Status Breakdown:", statusBreakdown);
  }, [
    totalCost,
    totalCalls,
    successRate,
    safeCostTrends,
    safeVolumeOverTime,
    statusBreakdown,
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Professional balanced color palette - NJX red with complementary colors
  const COLORS = ["#DC2626", "#2563EB", "#059669", "#D97706", "#7C3AED"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:pl-[var(--sidebar-width,18rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Metrics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Real-time analytics and performance insights
              </p>
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Current range:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(dateRange.start_date).toLocaleDateString()} -{" "}
                  {new Date(dateRange.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Buttons removed as requested - not useful for current implementation */}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Calls
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {volumeLoading ? "..." : totalCalls.toLocaleString()}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Success Rate
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {statusLoading ? "..." : `${successRate.toFixed(1)}%`}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Cost
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {costLoading ? "..." : formatCurrency(totalCost)}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Avg Cost/Call
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {costLoading
                    ? "..."
                    : formatCurrency(
                        safeCostTrends.length > 0
                          ? safeCostTrends.reduce(
                              (sum: number, day: any) =>
                                sum + (day.avg_cost_per_call || 0),
                              0
                            ) / safeCostTrends.length
                          : 0
                      )}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-8">
          {/* Cost Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cost Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily cost analysis over time
              </p>
            </div>
            {costLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : safeCostTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={safeCostTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Cost",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary, #ffffff)",
                      border: "1px solid var(--border-color, #e5e7eb)",
                      borderRadius: "8px",
                      color: "var(--text-primary, #111827)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      fontSize: "14px",
                      padding: "8px 12px",
                      zIndex: 9999,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_cost"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No cost data available
              </div>
            )}
          </div>

          {/* Call Volume */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Call Volume
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily call volume trends
              </p>
            </div>
            {volumeLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : safeVolumeOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={safeVolumeOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value: number) => [`${value} calls`, "Volume"]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary, #ffffff)",
                      border: "1px solid var(--border-color, #e5e7eb)",
                      borderRadius: "8px",
                      color: "var(--text-primary, #111827)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      fontSize: "14px",
                      padding: "8px 12px",
                      zIndex: 9999,
                    }}
                  />
                  <Bar
                    dataKey="total_calls"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No volume data available
              </div>
            )}
          </div>

          {/* Success Donut */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Success Distribution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Breakdown of call outcomes
              </p>
            </div>
            {donutLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : successDonut ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={[
                      {
                        name: "Completed",
                        value: successDonut.successful?.count || 0,
                        percentage:
                          successDonut.successful?.percent?.toFixed(1) || "0.0",
                      },
                      {
                        name: "Failed",
                        value: successDonut.unsuccessful?.count || 0,
                        percentage:
                          successDonut.unsuccessful?.percent?.toFixed(1) ||
                          "0.0",
                      },
                      {
                        name: "No Answer",
                        value: successDonut.no_answer?.count || 0,
                        percentage:
                          successDonut.no_answer?.percent?.toFixed(1) || "0.0",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      {
                        name: "Completed",
                        value: successDonut.successful?.count || 0,
                        percentage:
                          successDonut.successful?.percent?.toFixed(1) || "0.0",
                      },
                      {
                        name: "Failed",
                        value: successDonut.unsuccessful?.count || 0,
                        percentage:
                          successDonut.unsuccessful?.percent?.toFixed(1) ||
                          "0.0",
                      },
                      {
                        name: "No Answer",
                        value: successDonut.no_answer?.count || 0,
                        percentage:
                          successDonut.no_answer?.percent?.toFixed(1) || "0.0",
                      },
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} calls (${
                        props?.payload?.percentage || "0.0"
                      }%)`,
                      name,
                    ]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: "var(--bg-secondary, #ffffff)",
                      border: "1px solid var(--border-color, #e5e7eb)",
                      borderRadius: "8px",
                      color: "var(--text-primary, #111827)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      fontSize: "14px",
                      padding: "8px 12px",
                      zIndex: 9999,
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No success data available
              </div>
            )}
          </div>

          {/* Success Evaluation Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Call Evaluations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest call performance results
              </p>
            </div>
            {successEvalLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : successEvaluation && successEvaluation.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Call ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Duration
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {successEvaluation
                      .slice(0, 5)
                      .map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-mono">
                            {item.call_id?.substring(0, 12)}...
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {item.customer || "Unknown"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                            {item.duration || "0m 0s"}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.evaluation === "Pass"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {item.evaluation || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No evaluation data available
              </div>
            )}
          </div>
        </div>

        {/* Call Direction (if available) */}
        {callDirection && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Call Direction
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Inbound vs outbound call analysis
              </p>
            </div>
            {directionLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Call direction data visualization coming soon
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
