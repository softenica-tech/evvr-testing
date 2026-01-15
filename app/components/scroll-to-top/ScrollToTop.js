"use client";
import { useEffect } from "react";
import { getLenis } from "../lenis/LenisProvider";

export default function ScrollToTop() {
  useEffect(() => {
    // Scroll to top on page load/refresh
    const scrollToTop = () => {
      const lenis = getLenis();
      if (lenis) {
        // Use Lenis for smooth scroll to top
        lenis.scrollTo(0, {
          duration: 0, // Instant scroll on page refresh
        });
      } else {
        // Fallback to native scroll if Lenis is not ready
        window.scrollTo(0, 0);
      }
    };

    // Small delay to ensure Lenis is initialized
    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}

