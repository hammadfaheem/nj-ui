// // import React, { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
// // import { useAuthStore } from "../../store/authStore";
// // import { useNavigate } from "react-router-dom";
// // // ⬇️ Adjust these paths if your components live elsewhere
// // import { Button } from "../UI/Button";
// // import { Input } from "../UI/Input";

// // /**
// //  * LoginForm
// //  * - Keeps EXACT functionality (auth store + navigate on success)
// //  * - Uses your <Button/> and <Input/>
// //  * - Dark/Light logo support: /logo-light.png and /logo-dark.png with safe fallback
// //  */
// // export const LoginForm: React.FC = () => {
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);

// //   const { login, isLoading, error, clearError } = useAuthStore();
// //   const navigate = useNavigate();

// //   // ---- Logo handling (light/dark with fallback to your existing jpg) ----
// //   const prefersDark =
// //     typeof document !== "undefined" &&
// //     document.documentElement.classList.contains("dark");
// //   const [logoSrc, setLogoSrc] = useState(
// //     prefersDark ? "/logo-dark.png" : "/logo-light.png"
// //   );
// //   useEffect(() => {
// //     // If your app toggles the 'dark' class dynamically, this will update on mount.
// //     const isDark = document.documentElement.classList.contains("dark");
// //     setLogoSrc(isDark ? "/logo-icon-d.png" : "/logo-icon-l.png");
// //   }, []);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       clearError?.();
// //       await login({ username, password });
// //       navigate("/");
// //     } catch {
// //       // Error is surfaced via store's `error`
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="w-full max-w-md mx-auto"
// //       >
// //         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
// //           <div className="text-center mb-8">
// //             <motion.div
// //               initial={{ scale: 0 }}
// //               animate={{ scale: 1 }}
// //               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
// //               className="inline-flex items-center justify-center w-16 h-16 mb-4"
// //             >
// //               {/* Prefer themed logos; fallback to your existing asset if missing */}
// //               <motion.img
// //                 key={logoSrc}
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 transition={{ duration: 0.3 }}
// //                 src={logoSrc}
// //                 onError={(e) => {
// //                   (e.currentTarget as HTMLImageElement).src =
// //                     "/8d6191e4-dab0-4eb5-a03f-ee3e416ccec9.jpg";
// //                 }}
// //                 alt="Logo"
// //                 className="w-16 h-16 rounded-full object-cover"
// //               />
// //             </motion.div>
// //             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
// //               Welcome Back
// //             </h2>
// //             <p className="text-gray-600 dark:text-gray-400">
// //               Sign in to your account
// //             </p>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             <div className="relative">
// //               <Mail className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
// //               <Input
// //                 id="username"
// //                 name="username"
// //                 label="Username"
// //                 placeholder="Enter your username"
// //                 className="pl-12"
// //                 value={username}
// //                 onChange={(e) => setUsername(e.target.value)}
// //                 required
// //               />
// //             </div>

// //             <div className="relative">
// //               <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
// //               <Input
// //                 id="password"
// //                 name="password"
// //                 type={showPassword ? "text" : "password"}
// //                 label="Password"
// //                 placeholder="Enter your password"
// //                 className="pl-12 pr-12"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 required
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
// //                 aria-label={showPassword ? "Hide password" : "Show password"}
// //               >
// //                 {showPassword ? (
// //                   <EyeOff className="w-5 h-5" />
// //                 ) : (
// //                   <Eye className="w-5 h-5" />
// //                 )}
// //               </button>
// //             </div>

// //             {error && (
// //               <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
// //                 <div className="flex">
// //                   <div className="flex-shrink-0">
// //                     <AlertCircle className="h-5 w-5 text-red-400" />
// //                   </div>
// //                   <div className="ml-3">
// //                     <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
// //                       Authentication Error
// //                     </h3>
// //                     <div className="mt-2 text-sm text-red-700 dark:text-red-300">
// //                       {error}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="flex items-center justify-between">
// //               <label className="flex items-center select-none">
// //                 <input
// //                   type="checkbox"
// //                   className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
// //                 />
// //                 <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
// //                   Remember me
// //                 </span>
// //               </label>
// //               <button
// //                 type="button"
// //                 onClick={() => navigate("/forgot-password")}
// //                 className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
// //               >
// //                 Forgot password?
// //               </button>
// //             </div>

