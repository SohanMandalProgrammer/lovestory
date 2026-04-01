import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'

const TEMPLATE_STYLES = {
  instagram: { bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', icon: '📸' },
  story:     { bg: 'linear-gradient(135deg,#0f3443,#34e89e)',           icon: '📖' },
  letter:    { bg: 'linear-gradient(135deg,#2d1020,#d4a853)',           icon: '💌' },
  proposal:  { bg: 'linear-gradient(135deg,#1a0a10,#e8547a)',           icon: '💍' },
  neon:      { bg: 'linear-gradient(135deg,#0a0010,#7700ff)',           icon: '✨' },
  pastel:    { bg: 'linear-gradient(135deg,#fce4ec,#f48fb1)',           icon: '🌸' },
}

export default function ViewProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api.get(`/projects/${slug}`).then(r => { setProject(r.data.project); setLoading(false) })
      .catch(e => { setErr(e.response?.data?.error || 'Not found'); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <p className="font-dancing text-3xl" style={{ color: '#e8547a' }}>Loading your love story... 💕</p>
    </div>
  )

  if (err) return (
    <div className="min-h-screen flex items-center justify-center relative z-10 text-center px-4">
      <div>
        <div className="text-5xl mb-4">💔</div>
        <p className="font-playfair text-xl" style={{ color: '#f7c5d5' }}>{err}</p>
        <p className="text-sm mt-2" style={{ color: '#7a4a5a' }}>This love page may be private or deleted.</p>
      </div>
    </div>
  )

  const style = TEMPLATE_STYLES[project.template] || TEMPLATE_STYLES.proposal

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-4 py-16">
      <motion.div className="w-full max-w-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>

        {/* Main card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(232,84,122,0.3)' }}>

          {/* Header */}
          <div className="relative flex flex-col items-center justify-center py-16 px-8 text-center"
            style={{ background: style.bg, minHeight: 280 }}>
            {/* Overlay */}
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />

            {/* Photos */}
            {project.photos?.length > 0 && (
              <div className="relative z-10 flex gap-2 mb-6 flex-wrap justify-center">
                {project.photos.slice(0, 3).map((p, i) => (
                  <img key={i} src={p.url} alt="" className="rounded-2xl object-cover shadow-lg"
                    style={{ width: project.photos.length === 1 ? 220 : 100, height: project.photos.length === 1 ? 220 : 100 }} />
                ))}
              </div>
            )}

            <div className="relative z-10">
              <div className="text-4xl mb-3">{style.icon}</div>
              <h1 className="font-playfair text-3xl text-white mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                {project.title}
              </h1>
              <p className="font-dancing text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                by {project.user?.name}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8" style={{ background: 'rgba(26,10,16,0.95)' }}>
            {project.loveMessage && (
              <p className="font-playfair text-base leading-8 text-center mb-6 whitespace-pre-line" style={{ color: '#f5e6ee' }}>
                {project.loveMessage}
              </p>
            )}

            {project.shayari?.text && (
              <div className="rounded-2xl p-5 text-center mt-4" style={{ background: 'rgba(232,84,122,0.07)', border: '1px solid rgba(232,84,122,0.2)' }}>
                <p className="font-playfair text-sm leading-8 whitespace-pre-line" style={{ color: '#f7c5d5' }}>
                  {project.shayari.text}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xs" style={{ color: '#5a3a4a' }}>
                👁 {project.views} views
              </span>
              <span className="text-xs" style={{ color: '#3a2a3a' }}>•</span>
              <span className="font-dancing text-base" style={{ color: '#e8547a' }}>Made with LoveStory 💕</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a href="/" className="btn-rose text-sm">
            Create Your Own Love Story 🌹
          </a>
        </div>
      </motion.div>
    </div>
  )
}
