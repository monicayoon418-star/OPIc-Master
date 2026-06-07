'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initMixpanel, trackPageView } from '@/lib/mixpanel'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    initMixpanel()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return <>{children}</>
}
