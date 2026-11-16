import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { EB_Garamond, Figtree, Instrument_Sans, Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import Cursor from '../components/Cursor'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion'

// Self-hosted at build time by next/font: the browser never contacts Google.
// puchka type, the Wispr Flow way: a serif for headlines (italic for the accent),
// a clean sans for UI and body, and a mono (IBM Plex Mono, below) for small labels.
const display = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const ui = Figtree({
  subsets: ['latin'],
  display: 'swap',
})

const text = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

// Flip brand type: Archivo with the width axis (expanded heavy for display).
const flip = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
})

// Fleet brand type (from fleetapp.in): IBM Plex Sans and IBM Plex Mono.
const fleetSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' })
const fleetMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

// Reveal [data-reveal] elements as they scroll into view.
function useScrollReveal(key: string) {
  useEffect(() => {
    ;(window as unknown as { __puchkaReveal?: boolean }).__puchkaReveal = true
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (!els.length) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

// Soft light that follows a mouse pointer over [data-glow] cards.
function usePointerGlow() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element | null)?.closest?.('[data-glow]') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}

// Inertia scrolling (Lenis) driven by the GSAP ticker, so ScrollTrigger stays in sync.
function useSmoothScroll(path: string) {
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion()) return
    const l = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      lenis.current = null
    }
  }, [])

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [path])
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const brand = router.pathname.startsWith('/flip') ? 'flip' : 'puchka'
  useScrollReveal(router.asPath)
  usePointerGlow()
  useSmoothScroll(router.pathname)

  useEffect(() => {
    document.documentElement.dataset.brand = brand
  }, [brand])

  return (
    <>
      <style jsx global>{`
        :root {
          --font-display: ${display.style.fontFamily}, ui-serif, 'Iowan Old Style', Georgia, serif;
          --font-ui: ${ui.style.fontFamily}, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --font-text: ${text.style.fontFamily}, 'Instrument Sans Fallback', ui-sans-serif, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          --font-flip: ${flip.style.fontFamily}, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial,
            sans-serif;
          --font-fleet: ${fleetSans.style.fontFamily}, ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif;
          --font-fleet-mono: ${fleetMono.style.fontFamily}, ui-monospace, 'SF Mono', Menlo, monospace;
        }
      `}</style>
      {/* Page curtain: lifts on every route change (and on first load). */}
      <div className="curtain" data-brand={brand} key={`curtain-${router.pathname}`} aria-hidden="true">
        <span className="curtain-word">{brand === 'flip' ? 'FLIP' : 'puchka'}</span>
      </div>
      <div className="page" key={router.pathname}>
        <Component {...pageProps} />
      </div>
      <Cursor />
    </>
  )
}

export default MyApp
