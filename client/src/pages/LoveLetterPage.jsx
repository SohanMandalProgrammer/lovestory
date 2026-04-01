import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const PETAL_EMOJIS = ['🌸', '🌹', '💕', '✨', '💗']

function PetalRain() {
  const containerRef = useRef(null)
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const petals = Array.from({ length: 14 }, () => {
      const el = document.createElement('div')
      el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)]
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 90 + 5}%;
        font-size:${12 + Math.random() * 10}px;
        opacity:0;
        pointer-events:none;
        animation: petalFall ${4 + Math.random() * 6}s linear ${Math.random() * 4}s infinite;
      `
      return el
    })
    const style = document.createElement('style')
    style.textContent = `
      @keyframes petalFall {
        0%   { transform:translateY(-20px) rotate(0deg);   opacity:0; }
        10%  { opacity:0.7; }
        90%  { opacity:0.3; }
        100% { transform:translateY(500px) rotate(720deg); opacity:0; }
      }
    `
    document.head.appendChild(style)
    petals.forEach(p => c.appendChild(p))
    return () => { petals.forEach(p => p.remove()); style.remove() }
  }, [])
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
}

function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!text) return
    setDisplayed(''); setDone(false)
    let i = 0
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return { displayed, done }
}

export default function LoveLetterPage() {
  const [form, setForm] = useState({ to: '', from: '', body: '' })
  const [letterData, setLetterData] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const letterRef = useRef(null)
  const { displayed, done } = useTypewriter(letterData?.body || '', 20)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const openLetter = () => {
    if (!form.body.trim()) { toast.error('Write your message first 💌'); return }
    if (!form.to || !form.from) { toast.error('Enter both names!'); return }
    setLetterData({ ...form, date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) })
    setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const generateAI = async () => {
    if (!form.to || !form.from) { toast.error('Enter both names first!'); return }
    setAiLoading(true)
    try {
      const r = await api.post('/ai/letter', { fromName: form.from, toName: form.to })
      setForm(p => ({ ...p, body: r.data.letter }))
      toast.success('✨ AI wrote your letter!')
    } catch {
      const fallback = `${form.to}, tum meri zindagi ki wo dhun ho jo kabhi khatam nahi hoti. Har subah teri yaad ke saath uthta hoon, aur raat ko teri soch ke saath neend aati hai. Ye duniya kitni bhi badi ho, tujhse milke lagta hai sab mil gaya. Tum mere liye sirf ek naam nahi — ek poori duniya ho. 💕`
      setForm(p => ({ ...p, body: fallback }))
      toast('Using sample letter (add ANTHROPIC_API_KEY for AI)')
    } finally { setAiLoading(false) }
  }

  const shareLetter = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('🔗 Letter link copied!')
  }

  return (
    <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Compose */}
        <div className="glass-card">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#f7c5d5' }}>💌 Love Letter Studio</h1>
          <p className="text-xs mb-6" style={{ color: '#7a4a5a' }}>Compose an animated romantic letter with petal rain ✨</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>To (their name) *</label>
              <input type="text" className="input-field" placeholder="My Love, Priya..." value={form.to} onChange={set('to')} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>From (your name) *</label>
              <input type="text" className="input-field" placeholder="Forever Yours, Arjun..." value={form.from} onChange={set('from')} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Your Message *</label>
            <textarea className="input-field resize-none" rows={6}
              placeholder={"Write your heart out...\nTere bina ye dil adhura hai, aur har saans mein teri yaad hai..."}
              value={form.body} onChange={set('body')} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="btn-rose" onClick={openLetter}>💌 Open Letter</button>
            <button className="btn-gold text-sm" onClick={generateAI} disabled={aiLoading}>
              {aiLoading ? '✨ Writing...' : '✨ AI Write for Me'}
            </button>
          </div>
        </div>

        {/* Letter display */}
        {letterData && (
          <motion.div ref={letterRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative rounded-2xl overflow-hidden mb-4" style={{
              minHeight: 480,
              background: 'linear-gradient(135deg,#1a0510 0%,#2a0a18 50%,#1a0520 100%)',
              border: '1px solid rgba(212,168,83,0.3)',
            }}>
              {/* Radial glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(212,168,83,0.07),transparent 55%)' }} />

              <PetalRain />

              <div className="relative z-10 px-8 py-12 sm:px-14">
                {/* Date */}
                <p className="text-xs mb-8 text-center tracking-widest uppercase" style={{ color: '#5a3a4a' }}>
                  {letterData.date}
                </p>

                {/* Greeting */}
                <p className="font-dancing text-3xl sm:text-4xl mb-8 text-center" style={{ color: '#d4a853' }}>
                  My Dearest {letterData.to} 💌
                </p>

                {/* Body with typewriter */}
                <div className="font-playfair text-base sm:text-lg leading-9 text-center max-w-lg mx-auto"
                  style={{ color: '#f5e6ee', minHeight: 120 }}>
                  {displayed.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < displayed.split('\n').length - 1 && <br />}</span>
                  ))}
                  {!done && <span className="cursor-blink" />}
                </div>

                {/* Sign-off */}
                {done && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-center mt-10">
                    <p className="font-dancing text-2xl" style={{ color: '#d4a853' }}>
                      Forever yours,
                    </p>
                    <p className="font-dancing text-3xl mt-1" style={{ color: '#e8547a' }}>
                      {letterData.from} 💝
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="btn-rose text-sm" onClick={shareLetter}>Share 🔗</button>
              <button className="btn-ghost text-sm" onClick={() => window.print()}>Print 🖨️</button>
              <button className="btn-ghost text-sm" onClick={() => setLetterData(null)}>Edit ✏️</button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </main>
  )
}
