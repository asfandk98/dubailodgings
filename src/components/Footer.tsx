"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-primary-container border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-gutter py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:gap-20">
          
          {/* Brand */}
          <div className="min-w-0">
            <Link
              href="/"
              className="block text-2xl sm:text-3xl font-serif font-bold text-on-primary tracking-tight mb-5"
            >
              DUBAILODGINGS.COM
            </Link>

            <p className="max-w-sm text-on-primary-container text-body-sm leading-relaxed">
              Luxury Reimagined. The definitive platform for high-end
              hospitality in the United Arab Emirates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-on-primary font-bold mb-5">
              Quick Links
            </h6>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-of-service"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h6 className="text-on-primary font-bold mb-5">
              Connect
            </h6>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/press"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  Press
                </Link>
              </li>

              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-primary-container hover:text-secondary-fixed transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-outline-variant/20">
          <p className="text-on-primary-container text-center text-body-sm">
            © {new Date().getFullYear()} DUBAILODGINGS.COM. Luxury Reimagined.
          </p>
        </div>
      </div>
    </footer>
  );
}