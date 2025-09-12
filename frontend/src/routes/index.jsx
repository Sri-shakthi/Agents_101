import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import GuestPage from '../pages/GuestPage.jsx'
import AgentLoginPage from '../pages/AgentLoginPage.jsx'
import AgentDashboardPage from '../pages/AgentDashboardPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guest', element: <GuestPage /> },
      { path: 'agent/login', element: <AgentLoginPage /> },
      {
        path: 'agent',
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <AgentDashboardPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router


