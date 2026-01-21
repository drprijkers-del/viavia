"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputRowProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputRow = forwardRef<HTMLInputElement, InputRowProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm text-[#8E8E93]">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl px-4 py-3 text-white placeholder-[#636366] focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-colors ${error ? "border-[#FF453A]" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#FF453A]">{error}</p>
        )}
      </div>
    );
  }
);

InputRow.displayName = "InputRow";
