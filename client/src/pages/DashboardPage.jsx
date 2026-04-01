import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../hooks/useAuthStore'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/projects').catch(() => ({ data: { projects: [] } })),
      api.get('/quiz/my').catch(() => ({ data: { quizzes: [] } })),
    ]).then(([p, q]) => {
      setProjects(p.data.projects)
      setQuizzes(q.data.quizzes)
      setLoading(false)
    })
  }, [])

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    await api.delete(`/projects/${id}`)
    setProjects(prev => prev.filter(p => p._id !== id))
    toast.success('Deleted!')
  }

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${slug}`)
    toast.success('🔗 Link copied!')
  }

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-playfair text-3xl mb-1" style={{ color: '#f7c5d5' }}>
          Hey {user?.name} 💕
        </h1>
        <p className="text-sm mb-8" style={{ color: '#7a4a5a' }}>
          {user?.partnerName ? `Your love story with ${user.partnerName} lives here` : 'Your love story lives here'}
        </p>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { to: '/templates', icon: '🎨', label: 'New Page' },
            { to: '/shayari',   icon: '📜', label: 'Shayari' },
            { to: '/quiz',      icon: '💝', label: 'New Quiz' },
            { to: '/ai',        icon: '🤖', label: 'AI Magic' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="glass-card text-center py-5 !mb-0 transition-all duration-300 hover:-translate-y-1"
              style={{ cursor: 'pointer' }}>
              <div className="text-2xl mb-2">{a.icon}</div>
              <div className="text-xs font-medium" style={{ color: '#f5e6ee' }}>{a.label}</div>
            </Link>
          ))}
        </div>

        {/* Projects */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair text-xl" style={{ color: '#f7c5d5' }}>My Love Pages</h2>
            <Link to="/templates" className="btn-rose text-xs py-1.5 px-4">+ New</Link>
          </div>
          {loading ? (
            <p className="text-sm" style={{ color: '#7a4a5a' }}>Loading...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🌹</div>
              <p className="text-sm mb-4" style={{ color: '#7a4a5a' }}>No love pages yet. Create your first one!</p>
              <Link to="/templates" className="btn-rose text-sm">Create Now ✨</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl gap-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,84,122,0.12)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#f5e6ee' }}>{p.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#7a4a5a' }}>
                      {p.template} · {p.views} views · {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => copyLink(p.slug)} className="btn-ghost text-xs py-1 px-3">Share</button>
                    <button onClick={() => deleteProject(p._id)} className="text-xs px-3 py-1 rounded-full"
                      style={{ color: '#e8547a', border: '1px solid rgba(232,84,122,0.2)' }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quizzes */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair text-xl" style={{ color: '#f7c5d5' }}>My Quizzes</h2>
            <Link to="/quiz" className="btn-rose text-xs py-1.5 px-4">+ New</Link>
          </div>
          {quizzes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💝</div>
              <p className="text-sm mb-4" style={{ color: '#7a4a5a' }}>No quizzes yet!</p>
              <Link to="/quiz" className="btn-ghost text-sm">Create Quiz</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map(q => (
                <div key={q._id} className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,84,122,0.12)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#f5e6ee' }}>{q.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#7a4a5a' }}>
                      {q.questions.length} questions · {q.attempts} attempts
                    </div>
                  </div>
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/quiz/play/${q.slug}`)
                    toast.success('🔗 Quiz link copied!')
                  }} className="btn-ghost text-xs py-1 px-3 shrink-0">Share</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </main>
  )
}