// //             <Button type="submit" className="w-full" isLoading={isLoading}>
// //               Sign In
// //             </Button>
// //           </form>

// //           <div className="mt-6 text-center">
// //             <p className="text-sm text-gray-600 dark:text-gray-400">
// //               Don&apos;t have an account?{" "}
// //               <button
// //                 onClick={() => navigate("/signup")}
// //                 className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
// //               >
// //                 Sign up
// //               </button>
// //             </p>
// //           </div>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
// import { useAuthStore } from "../../store/authStore";
// import { useNavigate } from "react-router-dom";
// // ⬇️ Adjust these paths if your components live elsewhere
// import { Button } from "../UI/Button";
// import { Input } from "../UI/Input";

// /**
//  * LoginForm with Enhanced Call Center Background
//  * - Keeps EXACT functionality (auth store + navigate on success)
//  * - Uses your <Button/> and <Input/>
//  * - Dark/Light logo support with animated call center background
//  */
// export const LoginForm: React.FC = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const { login, isLoading, error, clearError } = useAuthStore();
//   const navigate = useNavigate();

//   // ---- Logo handling (light/dark with fallback to your existing jpg) ----
//   const prefersDark =
//     typeof document !== "undefined" &&
//     document.documentElement.classList.contains("dark");
//   const [logoSrc, setLogoSrc] = useState(
//     prefersDark ? "/logo-dark.png" : "/logo-light.png"
//   );
//   useEffect(() => {
//     // If your app toggles the 'dark' class dynamically, this will update on mount.
//     const isDark = document.documentElement.classList.contains("dark");
//     setLogoSrc(isDark ? "/logo-icon-d.png" : "/logo-icon-l.png");
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       clearError?.();
//       await login({ username, password });
//       navigate("/");
//     } catch {
//       // Error is surfaced via store's `error`
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-red-900 dark:from-gray-900 dark:via-slate-900 dark:to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated Circuit Board Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <svg
//           className="w-full h-full"
//           viewBox="0 0 1000 1000"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <defs>
//             <pattern
//               id="circuit"
//               x="0"
//               y="0"
//               width="100"
//               height="100"
//               patternUnits="userSpaceOnUse"
//             >
//               <path
//                 d="M10 10h80v80h-80z"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="0.5"
//               />
//               <circle cx="20" cy="20" r="2" fill="currentColor" />
//               <circle cx="80" cy="20" r="2" fill="currentColor" />
//               <circle cx="20" cy="80" r="2" fill="currentColor" />
//               <circle cx="80" cy="80" r="2" fill="currentColor" />
//               <path
//                 d="M20 20h60M20 80h60M20 20v60M80 20v60"
//                 stroke="currentColor"
//                 strokeWidth="0.5"
//               />
//             </pattern>
//           </defs>
//           <rect
//             width="100%"
//             height="100%"
//             fill="url(#circuit)"
//             className="text-white"
//           />
//         </svg>
//       </div>

//       {/* Floating Call Center Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Phone Call Waves */}
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-400 rounded-full"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.4, 1],
//             opacity: [0.2, 0.4, 0.2],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 0.5,
//           }}
//           className="absolute top-16 left-16 w-40 h-40 border-2 border-blue-300 rounded-full"
//         />

