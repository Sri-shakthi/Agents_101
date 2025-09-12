import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go home</Link>
    </section>
  )
}

export default NotFoundPage


