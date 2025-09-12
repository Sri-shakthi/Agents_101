import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import DoctorLoginPage from '../pages/DoctorLoginPage.jsx'
import DoctorDashboardPage from '../pages/DoctorDashboardPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicRoute from './PublicRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/doctor/login" replace /> },
      { path: 'doctor/login', element: (
        <PublicRoute>
          <DoctorLoginPage />
        </PublicRoute>
      ) },
      {
        path: 'doctor',
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DoctorDashboardPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router


