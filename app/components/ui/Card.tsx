"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const baseClasses = "bg-[#1C1C1E] rounded-2xl p-5 border border-[#2C2C2E]";
  const hoverClasses = hover ? "hover:bg-[#252528] cursor-pointer transition-colors" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardCompact({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-[#1C1C1E] rounded-xl p-4 border border-[#2C2C2E] ${onClick ? "hover:bg-[#252528] cursor-pointer transition-colors" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
