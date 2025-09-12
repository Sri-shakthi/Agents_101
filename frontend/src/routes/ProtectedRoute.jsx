import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'

function ProtectedRoute() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/doctor/login" replace />
  return <Outlet />
}

export default ProtectedRoute


