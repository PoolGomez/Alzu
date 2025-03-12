"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FullScreenLoader() {
  // You can add any UI inside Loading, including a Skeleton.
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && theme === "dark";

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? "bg-black bg-opacity-90":"bg-white bg-opacity-90"}`}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white-foreground text-lg font-semibold">
          Cargando...
        </p>
      </div>
    </div>
  );
}
