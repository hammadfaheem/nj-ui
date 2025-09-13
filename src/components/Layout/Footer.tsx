import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-auto">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          © Copyright Reserved. Powered by NJSoftLab
        </div>
      </div>
    </footer>
  );
};
