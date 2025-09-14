import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Activity,
  Clock,
  Monitor,
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
  Key,
  Bot,
  Image,
  PieChart,
  X,
} from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

// ✅ Same routes & icons (functionality preserved)
// const navigation = [
//   { name: "Overview", href: "/", icon: BarChart3 },
//   { name: "Call Analytics", href: "/logs", icon: PieChart },
//   { name: "Cost Analytics", href: "/cost", icon: DollarSign },
//   { name: "Performance", href: "/performance", icon: Activity },
//   { name: "Sell Analytics", href: "/sell-analytics", icon: DollarSign },
//   { name: "Image Generation", href: "/image-generation", icon: Image },
//   { name: "Assistant", href: "/assistant", icon: Bot },
//   { name: "Files", href: "/files", icon: FileText },
//   { name: "Compaigns", href: "/compaigns", icon: BarChart3 },
//   { name: "Duration", href: "/duration", icon: Clock },
//   { name: "Monitoring", href: "/monitoring", icon: Monitor },
//   { name: "Leads", href: "/leads", icon: Users },
//   { name: "Keys", href: "/keys", icon: Key },
// ];
const topNavigation = [{ name: "Overview", href: "/", icon: BarChart3 }];

const navigation = [
  {
    label: "Build",
    items: [
      { name: "Assistant", href: "/assistant", icon: Bot },
      { name: "Image Generation", href: "/image-generation", icon: Image },
      { name: "Files", href: "/files", icon: FileText },
      { name: "Compaigns", href: "/compaigns", icon: BarChart3 },
      { name: "Keys", href: "/keys", icon: Key },
    ],
  },
  {
    label: "Observe",
    items: [
      { name: "Metrics", href: "/metrics", icon: BarChart3 },
      { name: "Call Analytics", href: "/logs", icon: PieChart },
      { name: "Cost Analytics", href: "/cost", icon: DollarSign },
      { name: "Performance", href: "/performance", icon: Activity },
      { name: "Duration", href: "/duration", icon: Clock },
      { name: "Monitoring", href: "/monitoring", icon: Monitor },
      { name: "Leads", href: "/leads", icon: Users },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  // --- THEME-AWARE LOGO (updates live when `dark` class toggles) ---
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  // You can rename these files; the array order provides fallbacks.
  const darkLogos = useMemo(() => ["/logo-icon-d.png", "/logo-dark.png"], []);
  const lightLogos = useMemo(() => ["/logo-icon-l.png", "/logo-light.png"], []);

  const [logoIndex, setLogoIndex] = useState(0);
  const logos = isDark ? darkLogos : lightLogos;
  const logoSrc = logos[Math.min(logoIndex, logos.length - 1)];

  // Observe <html class="dark"> changes so the logo updates instantly
  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const el = document.documentElement;

    const update = () => {
      setIsDark(el.classList.contains("dark"));
      setLogoIndex(0); // reset to first preferred logo on theme change
    };

    update();
    const obs = new MutationObserver((m) => {
      for (const r of m) {
        if (r.type === "attributes" && r.attributeName === "class") update();
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Step through fallbacks if a logo path 404s
  const onLogoError = () =>
    setLogoIndex((i) => Math.min(i + 1, logos.length - 1));

  // --- COLLAPSE WIDTH (animated) ---
  // 64px collapsed (4rem), 240px expanded (15rem) for better space utilization
  const collapsedPx = 64;
  const expandedPx = 240;

  // Expose current width as a CSS var (optional: helps main content align)
  useEffect(() => {
    const w = isCollapsed ? `${collapsedPx}px` : `${expandedPx}px`;
    document.documentElement.style.setProperty("--sidebar-width", w);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [isCollapsed]);
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <motion.img
                  key={`${logoSrc}-mobile`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  src={logoSrc}
                  onError={onLogoError}
                  alt="Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    njx calling
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Call Intelligence
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-3" role="navigation" aria-label="Main navigation">
              {/* Top Navigation - Overview */}
              <ul role="list" className="space-y-1 mb-6">
                {topNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow"
                              : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                          }`
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Sectioned Navigation */}
              {navigation.map((section) => (
                <div key={section.label} className="mb-6">
                  <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {section.label}
                  </p>
                  <ul role="list" className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                              `group relative flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow"
                                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                              }`
                            }
                          >
                            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{item.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: isCollapsed ? collapsedPx : expandedPx,
        }}
        transition={{ duration: 0.25 }}
        className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 flex-col h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        style={{ width: isCollapsed ? collapsedPx : expandedPx }}
        role="navigation"
        aria-label="Main navigation"
      >
      {/* Collapse / Expand toggle */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsCollapsed((v) => !v)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </motion.button>

      {/* Header / Logo */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <motion.img
            key={`${logoSrc}-${isCollapsed}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            src={logoSrc}
            onError={onLogoError}
            alt="Logo"
            className={
              isCollapsed
                ? "w-8 h-8 rounded-full object-cover"
                : "w-8 h-8 rounded-lg object-cover"
            }
          />

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="truncate"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Call Intelligence
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
        {/* Top Navigation - Overview */}
        <ul role="list" className="space-y-1 mb-6">
          {topNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group relative flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isCollapsed ? "justify-center" : "gap-x-2"
                    } ${
                      isActive
                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full ml-2 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-700 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Sectioned Navigation */}
        {navigation.map((section) => (
          <div key={section.label} className="mb-6">
            {/* Section heading */}
            {!isCollapsed && (
              <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {section.label}
              </p>
            )}

            <ul role="list" className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group relative flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 ${
                          isCollapsed ? "justify-center" : "gap-x-2"
                        } ${
                          isActive
                            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                        }`
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                          className="truncate"
                        >
                          {item.name}
                        </motion.span>
                      )}

                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full ml-2 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-700 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>        ))}
      </nav>

      {/* Navigation */}
    </motion.aside>
  </>
);
};
