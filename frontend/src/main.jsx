import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App.jsx'
import { useAppStore } from './store/useAppStore.js'

// Set initial theme/brand once on load. Change these values to switch.
useAppStore.setState((state) => ({}))
document.documentElement.setAttribute('data-theme', useAppStore.getState().theme)
document.documentElement.setAttribute('data-brand', useAppStore.getState().brand)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
