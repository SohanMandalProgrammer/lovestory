import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const DEFAULT_QS = [
  { question: "What's my favorite color?", options: ['Blue 💙', 'Pink 🌸', 'Red ❤️', 'Purple 💜'], correctIndex: 1 },
  { question: 'Where do I love to go on a date?', options: ['Beach 🌊', 'Cinema 🎬', 'Restaurant 🍽️', 'Park 🌳'], correctIndex: 0 },
  { question: "What's my biggest dream?", options: ['Travel the world 🌍', 'Start a business 💼', 'Be a musician 🎵', 'Write a book 📚'], correctIndex: 0 },
  { question: 'My favorite cuisine is?', options: ['Italian 🍕', 'Indian 🍛', 'Chinese 🥢', 'Mexican 🌮'], correctIndex: 1 },
  { question: 'What do I do when stressed?', options: ['Listen to music 🎵', 'Go for a walk 🚶', 'Call you 📞', 'Watch Netflix 📺'], correctIndex: 2 },
]

export default function QuizPage() {
  const [step, setStep] = useState('build') // build | saved
  const [creatorName, setCreatorName] = useState('')
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState(DEFAULT_QS)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(null)
  const [saving, setSaving] = useState(false)

  const updateQ = (i, field, val) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q))
  }
  const updateOpt = (qi, oi, val) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx !== qi) return q
      const opts = [...q.options]
      opts[oi] = val
      return { ...q, options: opts }
    }))
  }

  const generateAI = async () => {
    if (!creatorName) { toast.error('Enter your name first!'); return }
    setAiLoading(true)
    try {
      const r = await api.post('/ai/quiz-questions', { creatorName })
      setQuestions(r.data.questions)
      toast.success('🤖 AI generated 5 questions!')
    } catch {
      toast.error('AI unavailable — using default questions')
    } finally { setAiLoading(false) }
  }

  const saveQuiz = async () => {
    if (!creatorName) { toast.error('Enter your name!'); return }
    if (!title) { toast.error('Give your quiz a title!'); return }
    setSaving(true)
    try {
      const r = await api.post('/quiz', { title, creatorName, questions })
      setSaved(r.data.quiz)
      setStep('saved')
      toast.success('💝 Quiz saved!')
    } catch {
      toast.error('Failed to save — are you logged in?')
    } finally { setSaving(false) }
  }

  const shareLink = saved ? `${window.location.origin}/quiz/play/${saved.slug}` : ''

  if (step === 'saved') return (
    <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="glass-card text-center py-12">
          <div className="text-5xl mb-4">💝</div>
          <h2 className="font-playfair text-2xl mb-2" style={{ color: '#f7c5d5' }}>Quiz is Live!</h2>
          <p className="text-sm mb-6" style={{ color: '#7a4a5a' }}>Share this link with your special someone:</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input readOnly className="input-field text-xs" value={shareLink} />
            <button className="btn-rose text-xs shrink-0" onClick={() => {
              navigator.clipboard.writeText(shareLink)
              toast.success('🔗 Link copied!')
            }}>Copy</button>
          </div>
          <button className="btn-ghost mt-6 text-sm" onClick={() => { setStep('build'); setSaved(null) }}>
            Create Another
          </button>
        </div>
      </motion.div>
    </main>
  )

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div className="glass-card">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#f7c5d5' }}>💝 Love Quiz Creator</h1>
          <p className="text-xs mb-6" style={{ color: '#7a4a5a' }}>How well does your special someone know you?</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Your Name *</label>
              <input type="text" className="input-field" placeholder="Arjun, Sara..."
                value={creatorName} onChange={e => setCreatorName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#7a4a5a' }}>Quiz Title *</label>
              <input type="text" className="input-field" placeholder="How well do you know me? 💕"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="btn-gold text-sm" onClick={generateAI} disabled={aiLoading}>
              {aiLoading ? '🤖 Generating...' : '🤖 AI Generate Questions'}
            </button>
          </div>
        </div>

        {/* Questions editor */}
        <div className="glass-card">
          <h2 className="font-playfair text-xl mb-5" style={{ color: '#f7c5d5' }}>✏️ Edit Questions</h2>
          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,84,122,0.12)' }}>
                <div className="text-xs mb-2" style={{ color: '#e8547a' }}>Question {qi + 1}</div>
                <input type="text" className="input-field mb-3 text-sm"
                  value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex gap-1.5 items-center">
                      <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi}
                        onChange={() => updateQ(qi, 'correctIndex', oi)}
                        className="accent-rose-primary shrink-0" />
                      <input type="text" className="input-field text-xs py-2"
                        value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} />
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: '#7a4a5a' }}>🟢 Radio = correct answer</p>
              </div>
            ))}
          </div>
          <button className="btn-rose mt-5" onClick={saveQuiz} disabled={saving}>
            {saving ? 'Saving...' : '💝 Save & Share Quiz'}
          </button>
        </div>

      </motion.div>
    </main>
  )
}
