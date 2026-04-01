import { useEffect, useRef } from 'react'

const EMOJIS = ['💕', '💗', '✨', '🌸', '💖', '🌹', '💝', '🎀']

export default function FloatingHearts() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hearts = Array.from({ length: 20 }, (_, i) => {
      const el = document.createElement('div')
      el.textContent = EMOJIS[i % EMOJIS.length]
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        font-size:${14 + Math.random() * 16}px;
        opacity:0;
        pointer-events:none;
        animation: floatHeart ${8 + Math.random() * 12}s linear ${Math.random() * 10}s infinite;
      `
      return el
    })

    hearts.forEach(h => container.appendChild(h))

    const style = document.createElement('style')
    style.textContent = `
      @keyframes floatHeart {
        0%   { transform: translateY(100vh) rotate(0deg);   opacity: 0; }
        10%  { opacity: 0.35; }
        90%  { opacity: 0.1; }
        100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      hearts.forEach(h => h.remove())
      style.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  )
}
