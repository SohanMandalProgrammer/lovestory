import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const SCORE_MSGS = [
  { min: 100, msg: 'You know me perfectly! ❤️', sub: 'Sach mein perfect match ho tum! 😍' },
  { min: 80,  msg: 'Almost perfect! 🌟',        sub: 'Bahut accha jaante ho mujhe! 💕' },
  { min: 60,  msg: 'Pretty good! 😊',            sub: 'Aur thoda jaan lo — kaafi accha hai! 🌸' },
  { min: 40,  msg: 'Thoda aur jaan lo 😅',       sub: 'Ab hum aur time spend karein? 😄' },
  { min: 0,   msg: 'Abhi toh shuruwat hai! 🙈',  sub: 'Koi baat nahi, sab seekh loge! 💝' },
]

export default function QuizPlayPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('intro') // intro | play | result
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/quiz/${slug}`).then(r => { setQuiz(r.data.quiz); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [slug])

  const answer = (oi) => {
    if (selected !== null) return
    setSelected(oi)
  }

  const next = async () => {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)

    if (idx + 1 < quiz.questions.length) {
      setIdx(i => i + 1)
    } else {
      // Submit
      setSubmitting(true)
      try {
        const r = await api.post(`/quiz/${slug}/submit`, { answers: newAnswers })
        setResult(r.data)
        setStep('result')
      } catch {
        toast.error('Submission failed')
      } finally { setSubmitting(false) }
    }
  }

  if (loading) return <div className="text-center py-20 relative z-10" style={{ color: '#7a4a5a' }}>Loading quiz... 💕</div>
  if (!quiz) return <div className="text-center py-20 relative z-10" style={{ color: '#e8547a' }}>Quiz not found 💔</div>

  const pct = result ? result.score : Math.round((idx / quiz.questions.length) * 100)
  const scoreMsg = result ? SCORE_MSGS.find(m => result.score >= m.min) : null

  return (
    <main className="relative z-10 max-w-xl mx-auto px-4 py-10">

      {step === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card text-center py-12">
            <div className="text-5xl mb-5">💝</div>
            <h1 className="font-playfair text-2xl mb-2" style={{ color: '#f7c5d5' }}>{quiz.title}</h1>
            <p className="text-sm mb-2" style={{ color: '#7a4a5a' }}>Created by {quiz.creatorName}</p>
            <p className="text-sm mb-8" style={{ color: '#7a4a5a' }}>{quiz.questions.length} questions • How well do you really know them?</p>
            <button className="btn-rose" onClick={() => setStep('play')}>Start Quiz 💕</button>
          </div>
        </motion.div>
      )}

      {step === 'play' && quiz.questions[idx] && (
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="glass-card">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs" style={{ color: '#7a4a5a' }}>{idx + 1} / {quiz.questions.length}</span>
              <span className="text-xs" style={{ color: '#7a4a5a' }}>{pct}%</span>
            </div>
            <div className="rounded-full h-1.5 mb-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#e8547a,#d4a853)' }}
                animate={{ width: `${((idx) / quiz.questions.length) * 100}%` }} />
            </div>

            <p className="text-xs mb-2" style={{ color: '#e8547a' }}>Question {idx + 1}</p>
            <p className="font-playfair text-lg mb-6" style={{ color: '#f5e6ee' }}>{quiz.questions[idx].question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quiz.questions[idx].options.map((opt, oi) => (
                <motion.button key={oi} whileTap={{ scale: 0.97 }}
                  onClick={() => answer(oi)}
                  className="text-left rounded-xl px-4 py-3 text-sm transition-all duration-200"
                  style={{
                    background: selected === oi ? 'rgba(232,84,122,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selected === oi ? 'rgba(232,84,122,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    color: selected === oi ? '#f5e6ee' : '#c09aaa',
                    cursor: selected !== null ? 'default' : 'pointer',
                  }}>
                  {opt}
                </motion.button>
              ))}
            </div>

            {selected !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
                <button className="btn-rose w-full" onClick={next} disabled={submitting}>
                  {submitting ? 'Submitting...' : idx + 1 === quiz.questions.length ? 'See Results 🎉' : 'Next Question →'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {step === 'result' && result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="glass-card text-center py-12">
            <div className="text-4xl mb-3">💝</div>
            <div className="font-playfair mb-3" style={{ fontSize: '72px', background: 'linear-gradient(135deg,#e8547a,#d4a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {result.score}%
            </div>
            <p className="text-lg font-medium mb-2" style={{ color: '#f5e6ee' }}>{scoreMsg?.msg}</p>
            <p className="text-sm mb-2" style={{ color: '#7a4a5a' }}>{scoreMsg?.sub}</p>
            <p className="text-xs mt-4" style={{ color: '#7a4a5a' }}>
              {result.correct} out of {result.total} correct
            </p>
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <button className="btn-rose" onClick={() => { setStep('play'); setIdx(0); setAnswers([]); setSelected(null); setResult(null) }}>
                Try Again 🔄
              </button>
              <button className="btn-ghost text-sm" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('🔗 Link copied!')
              }}>Share Quiz</button>
            </div>
          </div>
        </motion.div>
      )}

    </main>
  )
}
