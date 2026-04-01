import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../hooks/useAuthStore'

const TEMPLATES = [
  { id: 'instagram', name: 'Instagram Love Post', icon: '📸', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', badge: 'Popular' },
  { id: 'story',     name: 'Story Mode',           icon: '📖', bg: 'linear-gradient(135deg,#0f3443,#34e89e)', badge: null },
  { id: 'letter',    name: 'Romantic Letter',       icon: '💌', bg: 'linear-gradient(135deg,#2d1020,#d4a853)', badge: null },
  { id: 'proposal',  name: 'Proposal Page',         icon: '💍', bg: 'linear-gradient(135deg,#1a0a10,#e8547a)', badge: '✨ New' },
  { id: 'neon',      name: 'Neon Glow',             icon: '✨', bg: 'linear-gradient(135deg,#0a0010,#7700ff)', badge: null },
  { id: 'pastel',    name: 'Soft Pastel',           icon: '🌸', bg: 'linear-gradient(135deg,#fce4ec,#f48fb1)', badge: null },
]

export default function TemplatesPage() {
  const { user } = useAuthStore()
  const [selected, setSelected] = useState(null)
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)

  const onDrop = useCallback(async (files) => {
    setUploading(true)
    const form = new FormData()
    files.slice(0, 5).forEach(f => form.append('photos', f))
    try {
      const r = await api.post('/upload/photos', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setPhotos(prev => [...prev, ...r.data.photos])
      toast.success(`📸 ${r.data.photos.length} photo(s) uploaded!`)
    } catch {
      // Fallback: preview locally without uploading
      files.slice(0, 5).forEach(file => {
        const reader = new FileReader()
        reader.onload = e => setPhotos(prev => [...prev, { url: e.target.result, publicId: null }])
        reader.readAsDataURL(file)
      })
      toast('📸 Photos loaded locally (no cloud storage configured)')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 5
  })

  const saveProject = async () => {
    if (!selected) { toast.error('Pick a template first!'); return }
    if (!title) { toast.error('Give your love page a title ✨'); return }
    setSaving(true)
    try {
      const r = await api.post('/projects', { title, template: selected, photos, loveMessage: message })
      setSaved(r.data.project)
      toast.success('💕 Love page saved!')
    } catch {
      toast.error('Save failed — are you logged in?')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${saved.slug}`)
    toast.success('🔗 Share link copied!')
  }

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Template picker */}
        <div className="glass-card">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#f7c5d5' }}>🎨 Choose Template</h1>
          <p className="text-xs mb-5" style={{ color: '#7a4a5a' }}>Select a style for your love page</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <motion.div key={t.id} whileHover={{ y: -3 }}
                onClick={() => setSelected(t.id)}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{ border: selected === t.id ? '2px solid #e8547a' : '2px solid transparent',
                  boxShadow: selected === t.id ? '0 0 25px rgba(232,84,122,0.35)' : 'none' }}>
                <div className="h-36 flex flex-col items-center justify-center relative text-white"
                  style={{ background: t.bg }}>
                  <span className="text-3xl">{t.icon}</span>
                  {t.badge && (
                    <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(212,168,83,0.9)' }}>{t.badge}</span>
                  )}
                </div>
                <div className="px-3 py-2 text-xs font-medium" style={{ background: 'rgba(26,10,16,0.9)', color: '#f5e6ee' }}>
                  {t.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div className="glass-card">
          <h2 className="font-playfair text-xl mb-1" style={{ color: '#f7c5d5' }}>📸 Couple Photos</h2>
          <p className="text-xs mb-5" style={{ color: '#7a4a5a' }}>Up to 5 photos (drag & drop supported)</p>

          <div {...getRootProps()} className="rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
            style={{ border: `2px dashed ${isDragActive ? '#e8547a' : 'rgba(232,84,122,0.35)'}`,
              background: isDragActive ? 'rgba(232,84,122,0.08)' : 'rgba(232,84,122,0.02)' }}>
            <input {...getInputProps()} />
            <div className="text-4xl mb-3">📷</div>
            <p className="text-sm mb-1" style={{ color: '#f5e6ee' }}>
              {isDragActive ? 'Drop your photos here! 💕' : 'Drag & drop photos or click to browse'}
            </p>
            <p className="text-xs" style={{ color: '#7a4a5a' }}>JPG, PNG, WEBP • Max 5MB each</p>
            {uploading && <p className="text-xs mt-3" style={{ color: '#e8547a' }}>Uploading... ⏳</p>}
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
              {photos.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group"
                  style={{ border: '1px solid rgba(232,84,122,0.3)' }}>
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(192,48,96,0.9)' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & save */}
        <div className="glass-card">
          <h2 className="font-playfair text-xl mb-5" style={{ color: '#f7c5d5' }}>💾 Save Your Love Page</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Page Title *</label>
              <input type="text" className="input-field" placeholder="Our Love Story ✨"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Love Message (optional)</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="Write something from the heart..."
                value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <button className="btn-rose" onClick={saveProject} disabled={saving}>
              {saving ? 'Saving...' : '💕 Save & Share'}
            </button>
          </div>

          {saved && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(232,84,122,0.08)', border: '1px solid rgba(232,84,122,0.3)' }}>
              <p className="text-sm mb-3" style={{ color: '#f5e6ee' }}>✅ Your love page is live!</p>
              <div className="flex gap-2">
                <input readOnly className="input-field text-xs"
                  value={`${window.location.origin}/s/${saved.slug}`} />
                <button className="btn-rose text-xs shrink-0" onClick={copyLink}>Copy</button>
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </main>
  )
}
