import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'

function GuestRoute({ children }) {
  const isGuest = useAppStore((s) => s.isGuest)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  // If user is authenticated as doctor, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/doctor/dashboard" replace />
  }

  // If not a guest, redirect to login
  if (!isGuest) {
    return <Navigate to="/doctor/login" replace />
  }

  // If guest, show the guest page
  return children
}

export default GuestRoute
