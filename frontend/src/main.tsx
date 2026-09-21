import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AnalyticsProvider } from './analytics/AnalyticsProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import RouteSeoManager from './seo/RouteSeoManager'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnalyticsProvider>
      <BrowserRouter>
        <RouteSeoManager />
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AnalyticsProvider>
  </StrictMode>,
)
