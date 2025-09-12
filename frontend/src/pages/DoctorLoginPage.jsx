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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const res = await login({ username, password })
    if (res.success) {
      navigate('/doctor/dashboard', { replace: true })
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  return (
    <section className="login-page">
      <div className="login-split">
        <div className="login-pane login-pane--form">
          <div className="pane-inner">
            <img src={ackoLogo} alt="ACKO" className="login-card__logo" />
              <form onSubmit={onSubmit} className="login-form">
              <label className="login-field">
                <span className="login-field__icon" aria-hidden="true">
                  <img src={iconUser} alt="" />
                </span>
                <input placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label className="login-field">
                <span className="login-field__icon" aria-hidden="true">
                  <img src={iconLock} alt="" />
                </span>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              {error && <p className="login-error">{error}</p>}
              <div className="login-row">
                <label className="remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot">Forgot password?</a>
              </div>
              <Button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in as Doctor'}
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


