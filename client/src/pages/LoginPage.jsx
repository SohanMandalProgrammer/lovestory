import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuthStore from '../hooks/useAuthStore'

function AuthCard({ children, title, sub }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div className="glass-card w-full max-w-md"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-playfair text-3xl mb-1" style={{ color: '#f7c5d5' }}>{title}</h1>
        <p className="text-sm mb-8" style={{ color: '#7a4a5a' }}>{sub}</p>
        {children}
      </motion.div>
    </div>
  )
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await login(form.email, form.password)
    if (res.success) {
      toast.success('💕 Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(res.error)
    }
  }

  return (
    <AuthCard title="Welcome Back 💕" sub="Sign in to your LoveStory account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Email</label>
          <input type="email" className="input-field" placeholder="your@email.com"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Password</label>
          <input type="password" className="input-field" placeholder="••••••••"
            value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
        </div>
        <button type="submit" className="btn-rose w-full mt-2" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In 💕'}
        </button>
        <p className="text-center text-xs mt-4" style={{ color: '#7a4a5a' }}>
          New here? <Link to="/register" style={{ color: '#e8547a' }}>Create account</Link>
        </p>
      </form>
    </AuthCard>
  )
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', partnerName: '' })
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be 6+ characters'); return }
    const res = await register(form.name, form.email, form.password, form.partnerName)
    if (res.success) {
      toast.success('🌹 Your love story begins!')
      navigate('/dashboard')
    } else {
      toast.error(res.error)
    }
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <AuthCard title="Join LoveStory 🌹" sub="Create your free romantic space">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Your Name</label>
          <input type="text" className="input-field" placeholder="Arjun / Priya..."
            value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Email</label>
          <input type="email" className="input-field" placeholder="your@email.com"
            value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Password</label>
          <input type="password" className="input-field" placeholder="Min 6 characters"
            value={form.password} onChange={set('password')} required />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Partner's Name (optional)</label>
          <input type="text" className="input-field" placeholder="Their name..."
            value={form.partnerName} onChange={set('partnerName')} />
        </div>
        <button type="submit" className="btn-rose w-full mt-2" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Start My Love Story 💝'}
        </button>
        <p className="text-center text-xs mt-4" style={{ color: '#7a4a5a' }}>
          Already have an account? <Link to="/login" style={{ color: '#e8547a' }}>Sign in</Link>
        </p>
      </form>
    </AuthCard>
  )
}

export default LoginPage
