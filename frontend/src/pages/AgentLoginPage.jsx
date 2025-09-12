import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'
import Button from '../components/Button'

function AgentLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAppStore((s) => s.login)
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    const res = login({ username, password })
    if (res.success) {
      navigate('/agent/dashboard', { replace: true })
    } else {
      setError(res.error)
    }
  }

  return (
    <section className="container" style={{ maxWidth: 420 }}>
      <h1>Agent Login</h1>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p style={{ color: 'tomato' }}>{error}</p>}
          <Button type="submit">Login</Button>
        </div>
      </form>
    </section>
  )
}

export default AgentLoginPage


