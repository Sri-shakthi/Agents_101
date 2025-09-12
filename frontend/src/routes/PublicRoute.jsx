import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'

function PublicRoute({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/doctor/dashboard" replace />
  return children
}

export default PublicRoute


