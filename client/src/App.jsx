import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './hooks/useAuthStore'
import Navbar from './components/Navbar'
import FloatingHearts from './components/FloatingHearts'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ShayariPage from './pages/ShayariPage'
import TemplatesPage from './pages/TemplatesPage'
import QuizPage from './pages/QuizPage'
import QuizPlayPage from './pages/QuizPlayPage'
import AIPage from './pages/AIPage'
import LoveLetterPage from './pages/LoveLetterPage'
import ViewProjectPage from './pages/ViewProjectPage'

const PrivateRoute = ({ children }) => {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen">
      <FloatingHearts />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/shayari" element={<PrivateRoute><ShayariPage /></PrivateRoute>} />
        <Route path="/templates" element={<PrivateRoute><TemplatesPage /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/quiz/play/:slug" element={<QuizPlayPage />} />
        <Route path="/ai" element={<PrivateRoute><AIPage /></PrivateRoute>} />
        <Route path="/letter" element={<PrivateRoute><LoveLetterPage /></PrivateRoute>} />
        <Route path="/s/:slug" element={<ViewProjectPage />} />
      </Routes>
    </div>
  )
}
