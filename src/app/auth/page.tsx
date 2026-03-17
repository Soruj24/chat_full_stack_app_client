"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, MessageCircle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [info, setInfo] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isOtpStep || !otpExpiresAt) return;
    const tick = setInterval(() => {
      const left = Math.max(otpExpiresAt - Date.now(), 0);
      setTimeLeftMs(left);
      if (left <= 0) {
        clearInterval(tick);
      }
    }, 500);
    return () => clearInterval(tick);
  }, [isOtpStep, otpExpiresAt]);

  useEffect(() => {
    if (token) {
      let redirectTo: string | null = null;
      try {
        redirectTo =
          searchParams.get("redirect") ||
          (typeof window !== "undefined"
            ? sessionStorage.getItem("postLoginRedirect")
            : null);
      } catch {}
      if (redirectTo && redirectTo !== "/auth") {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postLoginRedirect");
          }
        } catch {}
        router.replace(redirectTo);
      } else {
        router.replace("/");
      }
    }
  }, [token, router, searchParams]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      let redirectTo: string | null = null;
      try {
        redirectTo =
          searchParams.get("redirect") ||
          (typeof window !== "undefined"
            ? sessionStorage.getItem("postLoginRedirect")
            : null);
      } catch {}
      if (redirectTo && redirectTo !== "/auth") {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postLoginRedirect");
          }
        } catch {}
        router.replace(redirectTo);
      } else {
        router.replace("/");
      }
      return;
    }
    dispatch(loginStart());

    try {
      if (isOtpStep) {
        const verifyRes = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: otpCode }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.message || "Verification failed");
        }
        setInfo("Email verified. Please login.");
        setIsOtpStep(false);
        setIsLogin(true);
        dispatch(loginFailure(""));
        return;
      }
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email, password } : { name, email, password, username };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || "Something went wrong";
        if (isLogin && msg.toLowerCase().includes("not active")) {
          setInfo("Account not active. Please verify your email.");
        }
        throw new Error(msg);
      }

      if (!isLogin && (data.payload?.requiresVerification || data.requiresVerification)) {
        setIsOtpStep(true);
        setInfo("Enter the 6-digit code sent to your email.");
        setOtpExpiresAt(Date.now() + 60_000);
        setTimeLeftMs(60_000);
        dispatch(loginFailure(""));
        return;
      }
      const user = data.payload?.user || data.user;
      const avatarField = (user as { avatar?: string | { url?: string } }).avatar;
      const normalizedUser = {
        ...user,
        id: user?.id || user?._id,
        avatar: typeof avatarField === "string" ? avatarField : avatarField?.url || "",
      };
      const token =
        data.payload?.accessToken ||
        data.payload?.user?.accessToken ||
        data.token;

      dispatch(loginSuccess({ user: normalizedUser, token }));
      let redirectTo: string | null = null;
      try {
        redirectTo =
          searchParams.get("redirect") ||
          (typeof window !== "undefined"
            ? sessionStorage.getItem("postLoginRedirect")
            : null);
      } catch {}
      if (redirectTo && redirectTo !== "/auth") {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("postLoginRedirect");
          }
        } catch {}
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch(loginFailure(err.message));
      } else {
        dispatch(loginFailure("Unknown error"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">
            {isOtpStep ? "Verify Email" : isLogin ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
            {isOtpStep ? "Enter the 6-digit code sent to your email" : isLogin ? "Please enter your details to login" : "Join our community today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isOtpStep && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white font-medium"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white font-medium"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white font-medium"
                required
              />
            </div>

            {!isOtpStep && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {isOtpStep && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-4 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white font-medium tracking-widest text-center"
                  maxLength={6}
                  required
                />
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {timeLeftMs > 0 ? `${Math.floor(timeLeftMs / 1000)}s remaining` : "Code expired"}
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Didn’t get the code?
                  <button
                    type="button"
                    className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    onClick={async () => {
                      const res = await fetch("/api/auth/resend-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });
                      const resData = await res.json();
                      if (res.ok) {
                        setInfo("Verification code resent to your email.");
                        setOtpExpiresAt(Date.now() + 60_000);
                        setTimeLeftMs(60_000);
                      } else {
                        setInfo(resData.message || "Failed to resend code.");
                      }
                    }}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm font-bold text-center">{error}</p>
            )}
            {info && !error && (
              <p className="text-blue-600 dark:text-blue-400 text-sm font-bold text-center">{info}</p>
            )}

            <button
              type="submit"
              disabled={loading || (isOtpStep && timeLeftMs <= 0)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isOtpStep ? "Verify" : isLogin ? "Login" : "Sign Up"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            {!isOtpStep && (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
