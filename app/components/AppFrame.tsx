"use client";

import { ReactNode } from "react";

interface AppFrameProps {
  children: ReactNode;
  className?: string;
}

export default function AppFrame({ children, className = "" }: AppFrameProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex justify-center">
      <div className={`w-full max-w-lg bg-[#121214] min-h-screen shadow-2xl ${className}`}>
        <div className="px-5 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
