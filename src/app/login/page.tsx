"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role ?? "");
      window.dispatchEvent(new Event("auth-change"));

      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      const redirectTo = sessionStorage.getItem("redirect_after_login");
      sessionStorage.removeItem("redirect_after_login");
      router.push(redirectTo ?? "/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex justify-center items-center h-20 px-gutter max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary tracking-tight"
          >
            DUBAILODGINGS.COM
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-gutter">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest overflow-hidden shadow-2xl rounded-lg">
          {/* Visual */}
          <div className="hidden lg:block relative overflow-hidden group">
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #131b2e 0%, #1e293b 100%)", opacity: 0.6, zIndex: 10 }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              role="img"
              aria-label="Dubai skyline at golden hour"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAED-BsHYqaX2klSNZPiRBzzYzfK1z5bCTI6QcIAImwhDbmFLGBNDOUIjwWU4coVKyl0I59Ca7WEmNAgdzZ0G24ewP3P2thju__f9-V90UtkyYnuYbj5wyLctGwNk-yTjMrAZrkiqu_b7YZR0UCIngjLu8AKmjDw8k4wDdip1So8d45x8_pZD_KgSv1FgNghMwRnvg3YYHr98T4aYgAkOPivpTZYBIXSv3yFGg6UgwpJayArNz5cU7-')",
              }}
            />
            <div className="absolute bottom-12 left-12 right-12 z-20">
              <h2 className="font-headline-md text-headline-md text-on-primary mb-4">Welcome Back.</h2>
              <p className="font-body-md text-body-md text-on-primary/80 leading-relaxed max-w-xs">
                Sign in to continue curating your next exceptional stay in the Emirates.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-2 block">
                Sign In
              </span>
              <h3 className="font-headline-md text-headline-md text-primary">Welcome Back</h3>
              <p className="text-on-surface-variant mt-2 font-body-sm text-body-sm">Access your bookings and saved stays.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-surface rounded-none transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                  placeholder="alex@example.com"
                  required
                  type="email"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="font-label-caps text-[10px] text-secondary hover:underline">
                    FORGOT PASSWORD?
                  </Link>
                </div>
                <input
                  id="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-surface rounded-none transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-touch-target bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 hover:bg-secondary-container hover:text-on-secondary-container active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Signing In…" : "Sign In"}
                </button>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-px bg-outline-variant flex-grow" />
                  <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest">
                    Don&apos;t have an account?
                  </span>
                  <div className="h-px bg-outline-variant flex-grow" />
                </div>

                <Link
                  href="/register"
                  className="flex items-center justify-center w-full h-touch-target border-2 border-secondary text-secondary font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 hover:bg-secondary hover:text-on-primary active:scale-[0.98]"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-section-gap-sm bg-primary-container text-on-primary mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
          <div className="md:col-span-1">
            <div className="font-display-lg-mobile text-display-lg-mobile text-on-primary mb-4">DL</div>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Curating the world&apos;s most exceptional living experiences in the heart of Dubai.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-2 uppercase">Platform</h4>
            <Link className="font-body-sm text-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/about-us">
              About Us
            </Link>
            <Link className="font-body-sm text-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/terms-of-service">
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-2 uppercase">Support</h4>
            <Link className="font-body-sm text-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="font-body-sm text-body-sm text-on-primary-container hover:text-secondary-fixed transition-colors" href="/contact">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-2 uppercase">Connect</h4>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-primary-container cursor-pointer hover:text-secondary-fixed">language</span>
              <span className="material-symbols-outlined text-on-primary-container cursor-pointer hover:text-secondary-fixed">public</span>
              <span className="material-symbols-outlined text-on-primary-container cursor-pointer hover:text-secondary-fixed">share</span>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-outline/20 pt-8">
          <p className="font-body-sm text-body-sm text-on-primary-container">© {new Date().getFullYear()} DUBAILODGINGS.COM. Luxury Reimagined.</p>
        </div>
      </footer>
    </div>
  );
}