"use client";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, LogIn, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "@/features/user/UserContext";
import { api } from "@/lib/apiClient";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

export default function AuthForm({ isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/";
  const { setUser } = useUser();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("");
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const allRequirementsMet = password !== "";
  const passwordsMatch = password === confirmPassword && password !== "";

  // Real-time validation
  const validatePasswords = (passVal, confirmVal) => {
    setPasswordError("");

    const currentPass = passVal !== undefined ? passVal : password;
    const currentConfirm = confirmVal !== undefined ? confirmVal : confirmPassword;
    const match = currentPass === currentConfirm && currentPass !== "";

    if (currentConfirm && !match) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleAuth = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!allRequirementsMet) {
        setPasswordError("Please meet all password requirements");
        setLoading(false);
        return;
      }

      if (!passwordsMatch) {
        setConfirmError("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    if (!captchaToken) {
      setError("Please complete captcha");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const data = await api.request("/api/auth", {
          method: "POST",
          body: { email, password, captchaToken, action: "login" },
        });
        if (!data.success) throw new Error(data.message || "Login failed");

        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user || null);
        router.push(redirectTo);
      } else {
        const data = await api.request("/api/auth", {
          method: "POST",
          body: { email, password, captchaToken, action: "signup", name },
        });
        if (!data.success) throw new Error(data.message || "Signup failed");
        toast.success(data.message || "Account created! Please sign in.");
        router.push("/login");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    if (redirectTo && redirectTo !== "/") {
      callbackUrl.searchParams.set("next", redirectTo);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) setError(error.message);
  };

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "Your Cloudfare Captcha Key"
      ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      : "1x00000000000000000000AA";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-udemy-surface dark:bg-udemy-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-udemy-dark-surface rounded-xl shadow-lg overflow-hidden border border-udemy-border dark:border-udemy-dark-border"
      >
        {/* Header */}
        <div className="bg-udemy-purple p-6 text-white">
          <div className="mb-4 text-white hover:text-white/80 hover:-translate-x-1 transition cursor-pointer">
            <Link href="/">← Back To Home</Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              {isLogin ? "Sign in to access Arena" : "Join us to get started"}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center p-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-udemy-border dark:border-udemy-dark-border bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text font-medium hover:bg-udemy-surface dark:hover:bg-udemy-dark-bg duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/google.webp"
              width={24}
              height={24}
              alt=""
              aria-hidden="true"
            />
            <span className="mx-2">Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center px-6">
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
          <span className="flex-shrink mx-4 text-udemy-muted dark:text-udemy-dark-muted">
            or
          </span>
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id="error-message"
              role="alert"
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleAuth} noValidate className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 w-10 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <input
                  type="email"
                  aria-label="Email address"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                aria-label="Password"
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  validatePasswords(val, confirmPassword);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            {!isLogin && passwordError && (
              <div className="text-sm space-y-1 pl-1">
                <p className="text-red-600 dark:text-red-400 mt-1">
                  {passwordError}
                </p>
              </div>
            )}

            {/* Confirm Password - Only for Signup */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  aria-label="Confirm Password"
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmPassword(val);
                    validatePasswords(password, val);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {confirmError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {confirmError}
                  </p>
                )}
              </div>
            )}

            {/* Turnstile */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={(token) => setCaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !captchaToken ||
                (email && emailError) ||
                (!isLogin && !allRequirementsMet) ||
                (!isLogin && !passwordsMatch)
              }
              className={`w-full flex items-center justify-center py-3 px-4 rounded text-white font-bold transition-all ${
                loading ||
                !captchaToken ||
                (email && emailError) ||
                (!isLogin && !allRequirementsMet) ||
                (!isLogin && !passwordsMatch)
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={18} className="mr-2" /> Continue
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" /> Create Account
                </>
              )}
            </button>
          </form>

          {/* Switch forms */}
          <div className="text-center text-sm text-udemy-muted dark:text-udemy-dark-muted">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>

          <div className="text-center text-xs text-udemy-muted dark:text-udemy-dark-muted mt-6">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
