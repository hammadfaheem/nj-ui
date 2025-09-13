import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm as Login } from "./Auth/LoginForm";
import { Signup } from "./Auth/Signup";
import { ForgotPassword } from "./Auth/ForgotPassword";

type AuthView = "login" | "signup" | "forgot-password";

export const AuthFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  const renderAuthComponent = () => {
    switch (currentView) {
      case "login":
        return (
          <Login
            onSwitchToSignup={() => setCurrentView("signup")}
            onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
          />
        );
      case "signup":
        return <Signup onSwitchToLogin={() => setCurrentView("login")} />;
      case "forgot-password":
        return (
          <ForgotPassword onSwitchToLogin={() => setCurrentView("login")} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-red-900 dark:from-gray-900 dark:via-slate-900 dark:to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Circuit Board Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 10h80v80h-80z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <circle cx="80" cy="20" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path
                d="M20 20h60M20 80h60M20 20v60M80 20v60"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#circuit)"
            className="text-white"
          />
        </svg>
      </div>

      {/* Floating Call Center Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Phone Call Waves */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-400 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-16 left-16 w-40 h-40 border-2 border-blue-300 rounded-full"
        />

        {/* AI Brain Network */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-48 h-48 opacity-20"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-green-400">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            {/* Neural connections */}
            <path
              d="M100 20 L100 180 M20 100 L180 100 M45 45 L155 155 M155 45 L45 155"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="100" cy="20" r="3" fill="currentColor" />
            <circle cx="100" cy="180" r="3" fill="currentColor" />
            <circle cx="20" cy="100" r="3" fill="currentColor" />
            <circle cx="180" cy="100" r="3" fill="currentColor" />
            <circle cx="45" cy="45" r="3" fill="currentColor" />
            <circle cx="155" cy="155" r="3" fill="currentColor" />
            <circle cx="155" cy="45" r="3" fill="currentColor" />
            <circle cx="45" cy="155" r="3" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Chat Bubbles */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 text-purple-400 opacity-30"
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [10, -10, 10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/3 left-1/2 text-blue-400 opacity-25"
        >
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        {/* Analytics Charts */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-20 text-yellow-400 opacity-20"
        >
          <svg
            className="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </motion.div>

        {/* Phone Icons */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-32 text-red-400 opacity-25"
        >
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </motion.div>

        {/* Microphone with Sound Waves */}
        <motion.div
          className="absolute bottom-32 right-1/4"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative text-green-400 opacity-30">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
            {/* Sound waves */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute -top-2 -left-2 w-16 h-16 border border-current rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="absolute -top-4 -left-4 w-20 h-20 border border-current rounded-full"
            />
          </div>
        </motion.div>

        {/* Data Flow Lines */}
        <motion.div
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 opacity-10"
        >
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <motion.path
              d="M100 100 Q500 300 900 100 Q500 700 100 900"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Floating Numbers (representing call metrics) */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/3 text-cyan-400 opacity-20 font-mono text-sm"
        >
          <div>99.9% Uptime</div>
          <div>1.2s Avg Response</div>
          <div>24/7 Active</div>
        </motion.div>
      </div>

      {/* Glowing Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {renderAuthComponent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
