import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../hooks/useAuthStore'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { to: '/shayari',   label: '📜 Shayari' },
  { to: '/templates', label: '🎨 Templates' },
  { to: '/quiz',      label: '💝 Quiz' },
  { to: '/ai',        label: '🤖 AI Magic' },
  { to: '/letter',    label: '💌 Letter' },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    toast('👋 See you soon!')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 px-4 md:px-8 py-3"
      style={{ background: 'rgba(26,10,16,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(232,84,122,0.18)' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">

        {/* Logo */}
        <Link to="/" className="font-dancing text-2xl shrink-0"
          style={{ background: 'linear-gradient(135deg,#e8547a,#d4a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          💕 LoveStory
        </Link>

        {/* Links (hidden on mobile unless authenticated) */}
        {user && (
          <div className="hidden md:flex items-center gap-1 flex-wrap">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 font-medium
                  ${pathname === l.to
                    ? 'text-white'
                    : 'text-rose-light/70 hover:text-rose-light'}`}
                style={pathname === l.to ? { background: 'linear-gradient(135deg,#e8547a,#c03060)' } : {}}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/dashboard" className="text-xs text-rose-light/70 hover:text-rose-light hidden sm:block">
                👤 {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-xs py-1.5 px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs py-1.5 px-4">Login</Link>
              <Link to="/register" className="btn-rose text-xs py-1.5 px-4">Join Free 💕</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {user && (
        <div className="md:hidden flex gap-1 mt-2 overflow-x-auto pb-1">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`shrink-0 px-3 py-1 rounded-full text-xs transition-all
                ${pathname === l.to ? 'text-white' : 'text-rose-light/60'}`}
              style={pathname === l.to ? { background: 'linear-gradient(135deg,#e8547a,#c03060)' } : { border: '1px solid rgba(232,84,122,0.2)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
