import Head from 'next/head'
import Link from 'next/link'
import { useRef } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../SiteFooter'
import type { LegalDoc } from '../../lib/flipLegal'
import { gsap, useGSAP, MQ } from '../../lib/motion'

// Shared layout for the Flip Privacy Policy and Terms of Use (Flip brand).
const LegalPage = ({ doc, description }: { doc: LegalDoc; description: string }) => {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('[data-in]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.7 })
        gsap.to('[data-readbar]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-doc]', start: 'top top', end: 'bottom bottom', scrub: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <div className={styles.container} ref={root}>
      <Head>
        <title>{`${doc.title} | Flip | puchka`}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#0a0a0c" />
      </Head>

      <span className={styles.readBar} data-readbar aria-hidden="true" />

      <nav className={styles.nav} aria-label="Flip">
        <Link href="/flip" className={styles.back}>
          <span aria-hidden="true">&larr;</span> Flip
        </Link>
        <span className={styles.navMark} aria-hidden="true">FLIP</span>
        <span />
      </nav>

      <main className={styles.main}>
        <article className={styles.doc} data-doc>
          <h1 data-in>{doc.title}</h1>
          <p className={styles.updated} data-in>{doc.lastUpdated}</p>
          <p className={styles.intro} data-in>{doc.intro}</p>
          {doc.sections.map((s, i) => (
            <section key={`${s.heading}-${i}`}>
              <h2>{s.heading}</h2>
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter flip />
    </div>
  )
}

export default LegalPage
