"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GooeyLoader } from "./gooey-loader";

interface NavigationLoaderProps {
  children: React.ReactNode;
}

export function NavigationLoader({ children }: NavigationLoaderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;

      if (href !== pathname) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      // Restore the 2-second loading effect
      setTimeout(() => setLoading(false), 2000);
    }
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="flex flex-1 items-center justify-center h-full min-h-[50vh]">
          <GooeyLoader />
        </div>
      )}
      <div className={loading ? "hidden" : "contents"}>
        {children}
      </div>
    </>
  );
}
