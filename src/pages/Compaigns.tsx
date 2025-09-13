import React from "react";

const dummyCampaigns = [
  { name: "Summer Sale", status: "Active", leads: 120 },
  { name: "Winter Promo", status: "Paused", leads: 80 },
  { name: "New Product Launch", status: "Draft", leads: 0 },
];

export const Compaigns: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
      <div className="max-w-xl w-full bg-gray-50 dark:bg-dark-800 rounded-xl p-8 border border-gray-200 dark:border-dark-700 shadow">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Compaigns
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is a placeholder for Compaigns. You can update this page with
          your campaign management features.
        </p>
        <div className="space-y-4">
          {dummyCampaigns.map((c) => (
            <div
              key={c.name}
              className="flex justify-between items-center bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {c.name}
              </span>
              <span
                className={
                  c.status === "Active"
                    ? "text-green-500"
                    : c.status === "Paused"
                    ? "text-yellow-500"
                    : "text-gray-400"
                }
              >
                {c.status}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Leads: {c.leads}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
