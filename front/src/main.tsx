import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const SENTRY_DSN = import.meta.env["VITE_SENTRY_DSN"] as string

if (!SENTRY_DSN) throw new Error('SENTRY_DSN is not set')

Sentry.init({dsn: SENTRY_DSN, environment: import.meta.env.MODE})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
