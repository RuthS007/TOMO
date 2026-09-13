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
  textColor = "text-slate-900",
  className = "",
}) => {
  const sizeMap = {
    sm: { icon: 26, box: "w-7 h-7", text: "text-base" },
    md: { icon: 34, box: "w-9 h-9", text: "text-xl" },
    lg: { icon: 48, box: "w-12 h-12", text: "text-2xl" },
    xl: { icon: 68, box: "w-16 h-16", text: "text-3xl" },
  };

  const { box, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Interlocking Buddy Duo Icon in vibrant soft pill */}
      <div
        className={`${box} relative flex items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-1.5`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left figure: Sky Cyan */}
          <circle cx="34" cy="30" r="10" fill="#0284C7" />
          <path
            d="M24 80V52C24 44 30 40 38 40H42C50 40 54 46 54 54V80"
            stroke="#0284C7"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Right figure: Soft Emerald/Mint */}
          <circle cx="68" cy="32" r="10" fill="#10B981" />
          <path
            d="M48 64C52 54 62 46 72 46C82 46 88 54 88 64C88 74 80 82 70 82C60 82 50 74 48 64Z"
            stroke="#10B981"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-display font-extrabold tracking-tight ${text} ${textColor}`}
        >
          Campus<span className="text-sky-500">Buddy</span>
        </span>
      )}
    </div>
  );
};
