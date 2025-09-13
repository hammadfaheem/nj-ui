import React from "react";

const dummyData = [
  { title: "Total Sales", value: "$12,500", change: "+8%", status: "positive" },
  {
    title: "Conversion Rate",
    value: "4.2%",
    change: "+0.5%",
    status: "positive",
  },
  { title: "Active Leads", value: "320", change: "-12", status: "negative" },
];

export const SellAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
      <div className="max-w-xl w-full bg-gray-50 dark:bg-dark-800 rounded-xl p-8 border border-gray-200 dark:border-dark-700 shadow">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Sell Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is a placeholder for Sell Analytics. You can update this page
          with your analytics content.
        </p>
        <div className="space-y-4">
          {dummyData.map((item) => (
            <div
              key={item.title}
              className="flex justify-between items-center bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {item.title}
              </span>
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {item.value}
              </span>
              <span
                className={
                  item.status === "positive" ? "text-green-500" : "text-red-500"
                }
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
