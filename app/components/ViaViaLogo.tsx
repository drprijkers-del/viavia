import Link from "next/link";

interface ViaViaLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

export default function ViaViaLogo({ size = "md", showText = true, href = "/" }: ViaViaLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-10 h-10 text-lg",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const logo = (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-[#34C759] to-[#30B350] flex items-center justify-center text-white font-bold shrink-0`}>
        V
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-semibold text-white`}>
          ViaVia
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logo}
      </Link>
    );
  }

  return logo;
}
