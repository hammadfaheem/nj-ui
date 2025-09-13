import React, { useState, useEffect } from "react";
import { Phone, CheckCircle, DollarSign, Clock, User } from "lucide-react";
import { StatCard } from "../components/UI/StatCard";
import { ChartCard } from "../components/UI/ChartCard";
import { CallVolumeChart } from "../components/Charts/CallVolumeChart";
import { useApiData } from "../hooks/useApiData";
import { apiService } from "../services/api";

export const Dashboard: React.FC = () => {
  // User profile state
  const [userProfile, setUserProfile] = useState<{
    email: string;
    first_name: string;
    last_name: string;
  } | null>(null);

  // Use new backend endpoints
  const { data: summary, loading: summaryLoading } = useApiData(() =>
    apiService.getOverviewSummary()
  );
  const { data: successOverTime, loading: successLoading } = useApiData(() =>
    apiService.getOverviewSuccessOverTime()
  );

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Don't set fallback data - let it remain null
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDuration = (seconds: number): string => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="lg:pl-[var(--sidebar-width,18rem)] bg-white dark:bg-dark-950">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back,{" "}
                  {userProfile
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : "User"}
                  !
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Here's your dashboard overview
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your Twilio call analytics and performance metrics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Calls"
              value={summary?.total_calls?.toLocaleString() || "0"}
              change={
                successOverTime?.percent_change
                  ? `${successOverTime.percent_change.toFixed(
                      1
                    )}% from last period`
                  : ""
              }
              changeType={
                successOverTime?.percent_change &&
                successOverTime.percent_change > 0
                  ? "positive"
                  : "neutral"
              }
              icon={Phone}
              loading={summaryLoading}
            />
            <StatCard
              title="Success Rate"
              value={
                summary ? `${summary.call_success_rate?.toFixed(1)}%` : "0%"
              }
              change={
                successOverTime?.percent_change
                  ? `${successOverTime.percent_change.toFixed(
                      1
                    )}% from last period`
                  : ""
              }
              changeType={
                successOverTime?.percent_change &&
                successOverTime.percent_change > 0
                  ? "positive"
                  : "neutral"
              }
              icon={CheckCircle}
              loading={summaryLoading}
            />
            <StatCard
              title="Total Cost"
              value={summary ? formatCurrency(summary.total_cost) : "$0.00"}
              change={
                summary?.avg_cost
                  ? `Avg: ${formatCurrency(summary.avg_cost)}`
                  : ""
              }
              changeType="neutral"
              icon={DollarSign}
              loading={summaryLoading}
            />
            <StatCard
              title="Avg Duration"
              value={summary ? formatDuration(summary.avg_duration) : "0s"}
              change=""
              changeType="neutral"
              icon={Clock}
              loading={summaryLoading}
            />
          </div>

          {/* Main Charts - Success Over Time */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard
              title="Call Success Over Time"
              subtitle="Track call success patterns and trends"
              loading={successLoading}
              className="lg:col-span-2"
            >
              {successOverTime?.daily_success && (
                <CallVolumeChart
                  data={successOverTime.daily_success.map((item) => ({
                    time: item.time,
                    total: item.total_calls,
                    completed: item.successful_calls,
                    failed: item.total_calls - item.successful_calls,
                    no_answer: 0,
                  }))}
                />
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};
