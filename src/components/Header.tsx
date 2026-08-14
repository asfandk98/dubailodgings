"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/lib/auth";

const DRAWER_LINKS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Hotels", href: "/hotels", icon: "hotel" },
  { label: "AI Trip Planner", href: "#", icon: "smart_toy" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "event_available" },
  { label: "Support", href: "/contact", icon: "contact_support" },
];

interface AuthUser {
  name?: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const readAuth = () => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
    setRole(localStorage.getItem("role"));
  };

  useEffect(() => {
    readAuth();
    window.addEventListener("auth-change", readAuth);
    window.addEventListener("storage", readAuth);
    return () => {
      window.removeEventListener("auth-change", readAuth);
      window.removeEventListener("storage", readAuth);
    };
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const isLoggedIn = !!user;
  const dashboardHref = role === "admin" ? "/admin/dashboard" : "/dashboard";

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout request failed, signing out locally");
    }
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    setAccountOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => setDrawerOpen(true)} className="md:hidden text-primary" aria-label="Open menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link href="/" className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary tracking-tight">
              DUBAILODGINGS.COM
            </Link>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/hotels" className="text-on-surface-variant hover:text-secondary transition-colors duration-300 font-label-caps">
              HOTELS
            </Link>
            <span className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer font-label-caps">
              PLANNER
            </span>
            {isLoggedIn && (
              <Link href="/dashboard/bookings" className="text-primary font-bold hover:text-secondary transition-colors duration-300 font-label-caps">
                MY BOOKINGS
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-2 text-primary cursor-pointer active:opacity-70"
                >
                  <span className="material-symbols-outlined">account_circle</span>
                  <span className="hidden sm:block font-label-caps text-[12px]">{user?.name?.split(" ")[0]}</span>
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>

                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant shadow-2xl z-50 rounded-lg overflow-hidden">
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        <span className="font-body-sm">{role === "admin" ? "Admin Dashboard" : "Dashboard"}</span>
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">event_available</span>
                        <span className="font-body-sm">My Bookings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 transition-colors text-left border-t border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="font-body-sm">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="font-label-caps text-[12px] text-on-surface-variant hover:text-secondary transition-colors">
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="font-label-caps text-[12px] bg-primary text-on-primary px-5 py-2 hover:bg-secondary transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-0 left-0 h-full w-72 bg-surface transform transition-transform duration-300 flex flex-col ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
            <span className="font-display-lg-mobile text-primary">MENU</span>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col px-6 py-6 gap-1">
            {DRAWER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-3 font-label-caps border-b border-outline-variant/30 text-on-surface-variant">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-6 py-6 border-t border-outline-variant flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link href={dashboardHref} className="text-center border-2 border-secondary text-secondary py-3 font-label-caps">
                  {role === "admin" ? "ADMIN DASHBOARD" : "DASHBOARD"}
                </Link>
                <button onClick={handleLogout} className="text-center bg-primary text-on-primary py-3 font-label-caps">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-center border-2 border-secondary text-secondary py-3 font-label-caps">
                  LOGIN
                </Link>
                <Link href="/register" className="text-center bg-primary text-on-primary py-3 font-label-caps">
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}