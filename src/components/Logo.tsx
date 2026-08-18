import Link from "next/link";

interface LogoProps {
  variant?: "default" | "light";
  icon?: boolean;
  className?: string;
}

export default function Logo({
  variant = "default",
  icon = true,
  className = "",
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      aria-label="Dubai Lodgings"
      className={`flex items-center gap-2.5 group shrink-0 ${className}`}
    >
      {icon && (
        <span
          className={`
            material-symbols-outlined
            text-[30px]
            sm:text-[32px]
            md:text-[36px]
            transition-colors
            duration-300
            ${
              isLight
                ? "text-secondary"
                : "text-secondary"
            }
          `}
        >
          apartment
        </span>
      )}

      <span className="flex flex-col justify-center leading-none">
        <span
          className={`
            font-display-lg-mobile
            md:font-display-lg
            text-[21px]
            sm:text-[23px]
            md:text-[26px]
            tracking-[0.08em]
            transition-colors
            duration-300
            ${
              isLight
                ? "text-white group-hover:text-secondary"
                : "text-primary group-hover:text-secondary"
            }
          `}
        >
          DUBAI
        </span>

        <span
          className={`
            text-[8px]
            sm:text-[9px]
            md:text-[10px]
            tracking-[0.32em]
            mt-1
            ml-[2px]
            font-medium
            transition-colors
            duration-300
            ${
              isLight
                ? "text-white/70 group-hover:text-secondary"
                : "text-on-surface-variant group-hover:text-secondary"
            }
          `}
        >
          LODGINGS
        </span>
      </span>
    </Link>
  );
}