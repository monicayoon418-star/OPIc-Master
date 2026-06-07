'use client'

import mixpanel from 'mixpanel-browser'

let initialized = false

export function initMixpanel() {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token || initialized) return
  mixpanel.init(token, { persistence: 'localStorage', ignore_dnt: false })
  initialized = true
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  mixpanel.track(event, properties)
}

export function trackPageView(path: string) {
  trackEvent('Page View', { path })
}