//         {/* AI Brain Network */}
//         <motion.div
//           animate={{
//             rotate: [0, 360],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="absolute top-1/4 right-1/4 w-48 h-48 opacity-20"
//         >
//           <svg viewBox="0 0 200 200" className="w-full h-full text-green-400">
//             <circle
//               cx="100"
//               cy="100"
//               r="80"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1"
//             />
//             <circle
//               cx="100"
//               cy="100"
//               r="60"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1"
//             />
//             <circle
//               cx="100"
//               cy="100"
//               r="40"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1"
//             />
//             <circle
//               cx="100"
//               cy="100"
//               r="20"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1"
//             />
//             {/* Neural connections */}
//             <path
//               d="M100 20 L100 180 M20 100 L180 100 M45 45 L155 155 M155 45 L45 155"
//               stroke="currentColor"
//               strokeWidth="0.5"
//             />
//             <circle cx="100" cy="20" r="3" fill="currentColor" />
//             <circle cx="100" cy="180" r="3" fill="currentColor" />
//             <circle cx="20" cy="100" r="3" fill="currentColor" />
//             <circle cx="180" cy="100" r="3" fill="currentColor" />
//             <circle cx="45" cy="45" r="3" fill="currentColor" />
//             <circle cx="155" cy="155" r="3" fill="currentColor" />
//             <circle cx="155" cy="45" r="3" fill="currentColor" />
//             <circle cx="45" cy="155" r="3" fill="currentColor" />
//           </svg>
//         </motion.div>

//         {/* Chat Bubbles */}
//         <motion.div
//           animate={{
//             y: [-10, 10, -10],
//             opacity: [0.4, 0.8, 0.4],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute bottom-1/4 left-1/4 text-purple-400 opacity-30"
//         >
//           <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </motion.div>

//         <motion.div
//           animate={{
//             y: [10, -10, 10],
//             opacity: [0.3, 0.7, 0.3],
//           }}
//           transition={{
//             duration: 3.5,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 1,
//           }}
//           className="absolute bottom-1/3 left-1/2 text-blue-400 opacity-25"
//         >
//           <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </motion.div>

//         {/* Analytics Charts */}
//         <motion.div
//           animate={{
//             scale: [1, 1.1, 1],
//             opacity: [0.2, 0.5, 0.2],
//           }}
//           transition={{
//             duration: 5,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-1/2 right-20 text-yellow-400 opacity-20"
//         >
//           <svg
//             className="w-20 h-20"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1}
//               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//             />
//           </svg>
//         </motion.div>

//         {/* Phone Icons */}
//         <motion.div
//           animate={{
//             rotate: [0, 5, -5, 0],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{
//             duration: 6,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-40 right-32 text-red-400 opacity-25"
//         >
//           <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//           </svg>
//         </motion.div>

//         {/* Microphone with Sound Waves */}
//         <motion.div
//           className="absolute bottom-32 right-1/4"
//           animate={{
//             scale: [1, 1.05, 1],
//           }}
//           transition={{
//             duration: 2,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         >
//           <div className="relative text-green-400 opacity-30">
//             <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {/* Sound waves */}
//             <motion.div
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.5, 0, 0.5],
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 ease: "easeOut",
//               }}
//               className="absolute -top-2 -left-2 w-16 h-16 border border-current rounded-full"
//             />
//             <motion.div
//               animate={{
//                 scale: [1, 2, 1],
//                 opacity: [0.3, 0, 0.3],
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 ease: "easeOut",
//                 delay: 0.3,
//               }}
//               className="absolute -top-4 -left-4 w-20 h-20 border border-current rounded-full"
//             />
//           </div>
//         </motion.div>

//         {/* Data Flow Lines */}
//         <motion.div
//           animate={{
//             pathLength: [0, 1, 0],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute inset-0 opacity-10"
//         >
//           <svg className="w-full h-full" viewBox="0 0 1000 1000">
//             <motion.path
//               d="M100 100 Q500 300 900 100 Q500 700 100 900"
//               fill="none"
//               stroke="url(#gradient)"
//               strokeWidth="2"
//               strokeDasharray="10,5"
//             />
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
//                 <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
//                 <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </motion.div>

//         {/* Floating Numbers (representing call metrics) */}
//         <motion.div
//           animate={{
//             y: [-20, 20, -20],
//             opacity: [0.2, 0.4, 0.2],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-1/3 left-1/3 text-cyan-400 opacity-20 font-mono text-sm"
//         >
//           <div>99.9% Uptime</div>
//           <div>1.2s Avg Response</div>
//           <div>24/7 Active</div>
//         </motion.div>
//       </div>

