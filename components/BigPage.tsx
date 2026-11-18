import Head from 'next/head'
import Link from 'next/link'
import { useRef, type ReactNode } from 'react'
import SiteFooter from './SiteFooter'
import Magnetic from './Magnetic'
import ParticleField from './ParticleField'
import { gsap, useGSAP, MQ } from '../lib/motion'
import styles from '../styles/Contact.module.css'

type Props = {
  title: string
  description?: string
  noindex?: boolean
  kicker: string
  /** Big headline, split into letters for the entrance. */
  headline: string
  lede?: ReactNode
  cta: { href: string; label: string; cursor?: string }
}

// puchka-brand single-message page (contact, 404): huge serif headline + one CTA.
const BigPage = ({ title, description, noindex, kicker, headline, lede, cta }: Props) => {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ delay: 0.75 })
          .from('[data-char]', { yPercent: 120, rotate: 8, duration: 1.2, ease: 'expo.out', stagger: 0.035 })
          .from('[data-in]', { y: 26, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=0.9')
      })
    },
    { scope: root }
  )

  return (
    <div className={styles.container} ref={root} data-pf-dark>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {noindex && <meta name="robots" content="noindex" />}
      </Head>

      <ParticleField />
      <div className={styles.pfAnchor} data-pf-ribbon aria-hidden="true" />

      <nav className={styles.nav} aria-label="Main">
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">&larr;</span> puchka
        </Link>
      </nav>

      <main className={styles.main}>
        <p className={styles.kicker} data-in>{kicker}</p>
        <h1 className={styles.title}>
          <span className="sr-only">{headline}</span>
          <span aria-hidden="true">
            {headline.split(' ').map((word, w) => (
              <span className={styles.word} key={w}>
                {word.split('').map((ch, i) => (
                  <span className={styles.mask} key={i}>
                    <span data-char>{ch}</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>
        {lede && <p className={styles.lede} data-in>{lede}</p>}
        <div data-in>
          <Magnetic strength={0.4}>
            <a className={styles.pill} href={cta.href} data-cursor={cta.cursor}>
              <span>{cta.label}</span>
              <span className={styles.pillArrow} aria-hidden="true">&rarr;</span>
            </a>
          </Magnetic>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default BigPage
