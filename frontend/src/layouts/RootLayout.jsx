import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function RootLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="app-footer">
        <small>© {new Date().getFullYear()} App</small>
      </footer>
    </div>
  )
}

export default RootLayout


