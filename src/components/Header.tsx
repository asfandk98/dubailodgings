"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/lib/auth";

const DRAWER_LINKS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Hotels", href: "/hotels", icon: "hotel" },
  { label: "About Us", href: "/about", icon: "info" },
  { label: "AI Trip Planner", href: "#", icon: "smart_toy" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "event_available" },
  { label: "Contact Us", href: "/contact", icon: "contact_support" },
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
  const dashboardHref =
    role === "admin" ? "/admin/dashboard" : "/dashboard";

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
    setDrawerOpen(false);

    router.push("/");
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
          
          {/* LEFT SIDE */}
          <div className="flex items-center min-w-0">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 mr-2 text-primary shrink-0"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                menu
              </span>
            </button>

           <Link
  href="/"
  className="flex flex-col justify-center leading-none group"
  aria-label="Dubai Lodgings"
>
  <span
    className="
      text-primary
      font-display-lg-mobile
      md:font-display-lg
      text-[22px]
      sm:text-[24px]
      md:text-[28px]
      tracking-[0.08em]
      group-hover:text-secondary
      transition-colors
      duration-300
    "
  >
    DUBAI
  </span>

  <span
    className="
      text-on-surface-variant
      text-[8px]
      sm:text-[9px]
      md:text-[10px]
      tracking-[0.35em]
      font-medium
      mt-1
      ml-[2px]
      group-hover:text-secondary
      transition-colors
      duration-300
    "
  >
    LODGINGS
  </span>
</Link>
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            <Link
              href="/hotels"
              className="text-on-surface-variant hover:text-secondary transition-colors duration-300 font-label-caps"
            >
              HOTELS
            </Link>
             <Link
    href="/about"
    className="text-on-surface-variant hover:text-secondary transition-colors duration-300 font-label-caps"
  >
    ABOUT US
  </Link>

             <Link
    href="/contact"
    className="text-on-surface-variant hover:text-secondary transition-colors duration-300 font-label-caps"
  >
    CONTACT US
  </Link>

            <span className="text-on-surface-variant hover:text-secondary transition-colors duration-300 cursor-pointer font-label-caps">
              PLANNER
            </span>

            {isLoggedIn && (
              <Link
                href="/dashboard/bookings"
                className="text-primary font-bold hover:text-secondary transition-colors duration-300 font-label-caps"
              >
                MY BOOKINGS
              </Link>

              
            )}
          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((open) => !open)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    min-w-10
                    h-10
                    px-1
                    sm:px-2
                    text-primary
                    cursor-pointer
                    active:opacity-70
                  "
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    account_circle
                  </span>

                  {/* Hide username on very small screens */}
                  <span className="hidden sm:block font-label-caps text-[12px] max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>

                  <span className="hidden sm:block material-symbols-outlined text-[18px]">
                    expand_more
                  </span>
                </button>

                {accountOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountOpen(false)}
                    />

                    {/* Account Dropdown */}
                    <div
                      className="
                        absolute
                        right-0
                        mt-2
                        w-[calc(100vw-2rem)]
                        max-w-56
                        bg-white
                        border
                        border-outline-variant
                        shadow-2xl
                        z-50
                        rounded-lg
                        overflow-hidden
                      "
                    >
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-3 px-4 py-3.5 text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          dashboard
                        </span>

                        <span className="font-body-sm">
                          {role === "admin"
                            ? "Admin Dashboard"
                            : "Dashboard"}
                        </span>
                      </Link>

                      <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-3 px-4 py-3.5 text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          event_available
                        </span>

                        <span className="font-body-sm">
                          My Bookings
                        </span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3.5
                          text-error
                          hover:bg-error-container/20
                          transition-colors
                          text-left
                          border-t
                          border-outline-variant
                        "
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          logout
                        </span>

                        <span className="font-body-sm">
                          Logout
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Desktop Login/Register */
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <Link
                  href="/login"
                  className="font-label-caps text-[12px] text-on-surface-variant hover:text-secondary transition-colors"
                >
                  LOGIN
                </Link>

                <Link
                  href="/register"
                  className="
                    font-label-caps
                    text-[12px]
                    bg-primary
                    text-on-primary
                    px-4
                    lg:px-5
                    py-2.5
                    hover:bg-secondary
                    transition-colors
                  "
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`
          md:hidden
          fixed
          inset-0
          z-[60]
          bg-black/60
          backdrop-blur-sm
          transition-all
          duration-300
          ${
            drawerOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        onClick={closeDrawer}
      >
        {/* Drawer */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            absolute
            top-0
            left-0
            h-full
            w-[85%]
            max-w-[320px]
            bg-surface
            shadow-2xl
            transform
            transition-transform
            duration-300
            flex
            flex-col
            ${
              drawerOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-outline-variant shrink-0">
            <span className="font-display-lg-mobile text-primary text-[20px]">
              MENU
            </span>

            <button
              onClick={closeDrawer}
              className="flex items-center justify-center w-10 h-10"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
            <div className="flex flex-col">
              {DRAWER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className="
                    flex
                    items-center
                    gap-4
                    min-h-[52px]
                    py-3
                    border-b
                    border-outline-variant/30
                    text-on-surface-variant
                    hover:text-secondary
                    transition-colors
                    font-label-caps
                  "
                >
                  <span className="material-symbols-outlined text-[21px]">
                    {link.icon}
                  </span>

                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Drawer Bottom */}
          <div className="px-5 sm:px-6 py-5 border-t border-outline-variant flex flex-col gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={closeDrawer}
                  className="
                    flex
                    items-center
                    justify-center
                    min-h-[48px]
                    border-2
                    border-secondary
                    text-secondary
                    py-3
                    px-4
                    font-label-caps
                    text-center
                  "
                >
                  {role === "admin"
                    ? "ADMIN DASHBOARD"
                    : "DASHBOARD"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    min-h-[48px]
                    bg-primary
                    text-on-primary
                    py-3
                    px-4
                    font-label-caps
                    text-center
                  "
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeDrawer}
                  className="
                    flex
                    items-center
                    justify-center
                    min-h-[48px]
                    border-2
                    border-secondary
                    text-secondary
                    py-3
                    px-4
                    font-label-caps
                  "
                >
                  LOGIN
                </Link>

                <Link
                  href="/register"
                  onClick={closeDrawer}
                  className="
                    flex
                    items-center
                    justify-center
                    min-h-[48px]
                    bg-primary
                    text-on-primary
                    py-3
                    px-4
                    font-label-caps
                  "
                >
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