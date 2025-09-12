import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore.js'
import { getBrandConfig } from '../../brand/config.js'
import Button from '../Button'
import './Navbar.scss'

function Navbar() {
  const brand = useAppStore((s) => s.brand)
  const cfg = getBrandConfig(brand)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const doLogout = useAppStore((s) => s.logout)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const handleLogout = async () => {
    setLoading(true)
    await doLogout()
    setLoading(false)
    navigate('/', { replace: true })
  }
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <a href={cfg.href} className="navbar__brand" target="_blank" rel="noreferrer">
          <img className="navbar__logo" src={cfg.logoSrc} alt={cfg.alt} />
        </a>
        <div className="navbar__actions">
          {isAuthenticated ? (
            <Button className="navbar__login" onClick={handleLogout} disabled={loading}>
              {loading ? 'Logging out…' : 'Logout'}
            </Button>
          ) : (
            <Link to="/doctor/login" className="navbar__login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar



