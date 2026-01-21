"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onHide?: () => void;
  duration?: number;
}

export function Toast({ message, show, onHide, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onHide?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-[#1C1C1E] border border-[#34C759]/30 rounded-full px-6 py-3 shadow-lg">
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
