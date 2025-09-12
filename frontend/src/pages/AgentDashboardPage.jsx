import { useAppStore } from '../store/useAppStore.js'
import Button from '../components/Button'

function AgentDashboardPage() {
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <Button variant="secondary" onClick={logout}>Logout</Button>
    </section>
  )
}

export default AgentDashboardPage