//       {/* Glowing Background Orbs */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Login Form */}
//       <div className="relative z-10 w-full max-w-md">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md mx-auto"
//         >
//           <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30">
//             <div className="text-center mb-8">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                 className="inline-flex items-center justify-center w-16 h-16 mb-4"
//               >
//                 {/* Prefer themed logos; fallback to your existing asset if missing */}
//                 <motion.img
//                   key={logoSrc}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                   src={logoSrc}
//                   onError={(e) => {
//                     (e.currentTarget as HTMLImageElement).src =
//                       "/8d6191e4-dab0-4eb5-a03f-ee3e416ccec9.jpg";
//                   }}
//                   alt="Logo"
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//               </motion.div>
//               <h2 className="text-3xl font-bold text-white mb-2">
//                 Welcome Back
//               </h2>
//               <p className="text-gray-300">Sign in to your account</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
//                 <Input
//                   id="username"
//                   name="username"
//                   label="Username"
//                   placeholder="Enter your username"
//                   className="pl-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   label="Password"
//                   placeholder="Enter your password"
//                   className="pl-12 pr-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="rounded-md bg-red-500/20 backdrop-blur-sm p-4 border border-red-500/30"
//                 >
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <AlertCircle className="h-5 w-5 text-red-400" />
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-300">
//                         Authentication Error
//                       </h3>
//                       <div className="mt-2 text-sm text-red-200">{error}</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center select-none">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded bg-white/10"
//                   />
//                   <span className="ml-2 text-sm text-gray-300">
//                     Remember me
//                   </span>
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => navigate("/forgot-password")}
//                   className="text-sm text-red-400 hover:text-red-300"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-red-600 hover:bg-red-700 text-white"
//                 isLoading={isLoading}
//               >
//                 Sign In
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-300">
//                 Don&apos;t have an account?{" "}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-red-400 hover:text-red-300 font-medium"
//                 >
//                   Sign up
//                 </button>
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
// ⬇️ Adjust these paths if your components live elsewhere
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";

/**
 * LoginForm with Enhanced Call Center Background
 * - Keeps EXACT functionality (auth store + navigate on success)
 * - Uses your <Button/> and <Input/>
 * - Dark/Light logo support with animated call center background
 */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ---- Logo handling (light/dark with fallback to your existing jpg) ----
  const prefersDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const [logoSrc, setLogoSrc] = useState(
    prefersDark ? "/logo-dark.png" : "/logo-light.png"
  );
  useEffect(() => {
    // If your app toggles the 'dark' class dynamically, this will update on mount.
    const isDark = document.documentElement.classList.contains("dark");
    setLogoSrc(isDark ? "/logo-icon-d.png" : "/logo-icon-l.png");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Call backend login API with all required fields
      const result = await import("../../services/authService").then((m) =>
        m.authService.login({
          email,
          password,
          keep_logged_in: keepLoggedIn,
          recaptcha_token: "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe", // Test reCAPTCHA token
        })
      );
      // Save token (if returned)
      if (result.token) {
        import("../../services/authService").then((m) => {
          m.authService.setToken(result.token);
        });
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-gray-900 dark:to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
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
            className="text-gray-700 dark:text-white"
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
          className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-400 dark:border-blue-400 rounded-full"
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
          className="absolute top-16 left-16 w-40 h-40 border-2 border-blue-300 dark:border-blue-300 rounded-full"
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
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-green-500 dark:text-green-400"
          >
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
          <div className="relative text-green-500 dark:text-green-400 opacity-30">
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl dark:bg-gray-800/20 dark:backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-white/20">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4"
              >
                {/* Prefer themed logos; fallback to your existing asset if missing */}
                <motion.img
                  key={logoSrc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={logoSrc}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/8d6191e4-dab0-4eb5-a03f-ee3e416ccec9.jpg";
                  }}
                  alt="Logo"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  className="pl-12 bg-gray-50/50 dark:bg-white/10 backdrop-blur-sm border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  className="pl-12 pr-12 bg-gray-50/50 dark:bg-white/10 backdrop-blur-sm border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-red-50 dark:bg-red-500/20 backdrop-blur-sm p-4 border border-red-200 dark:border-red-500/30"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Authentication Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                        {error}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center select-none">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded bg-white dark:bg-white/10"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
