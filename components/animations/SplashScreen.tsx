'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show splash screen on route change
    setIsVisible(true);

    // Hide splash screen after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background overlay with filling animation */}
      <div className="absolute inset-0 animate-fill-background" />

      {/* Logo container with new animation */}
      <div className="relative w-32 h-32 animate-splash-smooth">
        <Image
          src="/logo/logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 