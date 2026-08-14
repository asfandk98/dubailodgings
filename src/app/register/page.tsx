"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role) localStorage.setItem("role", res.data.user.role);
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Account created successfully!");

      const redirectTo = sessionStorage.getItem("redirect_after_login");
      sessionStorage.removeItem("redirect_after_login");
      router.push(redirectTo ?? "/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Registration failed. Please try again.";
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
              <h2 className="font-headline-md text-headline-md text-on-primary mb-4">Elevate Your Stay.</h2>
              <p className="font-body-md text-body-md text-on-primary/80 leading-relaxed max-w-xs">
                Join our exclusive circle of travelers and access the most prestigious properties in Dubai.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase mb-2 block">
                Registration
              </span>
              <h3 className="font-headline-md text-headline-md text-primary">Create Your Account</h3>
              <p className="text-on-surface-variant mt-2 font-body-sm text-body-sm">
                Start your journey into luxury hospitality.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  id="full_name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-touch-target px-4 border border-outline-variant bg-surface rounded-none transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                  placeholder="Alexander Mercer"
                  required
                  type="text"
                />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="password">
                    Password
                  </label>
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
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="confirm_password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full h-touch-target px-4 border border-outline-variant bg-surface rounded-none transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#000000]"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 border-outline-variant text-primary focus:ring-primary rounded-sm cursor-pointer"
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="text-primary underline underline-offset-4 hover:text-secondary transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-primary underline underline-offset-4 hover:text-secondary transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-touch-target bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 hover:bg-secondary-container hover:text-on-secondary-container active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Creating Account…" : "Create Account"}
                </button>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-px bg-outline-variant flex-grow" />
                  <span className="font-label-caps text-[10px] text-outline uppercase tracking-widest">
                    Already have an account?
                  </span>
                  <div className="h-px bg-outline-variant flex-grow" />
                </div>

                <Link
                  href="/login"
                  className="flex items-center justify-center w-full h-touch-target border-2 border-secondary text-secondary font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 hover:bg-secondary hover:text-on-primary active:scale-[0.98]"
                >
                  Sign In
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