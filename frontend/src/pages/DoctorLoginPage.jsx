import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.js';
import Button from '../components/Button/index.jsx';
import ackoLogo from '../assets/white-acko.svg';
import iconUser from '../assets/icons/user.svg';
import iconLock from '../assets/icons/lock.svg';
import rightImage from '../assets/login-right-image.svg';
import secureDashboard from '../assets/secure_dashboard.svg';
import report from '../assets/report.svg';
import stethoscope from '../assets/stethoscope.svg';
import './DoctorLoginPage.scss';

function DoctorLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestId, setGuestId] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const login = useAppStore((s) => s.login);
  const guestLogin = useAppStore((s) => s.guestLogin);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (isGuestMode) {
      const res = await guestLogin({ guestId })
      if (res.success) {
        navigate('/guest', { replace: true })
      } else {
        setError(res.error)
      }
    } else {
      const res = await login({ username, password })
      if (res.success) {
        navigate('/doctor/dashboard', { replace: true })
      } else {
        setError(res.error)
      }
    }
    setLoading(false)
  }

  function handleModeToggle() {
    setIsGuestMode(!isGuestMode)
    setError('')
    setUsername('')
    setPassword('')
    setGuestId('')
  }

  return (
    <section className="login-page">
      <div className="login-split">
        <div className="login-pane login-pane--form">
          <div className="pane-inner">
            <img src={ackoLogo} alt="ACKO" className="login-card__logo" />
            
            {/* Login Mode Toggle */}
            <div className="login-mode-toggle">
              <button 
                type="button" 
                className={`mode-btn ${!isGuestMode ? 'active' : ''}`}
                onClick={() => setIsGuestMode(false)}
              >
                Doctor Login
              </button>
              <button 
                type="button" 
                className={`mode-btn ${isGuestMode ? 'active' : ''}`}
                onClick={() => setIsGuestMode(true)}
              >
                Guest Login
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="login-form">
              {!isGuestMode ? (
                <>
                  <label className="login-field">
                    <span className="login-field__icon" aria-hidden="true">
                      <img src={iconUser} alt="" />
                    </span>
                    <input 
                      placeholder="Enter your username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                  </label>
                  <label className="login-field">
                    <span className="login-field__icon" aria-hidden="true">
                      <img src={iconLock} alt="" />
                    </span>
                    <input 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </label>
                </>
              ) : (
                <label className="login-field">
                  <span className="login-field__icon" aria-hidden="true">
                    <img src={iconUser} alt="" />
                  </span>
                  <input 
                    placeholder="Enter your guest ID" 
                    value={guestId} 
                    onChange={(e) => setGuestId(e.target.value)} 
                  />
                </label>
              )}
              
              {error && <p className="login-error">{error}</p>}
              
              {!isGuestMode && (
                <div className="login-row">
                  <label className="remember">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <a href="#" className="forgot">Forgot password?</a>
                </div>
              )}
              
              <Button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Signing in…' : (isGuestMode ? 'Sign in as Guest' : 'Sign in as Doctor')}
              </Button>
            </form>
          </div>
        </div>
        <aside className="login-pane login-pane--info">
          <div className="pane-inner pane-inner--info">
          <img src={rightImage} alt="ACKO" className="" />
            <h2 className="info-title">Redefining Healthcare Risk Assessments</h2>
            <p className="info-body">
            Access your doctor portal to manage medical reports and patient data.
            </p>
            <div className="info-features">
              <div className="info-feature">
                <div className="info-icon">
                <img src={stethoscope} alt="ACKO" className="" />
                </div>
                <div>
                  <div className="info-label">Conduct Medical Exams</div>
                </div>
              </div>
              <div className="info-feature">
                <div className="info-icon">
                <img src={report} alt="ACKO" className="" />
                </div>
                <div>
                  <div className="info-label">Submit Health Reports</div>
                </div>
              </div>
              <div className="info-feature">
                <div className="info-icon">
                <img src={secureDashboard} alt="ACKO" className="" />
                </div>
                <div>
                  <div className="info-label">Secure Doctor Dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default DoctorLoginPage


