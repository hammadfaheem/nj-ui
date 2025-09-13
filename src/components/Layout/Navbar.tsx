// // import React from 'react';
// // import { Calendar, Download, RefreshCw, Sun, Moon, LogOut, User } from 'lucide-react';
// // import { format } from 'date-fns';
// // import { useDashboardStore } from '../../store/dashboardStore';
// // import { useAuthStore } from '../../store/authStore';

// // export const Navbar: React.FC = () => {
// //   const { dateRange, setDateRange, isLoading, theme, toggleTheme } = useDashboardStore();
// //   const { user, logout } = useAuthStore();

// //   const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
// //     setDateRange({
// //       ...dateRange,
// //       [field]: value,
// //     });
// //   };

// //   const handleLogout = () => {
// //     logout();
// //   };

// //   return (
// //     <div className="lg:pl-72">
// //       <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
// //         <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
// //           <div className="flex items-center gap-x-4 lg:gap-x-6">
// //             <div className="flex items-center space-x-4">
// //               <div className="flex items-center space-x-2">
// //                 <Calendar className="h-5 w-5 text-gray-400" />
// //                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</span>
// //               </div>
// //               <input
// //                 type="date"
// //                 value={dateRange.start_date}
// //                 onChange={(e) => handleDateChange('start_date', e.target.value)}
// //                 className="rounded-md border-0 bg-gray-50 dark:bg-dark-800 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 focus:ring-2 focus:ring-inset focus:ring-brand-red sm:text-sm sm:leading-6"
// //               />
// //               <span className="text-gray-400">to</span>
// //               <input
// //                 type="date"
// //                 value={dateRange.end_date}
// //                 onChange={(e) => handleDateChange('end_date', e.target.value)}
// //                 className="rounded-md border-0 bg-gray-50 dark:bg-dark-800 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 focus:ring-2 focus:ring-inset focus:ring-brand-red sm:text-sm sm:leading-6"
// //               />
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
// //             <button
// //               type="button"
// //               onClick={toggleTheme}
// //               className="flex items-center gap-2 rounded-md bg-gray-50 dark:bg-dark-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
// //             >
// //               {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
// //               {theme === 'dark' ? 'Light' : 'Dark'}
// //             </button>
// //             <button
// //               type="button"
// //               className="flex items-center gap-2 rounded-md bg-gray-50 dark:bg-dark-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
// //               disabled={isLoading}
// //             >
// //               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
// //               Refresh
// //             </button>
// //             <button
// //               type="button"
// //               className="flex items-center gap-2 rounded-md bg-brand-red px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red-secondary transition-colors"
// //             >
// //               <Download className="h-4 w-4" />
// //               Export
// //             </button>

// //             {/* User Menu */}
// //             <div className="flex items-center gap-x-4 lg:gap-x-6 border-l border-gray-200 dark:border-dark-700 pl-4">
// //               <div className="flex items-center gap-x-2">
// //                 <div className="flex items-center gap-x-2">
// //                   <User className="h-5 w-5 text-gray-400" />
// //                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
// //                     {user?.username}
// //                   </span>
// //                 </div>
// //                 <button
// //                   onClick={handleLogout}
// //                   className="flex items-center gap-2 rounded-md bg-gray-50 dark:bg-dark-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
// //                 >
// //                   <LogOut className="h-4 w-4" />
// //                   Logout
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Sun,
//   Moon,
//   Bell,
//   Search,
//   User,
//   LogOut,
//   Settings,
//   Calendar,
//   RefreshCw,
//   Download,
// } from "lucide-react";
// import { useDashboardStore } from "../../store/dashboardStore";
// import { useAuthStore } from "../../store/authStore";

// export const Navbar: React.FC = () => {
//   // ✅ same functionality as your original
//   const { dateRange, setDateRange, isLoading, theme, toggleTheme } =
//     useDashboardStore();
//   const { user, logout } = useAuthStore();

//   // --- date handlers (unchanged logic) ---
//   const handleDateChange = (
//     field: "start_date" | "end_date",
//     value: string
//   ) => {
//     setDateRange({
//       ...dateRange,
//       [field]: value,
//     });
//   };

//   // --- theme-aware logo with fallback chain (no errors if file missing) ---
//   const darkLogos = React.useMemo(
//     () => ["/logo-dark.png", "/logo-icon-d.png"],
//     []
//   );
//   const lightLogos = React.useMemo(
//     () => ["/logo-light.png", "/logo-icon-l.png"],
//     []
//   );
//   const logos = theme === "dark" ? darkLogos : lightLogos;
//   const [logoIndex, setLogoIndex] = React.useState(0);
//   const logoSrc = logos[Math.min(logoIndex, logos.length - 1)];
//   const onLogoError = () =>
//     setLogoIndex((i) => Math.min(i + 1, logos.length - 1));

//   const [showProfileMenu, setShowProfileMenu] = React.useState(false);

//   return (
//     // If you adopted the collapsible sidebar width var, this keeps content aligned.
//     // Otherwise, it falls back to 18rem (w-72) like your old layout.
//     <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//       <div className="px-4 sm:px-6 lg:px-8 lg:pl-[var(--sidebar-width,18rem)]">
//         <div className="flex h-16 items-center justify-between">
//           {/* Left: Logo + Title */}
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-3">
//               <motion.img
//                 key={`${theme}-${logoIndex}`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//                 src={logoSrc}
//                 onError={onLogoError}
//                 alt="Logo"
//                 className="w-28 h-10 rounded-lg object-contain"
//               />
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
//                 Dashboard
//               </h1>
//             </div>

