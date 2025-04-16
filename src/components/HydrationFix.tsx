"use client";

import React, { useEffect, useState } from "react";

interface HydrationFixProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationFix({
  children,
  fallback = null,
}: HydrationFixProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;

  return <>{children}</>;
}
