import { useEffect, useRef, useState } from 'react'
import { gsap, finePointer, reducedMotion } from '../lib/motion'

// A soft follower cursor (mouse only). It grows over links and buttons,
// and shows a word when the target has data-cursor="word".
const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || reducedMotion()) return
    const html = document.documentElement
    html.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    let active: Element | null = null

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      xTo(e.clientX)
      yTo(e.clientY)
      el.dataset.visible = 'true'
      const t = (e.target as Element | null)?.closest?.('a, button, [data-cursor]') ?? null
      if (t !== active) {
        active = t
        const word = t?.getAttribute('data-cursor') ?? ''
        el.dataset.state = word ? 'label' : t ? 'hover' : 'idle'
        setLabel(word)
      }
    }
    const leave = () => (el.dataset.visible = 'false')
    const down = () => (el.dataset.down = 'true')
    const up = () => (el.dataset.down = 'false')

    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerdown', down)
    document.addEventListener('pointerup', up)
    html.addEventListener('pointerleave', leave)
    return () => {
      html.classList.remove('has-cursor')
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup', up)
      html.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className="cursor" data-visible="false" data-state="idle" aria-hidden="true">
      <span className="cursor-ball">
        <span className="cursor-label">{label}</span>
      </span>
    </div>
  )
}

export default Cursor
