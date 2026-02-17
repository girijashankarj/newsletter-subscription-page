import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './ThemeContext.jsx'
import NewsletterPage from './NewsletterPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <NewsletterPage />
    </ThemeProvider>
  </StrictMode>,
)
