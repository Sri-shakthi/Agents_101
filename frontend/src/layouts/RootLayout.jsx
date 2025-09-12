import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppStore } from '../store/useAppStore.js'

function RootLayout() {
  const location = useLocation()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isLoginRoute = location.pathname === '/doctor/login'
  const hideChrome = isLoginRoute && !isAuthenticated
  return (
    <div className="app-shell">
      {!hideChrome && <Navbar />}
      <main className={hideChrome ? '' : 'container'}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  )
}

export default RootLayout


