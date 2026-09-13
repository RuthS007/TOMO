import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  textColor = "text-white",
  className = "",
}) => {
  const sizeMap = {
    sm: { icon: 28, box: "w-7 h-7", text: "text-base" },
    md: { icon: 38, box: "w-9 h-9", text: "text-lg" },
    lg: { icon: 52, box: "w-13 h-13", text: "text-2xl" },
    xl: { icon: 72, box: "w-18 h-18", text: "text-3xl" },
  };

  const { box, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Interlocking Buddy Duo Icon styled after the Figma attachment */}
      <div
        className={`${box} relative flex items-center justify-center rounded-2xl bg-slate-900/80 shadow-md ring-1 ring-white/10 p-1`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left figure: Purple / Violet */}
          <circle cx="36" cy="30" r="10" fill="#8B5CF6" />
          <path
            d="M26 80V52C26 44 32 40 40 40H44C52 40 56 46 56 54V80"
            stroke="#8B5CF6"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Right figure: Turquoise / Cyan, interlocking loop */}
          <circle cx="68" cy="32" r="10" fill="#06B6D4" />
          <path
            d="M48 64C52 54 62 46 72 46C82 46 88 54 88 64C88 74 80 82 70 82C60 82 50 74 48 64Z"
            stroke="#06B6D4"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-display font-bold tracking-tight ${text} ${textColor}`}
        >
          Campus<span className="text-teal-400">Buddy</span>
        </span>
      )}
    </div>
  );
};
