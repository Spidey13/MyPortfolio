import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

// Initialize PostHog
if (import.meta.env.VITE_POSTHOG_API_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskTextSelector: '.sensitive, .password-input',
    },
    disable_session_recording: false,
  })
  console.log('✅ PostHog analytics initialized')
} else {
  console.log('ℹ️  PostHog not configured (VITE_POSTHOG_API_KEY missing)')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
