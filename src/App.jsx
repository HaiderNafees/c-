import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LecturePage from './pages/LecturePage'
import ProgressPage from './pages/ProgressPage'
import { useAuth } from './context/AuthContext'

/* ============================================================
   App
   Root layout: Navbar + routed page content.
   - ThemeProvider & AuthProvider wrap everything in main.jsx.
   - Public: /, /login, /signup
   - Protected: /dashboard, /lectures/:topicId, /progress
   ============================================================ */

function App() {
  return (
    <div className="min-h-screen flex flex-col theme-transition">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lectures/:topicId"
          element={
            <ProtectedRoute>
              <LecturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

/* ============================================================
   ProtectedRoute
   Wraps a page. If the user is not authenticated, redirect to
   /login. While the session is still being restored (loading),
   render nothing to avoid a flash of the login screen.
   ============================================================ */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default App
