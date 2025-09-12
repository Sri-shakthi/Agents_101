import { Link, NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore.js'
import { getBrandConfig } from '../../brand/config.js'
import './Navbar.scss'

function Navbar() {
  const brand = useAppStore((s) => s.brand)
  const cfg = getBrandConfig(brand)
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <a href={cfg.href} className="navbar__brand" target="_blank" rel="noreferrer">
          <img className="navbar__logo" src={cfg.logoSrc} alt={cfg.alt} />
        </a>
        <nav className="navbar__nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/guest" className={({ isActive }) => isActive ? 'active' : ''}>Guest</NavLink>
          <NavLink to="/agent/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Agent</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar



