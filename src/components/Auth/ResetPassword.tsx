import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";

interface ResetPasswordProps {
  /** Optional: if provided, used instead of navigate('/login') */
  onSwitchToLogin?: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  onSwitchToLogin,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // --- theme-aware logo with fallbacks ---
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const darkLogos = ["/logo-icon-d.png", "/logo-dark.png"];
  const lightLogos = ["/logo-icon-l.png", "/logo-light.png"];
  const logos = isDark ? darkLogos : lightLogos;
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSrc = logos[Math.min(logoIndex, logos.length - 1)];
  const onLogoError = () =>
    setLogoIndex((i) => Math.min(i + 1, logos.length - 1));

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const el = document.documentElement;
    const update = () => {
      const darkNow = el.classList.contains("dark");
      setIsDark(darkNow);
      setLogoIndex(0);
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

  // --- local UI state ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const goLogin = () =>
    onSwitchToLogin ? onSwitchToLogin() : navigate("/login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset token");
      return;
    }
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await import("../../services/authService").then((m) =>
        m.authService.resetPassword({
          token,
          new_password: newPassword,
          reenter_password: confirmPassword,
        })
      );
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-gray-900 dark:to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-white/80 backdrop-blur-xl dark:bg-gray-800/20 dark:backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-white/20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The reset link is invalid or has expired.
          </p>
          <Button onClick={goLogin}>Back to Login</Button>
        </div>
      </div>
    );
  }

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
              id="circuit-reset"
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
            fill="url(#circuit-reset)"
            className="text-gray-700 dark:text-white"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl dark:bg-gray-800/20 dark:backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-white/20">
            {isSuccess ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100/80 dark:bg-green-900/30 backdrop-blur-sm rounded-full mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your password has been successfully reset.
                </p>
                <Button onClick={goLogin} className="w-full">
                  Back to Login
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-4"
                  >
                    <motion.img
                      key={`${isDark}-${logoIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      src={logoSrc}
                      onError={onLogoError}
                      alt="Logo"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Reset Password
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter your new password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      label="New Password"
                      placeholder="Enter new password"
                      className="pl-12 pr-12 bg-gray-50/50 dark:bg-white/10 backdrop-blur-sm border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={error}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      className="pl-12 pr-12 bg-gray-50/50 dark:bg-white/10 backdrop-blur-sm border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Reset Password
                  </Button>
                </form>

                <div className="mt-6">
                  <button
                    onClick={goLogin}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
