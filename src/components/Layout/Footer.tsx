import React from "react";
import { motion } from "framer-motion";
import { Heart, Code, Zap } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="lg:pl-[var(--sidebar-width,18rem)]">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span>© {currentYear} NJSoftLab. All rights reserved.</span>
            </motion.div>

            {/* Made with love section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span>Built with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>using</span>
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4 text-blue-500" />
                <span className="font-medium">React</span>
              </div>
              <span>&</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">TypeScript</span>
              </div>
            </motion.div>
          </div>

          {/* Additional info for larger screens */}
          <div className="hidden lg:flex items-center justify-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Call Intelligence Dashboard • Analytics & Performance Monitoring
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
