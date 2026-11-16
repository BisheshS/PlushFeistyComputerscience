import { useEffect, useRef, type MutableRefObject } from 'react'
import { reducedMotion } from '../../lib/motion'

// The Flip "UrgeWave": layered sine waves. heat 1 = ember, tall, fast (an urge).
// heat 0 = volt, low, calm (the win). Mirrors the app's UrgeWave component.
const EMBER = [255, 91, 46]
const VOLT = [200, 255, 61]

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

const UrgeWave = ({ heat, className }: { heat: MutableRefObject<number>; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let raf = 0
    let visible = true
    let phase = 0
    const still = reducedMotion()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const t = Math.max(0, Math.min(1, heat.current))
      ctx.clearRect(0, 0, w, h)
      const [r, g, b] = mix(VOLT, EMBER, t)
      const layers = 3
      for (let l = 0; l < layers; l++) {
        const amp = (6 + t * 46) * (1 - l * 0.22)
        const freq = (1.2 + t * 2.4 + l * 0.35) / w
        const speed = 1 + l * 0.4
        const base = h * (0.56 + l * 0.13)
        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w; x += 6) {
          const y =
            base +
            Math.sin(x * freq * Math.PI * 2 + phase * speed + l) * amp +
            Math.sin(x * freq * Math.PI * 5.3 - phase * 1.7) * amp * 0.18 * t
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.07 + l * 0.06})`
        ctx.fill()
      }
    }

    const loop = () => {
      phase += 0.012 + heat.current * 0.03
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    draw()
    if (!still) raf = requestAnimationFrame(loop)

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [heat])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

export default UrgeWave
