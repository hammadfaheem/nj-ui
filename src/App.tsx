import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Layout/Sidebar";
import { Navbar } from "./components/Layout/Navbar";
import { Footer } from "./components/Layout/Footer";
import { LoginForm } from "./components/Auth/LoginForm";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Dashboard } from "./pages/Dashboard";
import { CallLogs } from "./pages/CallLogs";
import { CostAnalysis } from "./pages/CostAnalysis";
import { Performance } from "./pages/Performance";
import { Metrics } from "./pages/Metrics";
import { Duration } from "./pages/Duration";
import { Monitoring } from "./pages/Monitoring";
import { SellAnalytics } from "./pages/SellAnalytics";
import { ImageGeneration } from "./pages/ImageGeneration";
import AssistantPage from "./pages/Assistant";
import { Compaigns } from "./pages/Compaigns";
import { Leads } from "./pages/Leads";
import { Keys } from "./pages/Keys";
import { useDashboardStore } from "./store/dashboardStore";
import { useAuthStore } from "./store/authStore";
import { Signup } from "./components/Auth/Signup";
import { ForgotPassword } from "./components/Auth/ForgotPassword";
import { ResetPassword } from "./components/Auth/ResetPassword";
import Files from "./pages/Files";

function App() {
  const { theme } = useDashboardStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.documentElement.className = theme;
    
    // Set CSS custom properties for theme colors
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--color-background', '3 7 18');
      root.style.setProperty('--color-surface', '15 23 42');
      root.style.setProperty('--color-text', '248 250 252');
    } else {
      root.style.setProperty('--color-background', '255 255 255');
      root.style.setProperty('--color-surface', '249 250 251');
      root.style.setProperty('--color-text', '17 24 39');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
            }
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
            }
          />
          <Route
            path="/reset-password"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />
            }
          />          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex flex-col min-h-screen">
                    <Sidebar />
                    <Navbar />                    <main className="flex-1 transition-all duration-200 ease-in-out">
                      <div className="animate-fade-in">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/logs" element={<CallLogs />} />
                          <Route path="/cost" element={<CostAnalysis />} />
                          <Route path="/performance" element={<Performance />} />
                          <Route path="/metrics" element={<Metrics />} />
                          <Route path="/duration" element={<Duration />} />
                          <Route path="/monitoring" element={<Monitoring />} />
                          <Route
                            path="/sell-analytics"
                            element={<SellAnalytics />}
                          />
                          <Route
                            path="/image-generation"
                            element={<ImageGeneration />}
                          />
                          <Route path="/assistant" element={<AssistantPage />} />
                          <Route path="/files" element={<Files />} />
                          <Route path="/compaigns" element={<Compaigns />} />
                          <Route path="/leads" element={<Leads />} />
                          <Route path="/keys" element={<Keys />} />
                        </Routes>
                      </div>
                    </main><Footer />
                </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
