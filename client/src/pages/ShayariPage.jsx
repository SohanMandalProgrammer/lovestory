import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const FALLBACK = [
  { _id:'1', text:'Tere bina zindagi se koi\nshikwa toh nahi,\nTere bina zindagi bhi lekin\nzindagi toh nahi.', author:'Gulzar', category:'romantic' },
  { _id:'2', text:'Tu hai toh sab hai yaar,\nBin tere ye dil bekar,\nTeri hansi meri dawai,\nTu hi mera sansar.', author:'Modern', category:'hinglish' },
  { _id:'3', text:'Tujhe dekha toh jaana sanam\nPyaar hota hai,\nTere bina ye dil\nBekarar rehta hain.', author:'Classic', category:'romantic' },
  { _id:'4', text:'Aansu aa gaye aankhon mein\ntujhe yaad karke aaj,\nKitna yaad karta hoon tujhe\nbata na sakta raaz.', author:'Classic', category:'sad' },
  { _id:'5', text:'Teri photo dekh ke\nhum toh blush ho gaye,\nYaar sach mein tere\nhum crush ho gaye! 😂', author:'Modern', category:'fun' },
  { _id:'6', text:'Chand taron ko chhoona hai\nmujhe teri aankhon mein,\nSaari duniya bata do tujhe\nmeri saanson mein.', author:'LoveStory', category:'romantic' },
  { _id:'7', text:'Baby you\'re my sunshine ☀️\nMeri har subah teri wajah se hai,\nTeri aankhon mein duniya dikhti hai\nAur dil mein teri jagah hai.', author:'Modern', category:'hinglish' },
  { _id:'8', text:'Tujhse dur rehna\nab nahi hota mujhse,\nDil ki ye baat sun\nsajna.', author:'LoveStory', category:'sad' },
  { _id:'9', text:'Khana khaya? Pani piya?\nNeend aai kya?\nBas ye sab poochha karta hoon\nkyunki tujhse pyaar jo hai! 🙈', author:'Modern', category:'fun' },
  { _id:'10', text:'Sitaaron se aage\njahan aur bhi hain,\nAbhi ishq ke imtihan\naur bhi hain.', author:'Iqbal', category:'romantic' },
  { _id:'11', text:'Mohabbat karne wale\nkam na honge,\nTeri mehfil mein lekin\nhum na honge.', author:'Classic', category:'romantic' },
  { _id:'12', text:'Agar tum na hote\nToh ye dil kya hota,\nTujhse hi to meetha\nYe zindagi ka dariya hota.', author:'Classic', category:'sad' },
]

const CATS = ['all','romantic','hinglish','sad','fun']
const FONTS = { playfair: '"Playfair Display", serif', dancing: '"Dancing Script", cursive', dm: '"DM Sans", sans-serif' }
const COLORS = { '#f5e6ee': 'Pearl', '#e8547a': 'Rose', '#d4a853': 'Gold', '#a8d8ea': 'Sky Blue' }

export default function ShayariPage() {
  const [shayaris, setShayaris] = useState(FALLBACK)
  const [cat, setCat] = useState('all')
  const [custom, setCustom] = useState('')
  const [font, setFont] = useState('playfair')
  const [color, setColor] = useState('#f5e6ee')
  const [preview, setPreview] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    api.get('/shayari').then(r => {
      if (r.data.shayaris?.length) setShayaris(r.data.shayaris)
    }).catch(() => {})
  }, [])

  const filtered = cat === 'all' ? shayaris : shayaris.filter(s => s.category === cat)

  const useShayari = (s) => {
    setCustom(s.text)
    setPreview(true)
    toast('✅ Shayari loaded into editor!')
  }

  const generateAI = async () => {
    setAiLoading(true)
    try {
      const r = await api.post('/ai/shayari', { theme: 'love and longing' })
      setCustom(r.data.shayari)
      setPreview(true)
      toast.success('✨ AI shayari generated!')
    } catch {
      toast.error('AI unavailable — check your API key')
    } finally {
      setAiLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(custom)
    toast('📋 Copied to clipboard!')
  }

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Collection */}
        <div className="glass-card">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#f7c5d5' }}>📜 Shayari Collection</h1>
          <p className="text-xs mb-5" style={{ color: '#7a4a5a' }}>Tap any shayari to load into editor</p>

          <div className="flex flex-wrap gap-1 mb-5">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`tag capitalize ${cat === c ? 'active' : ''}`}>
                {c === 'all' ? 'All ✨' : c === 'romantic' ? 'Romantic 💕' : c === 'hinglish' ? 'Hinglish 🌸' : c === 'sad' ? 'Emotional 💧' : 'Playful 😄'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(s => (
              <motion.div key={s._id}
                whileHover={{ y: -3, borderColor: 'rgba(232,84,122,0.5)' }}
                onClick={() => useShayari(s)}
                className="rounded-2xl p-5 cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,84,122,0.15)' }}>
                <p className="font-playfair text-sm leading-8 mb-3 whitespace-pre-line" style={{ color: '#f5e6ee' }}>
                  {s.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#7a4a5a' }}>— {s.author}</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#e8547a' }}>
                    Use this ✨
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom editor */}
        <div className="glass-card">
          <h2 className="font-playfair text-xl mb-1" style={{ color: '#f7c5d5' }}>✍️ Write Custom Shayari</h2>
          <p className="text-xs mb-5" style={{ color: '#7a4a5a' }}>Craft your own or let AI help</p>

          <textarea className="input-field resize-none mb-4" rows={5}
            placeholder={"Dil ki baat kaho yahan...\nTere bina ye zindagi adhoori hai..."}
            value={custom} onChange={e => setCustom(e.target.value)} />

          <div className="flex gap-3 flex-wrap mb-4">
            <select className="select-field" value={font} onChange={e => setFont(e.target.value)}>
              <option value="playfair">Playfair Display</option>
              <option value="dancing">Dancing Script</option>
              <option value="dm">DM Sans</option>
            </select>
            <select className="select-field" value={color} onChange={e => setColor(e.target.value)}>
              {Object.entries(COLORS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button className="btn-rose text-sm" onClick={() => { if (!custom) { toast('Write something first!'); return; } setPreview(true) }}>
              Preview ✨
            </button>
            <button className="btn-gold text-sm" onClick={generateAI} disabled={aiLoading}>
              {aiLoading ? 'Generating...' : '🤖 AI Write'}
            </button>
          </div>

          {preview && custom && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl p-8 text-center mb-4"
                style={{ background: 'linear-gradient(135deg,rgba(232,84,122,0.08),rgba(212,168,83,0.04))', border: '1px solid rgba(232,84,122,0.2)' }}>
                <p style={{ fontFamily: FONTS[font], color, fontSize: '18px', lineHeight: 2, whiteSpace: 'pre-line' }}>
                  {custom}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="btn-rose text-sm" onClick={copy}>Copy 📋</button>
              </div>
            </motion.div>
          )}
        </div>

      </motion.div>
    </main>
  )
}