//             {/* Date Range (same functionality, new styling) */}
//             <div className="hidden md:flex items-center space-x-3 ml-6">
//               <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
//                 <Calendar className="h-5 w-5 text-gray-400" />
//                 <span className="text-sm font-medium">Date Range</span>
//               </div>
//               <input
//                 type="date"
//                 value={dateRange.start_date}
//                 onChange={(e) => handleDateChange("start_date", e.target.value)}
//                 className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//               <span className="text-gray-400">to</span>
//               <input
//                 type="date"
//                 value={dateRange.end_date}
//                 onChange={(e) => handleDateChange("end_date", e.target.value)}
//                 className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//             </div>
//           </div>

//           {/* Right: Actions */}
//           <div className="flex items-center space-x-2 sm:space-x-3">
//             {/* Search (visual only) */}
//             <div className="relative hidden md:block">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white w-56"
//               />
//             </div>

//             {/* Notifications (visual) */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
//             >
//               <Bell className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
//             </motion.button>

//             {/* Theme toggle (same store toggle) */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={toggleTheme}
//               className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
//             >
//               {theme === "dark" ? (
//                 <Sun className="w-5 h-5" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </motion.button>

//             {/* Refresh (keeps your isLoading) */}
//             <button
//               type="button"
//               className="hidden sm:inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               disabled={isLoading}
//             >
//               <RefreshCw
//                 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
//               />
//               Refresh
//             </button>

//             {/* Export (same no-op as original; just UI) */}
//             <button
//               type="button"
//               className="hidden sm:inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
//             >
//               <Download className="h-4 w-4" />
//               Export
//             </button>

//             {/* Profile dropdown (logout wired to your store) */}
//             <div className="relative">
//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => setShowProfileMenu((s) => !s)}
//                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <img
//                   src={
//                     (user as any)?.avatar ||
//                     `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
//                   }
//                   alt={(user as any)?.username || "User"}
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium text-gray-900 dark:text-white">
//                     {(user as any)?.username || "User"}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
//                     {(user as any)?.role || "member"}
//                   </p>
//                 </div>
//               </motion.button>

//               {showProfileMenu && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
//                 >
//                   <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <User className="w-4 h-4" />
//                     <span>Profile</span>
//                   </button>
//                   <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <Settings className="w-4 h-4" />
//                     <span>Settings</span>
//                   </button>
//                   <hr className="my-2 border-gray-200 dark:border-gray-600" />
//                   <button
//                     onClick={logout}
//                     className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     <span>Sign Out</span>
//                   </button>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile date range below the bar */}
//         <div className="md:hidden py-3">
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
//               <Calendar className="h-5 w-5 text-gray-400" />
//               <span className="text-sm font-medium">Date Range</span>
//             </div>
//             <input
//               type="date"
//               value={dateRange.start_date}
//               onChange={(e) => handleDateChange("start_date", e.target.value)}
//               className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1.5 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//             <span className="text-gray-400">to</span>
//             <input
//               type="date"
//               value={dateRange.end_date}
//               onChange={(e) => handleDateChange("end_date", e.target.value)}
//               className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1.5 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, Calendar } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../store/authStore";
import { apiService } from "../../services/api";

export const Navbar: React.FC = () => {
  // ✅ same functionality as your original
  const { dateRange, setDateRange, theme, toggleTheme } = useDashboardStore();
  const { logout } = useAuthStore();

  // User profile state
  const [userProfile, setUserProfile] = useState<{
    email: string;
    first_name: string;
    last_name: string;
  } | null>(null);

  // --- date handlers (unchanged logic) ---
  const handleDateChange = (
    field: "start_date" | "end_date",
    value: string
  ) => {
    setDateRange({
      ...dateRange,
      [field]: value,
    });
  };

  // Logo and Dashboard text removed as requested

  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  // Fetch user profile data
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

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Align with sidebar width (falls back to 18rem if CSS var not set) */}
      <div className="px-4 sm:px-6 lg:px-8 lg:pl-[var(--sidebar-width,18rem)]">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Empty space to maintain layout */}
          <div className="flex items-center space-x-4">
            {/* Logo and Dashboard text removed as requested */}
          </div>

          {/* Right: Date Range + Theme + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date Range (same logic, improved design) */}
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Range
              </span>
              <input
                aria-label="Start date"
                type="date"
                value={dateRange.start_date}
                onChange={(e) => handleDateChange("start_date", e.target.value)}
                className="rounded-md bg-transparent border-0 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 px-2 py-1"
              />
              <span className="text-gray-400">—</span>
              <input
                aria-label="End date"
                type="date"
                value={dateRange.end_date}
                onChange={(e) => handleDateChange("end_date", e.target.value)}
                className="rounded-md bg-transparent border-0 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 px-2 py-1"
              />
            </div>

            {/* Theme toggle (same store toggle) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Profile dropdown (logout wired to your store) */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* User Initial Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white font-bold text-lg select-none">
                  {(userProfile?.first_name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userProfile
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Member
                  </p>
                </div>
              </motion.button>

              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white font-bold text-lg">
                        {(userProfile?.first_name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userProfile
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : "Loading..."}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {userProfile?.email || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <hr className="my-2 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile date range below the bar */}
        <div className="md:hidden py-3">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </span>
            <input
              aria-label="Start date"
              type="date"
              value={dateRange.start_date}
              onChange={(e) => handleDateChange("start_date", e.target.value)}
              className="flex-1 min-w-0 rounded-md bg-transparent border-0 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 px-2 py-1"
            />
            <span className="text-gray-400">—</span>
            <input
              aria-label="End date"
              type="date"
              value={dateRange.end_date}
              onChange={(e) => handleDateChange("end_date", e.target.value)}
              className="flex-1 min-w-0 rounded-md bg-transparent border-0 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 px-2 py-1"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
