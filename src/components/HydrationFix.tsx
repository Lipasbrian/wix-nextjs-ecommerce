// components/HydrationFix.tsx
"use client"

import React, { useEffect, useState } from 'react'

export default function HydrationFix({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}