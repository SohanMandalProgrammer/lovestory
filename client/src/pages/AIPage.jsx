import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const BG_SCENES = {
  sunset:    { bg: 'linear-gradient(180deg,#ff6b35,#f7931e,#ffd700,#ff4500)',   text: '🌅 Golden light melts into the horizon, waves whispering your name as the sky bleeds rose and amber...' },
  paris:     { bg: 'linear-gradient(180deg,#1a1a2e,#16213e,#0f3460)',           text: '🗼 City lights twinkle like fallen stars, the Eiffel Tower glowing soft gold in the velvet Parisian night...' },
  forest:    { bg: 'linear-gradient(180deg,#0d4f2a,#1a6b3a,#2d8a4e)',           text: '🌿 Ancient trees weave a cathedral of leaves, filtered moonlight creating silver paths through the enchanted wood...' },
  stars:     { bg: 'linear-gradient(180deg,#0a0015,#1a0030,#2d0050)',           text: '⭐ A billion stars scattered like diamond dust, the Milky Way arching overhead as we stand small beneath infinity...' },
  rain:      { bg: 'linear-gradient(180deg,#1a2a3a,#2d3f50,#3d5060)',           text: '🌧️ Rain traces silver lines down the glass, the city below a blur of colors, the room warm with the scent of chai...' },
  petals:    { bg: 'linear-gradient(180deg,#3d0020,#6b0035,#8b1050)',           text: '🌹 A thousand rose petals drift on a gentle breeze, the air heavy with their sweetness...' },
  mountains: { bg: 'linear-gradient(180deg,#e8f4f8,#b0d4e8,#7ab0c8)',           text: '⛰️ Mist curls through ancient peaks, the world below disappearing as we stand together above the clouds...' },
}

export default function AIPage() {
  const [msg, setMsg] = useState({ fromName:'', toName:'', mood:'romantic', lang:'hinglish', detail:'' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [bgMood, setBgMood] = useState('sunset')
  const [bgVisible, setBgVisible] = useState(false)

  const generate = async () => {
    if (!msg.fromName || !msg.toName) { toast.error('Enter both names 💕'); return }
    setLoading(true); setOutput('')
    try {
      const r = await api.post('/ai/message', msg)
      setOutput(r.data.message)
      toast.success('✨ Message generated!')
    } catch {
      toast.error('AI unavailable — check ANTHROPIC_API_KEY')
    } finally { setLoading(false) }
  }

  const copy = () => { navigator.clipboard.writeText(output); toast('📋 Copied!') }

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Message generator */}
        <div className="glass-card">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#f7c5d5' }}>🤖 AI Love Message Generator</h1>
          <p className="text-xs mb-6" style={{ color: '#7a4a5a' }}>Powered by Claude AI — personalized just for you</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Their Name</label>
              <input type="text" className="input-field" placeholder="Priya, Rahul..."
                value={msg.toName} onChange={e => setMsg(p => ({ ...p, toName: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Your Name</label>
              <input type="text" className="input-field" placeholder="Arjun, Sara..."
                value={msg.fromName} onChange={e => setMsg(p => ({ ...p, fromName: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Mood</label>
              <select className="select-field w-full" value={msg.mood} onChange={e => setMsg(p => ({ ...p, mood: e.target.value }))}>
                <option value="romantic">Deeply Romantic 💕</option>
                <option value="cute">Sweet & Cute 🌸</option>
                <option value="poetic">Poetic Shayari 📜</option>
                <option value="funny">Playful & Funny 😄</option>
                <option value="anniversary">Anniversary 🎉</option>
                <option value="miss">Missing You 💔</option>
                <option value="propose">Proposal 💍</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Language</label>
              <select className="select-field w-full" value={msg.lang} onChange={e => setMsg(p => ({ ...p, lang: e.target.value }))}>
                <option value="hinglish">Hinglish (Hindi + English)</option>
                <option value="hindi">Pure Hindi</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Special Detail (optional)</label>
            <input type="text" className="input-field" placeholder="e.g. 2nd anniversary, met in college, loves sunsets..."
              value={msg.detail} onChange={e => setMsg(p => ({ ...p, detail: e.target.value }))} />
          </div>

          <button className="btn-rose" onClick={generate} disabled={loading}>
            {loading ? '✨ Crafting...' : '✨ Generate with AI'}
          </button>

          {(output || loading) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative mt-5 rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,83,0.2)', minHeight: 100 }}>
              {loading ? (
                <p className="text-sm" style={{ color: '#7a4a5a' }}>Writing your love message<span style={{ animation: 'blink 1s infinite' }}>...</span></p>
              ) : (
                <>
                  <p className="font-playfair text-base leading-8 whitespace-pre-line" style={{ color: '#f5e6ee' }}>{output}</p>
                  <button onClick={copy} className="absolute top-3 right-3 text-xs px-3 py-1 rounded-lg"
                    style={{ background: 'rgba(232,84,122,0.15)', border: '1px solid rgba(232,84,122,0.3)', color: '#e8547a' }}>
                    Copy 📋
                  </button>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Background generator */}
        <div className="glass-card">
          <h2 className="font-playfair text-xl mb-1" style={{ color: '#f7c5d5' }}>🌅 Romantic Scene Generator</h2>
          <p className="text-xs mb-5" style={{ color: '#7a4a5a' }}>Generate atmospheric background descriptions</p>
          <div className="flex gap-3 flex-wrap">
            <select className="select-field" value={bgMood} onChange={e => setBgMood(e.target.value)}>
              <option value="sunset">Golden Sunset Beach</option>
              <option value="paris">Parisian Night</option>
              <option value="forest">Enchanted Forest</option>
              <option value="stars">Starry Night Sky</option>
              <option value="rain">Rainy Window</option>
              <option value="petals">Rose Petal Garden</option>
              <option value="mountains">Misty Mountains</option>
            </select>
            <button className="btn-rose text-sm" onClick={() => setBgVisible(true)}>Generate 🌅</button>
          </div>
          {bgVisible && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl overflow-hidden">
              <div className="h-48 flex items-center justify-center p-6 text-center"
                style={{ background: BG_SCENES[bgMood].bg }}>
                <p className="font-playfair text-sm leading-7 text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                  {BG_SCENES[bgMood].text}
                </p>
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </main>
  )
}
