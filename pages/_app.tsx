import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Instrument_Serif, Instrument_Sans } from 'next/font/google'

// Self-hosted at build time by next/font: the browser never contacts Google.
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  // Next 14.0 has no metrics for this family; tuned fallbacks live in globals.css.
  adjustFontFallback: false,
})

const text = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useScrollReveal(router.asPath)
  usePointerGlow()

  return (
    <>
      <style jsx global>{`
        :root {
          --font-display: ${display.style.fontFamily}, 'Instrument Serif Fallback', ui-serif, 'Iowan Old Style', Georgia, serif;
          --font-text: ${text.style.fontFamily}, 'Instrument Sans Fallback', ui-sans-serif, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
      `}</style>
      <div className="page" key={router.pathname}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
