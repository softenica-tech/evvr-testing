"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

// Store lenis instance globally for access from other components
let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Animation frame function
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

