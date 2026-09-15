import React, { useState } from "react";
import tomoLogoImg from "../assets/images/tomo_app_logo_1789482747515.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: string;
  className?: string;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  textColor = "text-slate-900",
  className = "",
  subtitle = "Campus Buddies",
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { box: "w-7 h-7", radius: "rounded-xl", text: "text-base", sub: "text-[9px]" },
    md: { box: "w-9 h-9", radius: "rounded-2xl", text: "text-xl", sub: "text-[10px]" },
    lg: { box: "w-12 h-12", radius: "rounded-2xl", text: "text-2xl", sub: "text-xs" },
    xl: { box: "w-16 h-16", radius: "rounded-3xl", text: "text-3xl", sub: "text-xs" },
  };

  const { box, radius, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon */}
      <div
        className={`${box} ${radius} overflow-hidden relative flex items-center justify-center bg-white shadow-xs ring-1 ring-black/5 shrink-0`}
      >
        {!imgError ? (
          <img
            src={tomoLogoImg}
            alt="TOMO Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1.5"
          >
            <circle cx="34" cy="30" r="10" fill="#0284C7" />
            <path
              d="M24 80V52C24 44 30 40 38 40H42C50 40 54 46 54 54V80"
              stroke="#0284C7"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="68" cy="32" r="10" fill="#10B981" />
            <path
              d="M48 64C52 54 62 46 72 46C82 46 88 54 88 64C88 74 80 82 70 82C60 82 50 74 48 64Z"
              stroke="#10B981"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-extrabold tracking-tight ${text} ${textColor} flex items-center gap-1.5`}
          >
            TOMO
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
          </span>
          {subtitle && (
            <span className={`${sub} text-slate-500 font-medium tracking-normal mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

