import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRef, type CSSProperties } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../../components/SiteFooter'
import Marquee from '../../components/Marquee'
import Magnetic from '../../components/Magnetic'
import UrgeWave from '../../components/flip/UrgeWave'
import FlipDemo, { ChallengeCard } from '../../components/flip/FlipDemo'
import { gsap, useGSAP, useTilt, MQ } from '../../lib/motion'
import { FLIP_SUPPORT_EMAIL } from '../../lib/flip'

const order = (i: number) => ({ '--i': i } as CSSProperties)

const steps = [
  { title: 'Feel an urge', text: 'A craving hits. Open Flip instead of giving in.' },
  { title: 'Get dealt a challenge card', text: 'Tap Flip and a quick exercise challenge is dealt to you.' },
  { title: 'Do it and watch the urge pass', text: 'Finish the reps and see how the urge fades.' },
]

const proFeatures = [
  'More than one habit',
  'Full history and every chart, plus the monthly Wrapped',
  'All share cards',
  'Widgets, Control Center and Live Activity',
]

const plans = [
  { name: 'Yearly', price: '$29.99', per: 'per year', note: '7 days free, then $29.99 a year. Renews automatically until you cancel.' },
  { name: 'Monthly', price: '$6.99', per: 'per month', note: 'Renews automatically until you cancel.' },
  { name: 'Lifetime', price: '$59.99', per: 'one time', note: 'One payment. Not a subscription.' },
]

const zeros = ['accounts', 'servers', 'analytics']

const FlipPage: NextPage = () => {
  const root = useRef<HTMLDivElement>(null)
  const heat = useRef(1)
  useTilt(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        // Hero: headline lines rise out of masks, then the demo pops in.
        gsap
          .timeline({ delay: 0.75 })
          .from('[data-line]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.09 })
          .from('[data-hero-fade]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=0.9')
          .from('[data-demo]', { scale: 0.6, autoAlpha: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' }, '-=1')

        // How it works: pinned. The card flips, heat turns to cool, steps light up in turn.
        const how = gsap.timeline({
          scrollTrigger: { trigger: '[data-how]', start: 'top top', end: '+=220%', pin: true, scrub: 0.6 },
        })
        how
          .set('[data-step]', { opacity: 0.22 })
          .to('[data-step="0"]', { opacity: 1, duration: 0.3 }, 0)
          .fromTo('[data-meter-fill]', { scaleX: 0.85, backgroundColor: '#ff5b2e' }, { scaleX: 0.85, duration: 0.3 }, 0)
          .to('[data-step="0"]', { opacity: 0.22, duration: 0.2 }, 1)
          .to('[data-step="1"]', { opacity: 1, duration: 0.2 }, 1)
          .fromTo('[data-how-card]', { rotationY: 0, rotation: -6, y: 16 }, { rotationY: 180, rotation: 3, y: 0, duration: 1, ease: 'power2.inOut' }, 0.9)
          .to('[data-step="1"]', { opacity: 0.22, duration: 0.2 }, 2)
          .to('[data-step="2"]', { opacity: 1, duration: 0.2 }, 2)
          .to('[data-meter-fill]', { scaleX: 0.15, backgroundColor: '#c8ff3d', duration: 1, ease: 'power2.inOut' }, 2)
          .to('[data-how-heat]', { opacity: 0, duration: 1 }, 1.6)
          .to('[data-how-cool]', { opacity: 1, duration: 1 }, 1.6)
          .to('[data-progress]', { scaleY: 1, ease: 'none', duration: 3 }, 0)

        // A look inside: vertical scroll drives a horizontal strip of screens.
        const track = document.querySelector<HTMLElement>('[data-track]')
        if (track) {
          const shots = track.parentElement as HTMLElement
          shots.style.overflow = 'visible'
          const distance = () => track.scrollWidth - window.innerWidth + 32
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-inside]',
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          gsap.to('[data-inside-word]', {
            xPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: '[data-inside]', start: 'top bottom', end: () => `+=${distance() + window.innerHeight * 2}`, scrub: true },
          })
          return () => {
            shots.style.overflow = ''
          }
        }
      })

      // Zero counters: 100 -> 0 once, in view. Reduced motion shows 0 straight away.
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-zero]').forEach((el, i) => {
          const o = { v: 100 }
          el.textContent = '100'
          gsap.to(o, {
            v: 0,
            duration: 1.6,
            delay: i * 0.15,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = String(Math.round(o.v))
            },
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope: root }
  )

  return (
    <div className={styles.container} ref={root}>
      <Head>
        <title>Flip | puchka</title>
        <meta name="description" content="Flip turns cravings into reps. Feel an urge, tap Flip, do a quick exercise challenge and watch the urge pass. Free to download, with a 7-day free trial of Flip Pro. Pricing, support, privacy and terms." />
        <meta name="theme-color" content="#0a0a0c" />
      </Head>

      <nav className={styles.nav} aria-label="Flip">
        <Link href="/" className={styles.back}>
          <span aria-hidden="true">&larr;</span> puchka
        </Link>
        <span className={styles.navMark} aria-hidden="true">FLIP</span>
        <a
          className={`${styles.soon} ${styles.storeLink}`}
          href="https://apps.apple.com/app/id6817090864"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="get"
        >
          <span className={styles.dot} aria-hidden="true" />
          Download on the App Store
        </a>
      </nav>

      <main>
        {/* ---------- Hero ---------- */}
        <section className={styles.hero}>
          <UrgeWave heat={heat} className={styles.wave} />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 className={styles.title}>
                <span className="sr-only">Flip. Turn cravings into reps.</span>
                <span aria-hidden="true">
                  <span className={styles.lineMask}><span data-line>Turn</span></span>
                  <span className={styles.lineMask}><span data-line className={styles.hot}>cravings</span></span>
                  <span className={styles.lineMask}><span data-line>into <span className={styles.cool}>reps.</span></span></span>
                </span>
              </h1>
              <p className={styles.lede} data-hero-fade>
                Feel an urge, tap Flip, get dealt a quick challenge. Do it and watch the urge pass.
              </p>
              <p className={styles.heroNote} data-hero-fade>
                Free to download &middot; 7-day free trial of Flip Pro
              </p>
            </div>
            <div data-demo>
              <FlipDemo heat={heat} />
            </div>
          </div>
        </section>

        <Marquee
          className={styles.ticker}
          label="Urge to rep. 2 × 15 push-ups. Box breathing. Cold water splash. No account."
          items={['URGE → REP', '2 × 15 PUSH-UPS', 'BOX BREATHING', 'COLD WATER SPLASH', 'NO ACCOUNT', 'URGE BEATEN']}
          separator="●"
          speed={30}
        />

        {/* ---------- How it works (pinned) ---------- */}
        <section className={styles.how} data-how aria-labelledby="how-title">
          <div className={styles.howHeat} data-how-heat aria-hidden="true" />
          <div className={styles.howCool} data-how-cool aria-hidden="true" />
          <div className={styles.howInner}>
            <div className={styles.howText}>
              <h2 id="how-title" className={styles.h2}>How it works</h2>
              <ol className={styles.steps}>
                {steps.map((s, i) => (
                  <li className={styles.step} key={s.title} data-step={i}>
                    <span className={styles.num}>0{i + 1}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <span>{s.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.meter} aria-hidden="true">
                <span>URGE</span>
                <span className={styles.meterTrack}>
                  <span className={styles.meterFill} data-meter-fill />
                </span>
              </div>
            </div>
            <div className={styles.howCardWrap}>
              <span className={styles.progress} aria-hidden="true">
                <span data-progress />
              </span>
              <div data-how-card className={styles.howCard}>
                <ChallengeCard index={0} className={styles.howCard3d} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- A look inside (horizontal) ---------- */}
        <section className={styles.inside} data-inside aria-labelledby="inside-title">
          <p className={styles.insideWord} data-inside-word aria-hidden="true">A LOOK INSIDE A LOOK INSIDE</p>
          <h2 id="inside-title" className={`${styles.h2} ${styles.insideTitle}`}>A look inside</h2>
          <div className={styles.shots}>
            <div className={styles.track} data-track>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <figure className={styles.shot} key={n} style={order(n)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/flip/0${n}.jpg`} alt={`Flip app screenshot ${n}`} width={380} height={822} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Privacy as numbers ---------- */}
        <section className={styles.section} aria-labelledby="data-title">
          <h2 id="data-title" className={styles.h2} data-reveal>Your data stays on your iPhone</h2>
          <ul className={styles.zeros}>
            {zeros.map((z) => (
              <li key={z} data-reveal>
                <span className={styles.zero} data-zero>0</span>
                <span className={styles.zeroLabel}>{z}</span>
              </li>
            ))}
          </ul>
          <p className={styles.body} data-reveal>
            No accounts, no servers, no analytics. Everything Flip knows lives on your
            phone, and you can export or delete it anytime from the app.
          </p>
        </section>

        {/* ---------- Pricing ---------- */}
        <section className={styles.section} aria-labelledby="pricing-title">
          <h2 id="pricing-title" className={styles.h2} data-reveal>Pricing</h2>
          <p className={styles.body} data-reveal>
            Flip is free to download. After setup, the app offers Flip Pro with a 7-day free trial. The prices below are US prices. The App Store shows the price in your local currency.
          </p>
          <div className={styles.pricing}>
            <div className={styles.pro} data-reveal data-glow>
              <h3>Flip Pro</h3>
              <ul>
                {proFeatures.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <ul className={styles.plans}>
              {plans.map((pl, i) => (
                <li
                  className={`${styles.plan} ${i === 0 ? styles.planFeatured : ''}`}
                  key={pl.name}
                  data-reveal
                  data-tilt
                  data-glow
                  style={order(i)}
                >
                  {i === 0 && <span className={styles.badge}>7 DAYS FREE</span>}
                  <strong>{pl.name}</strong>
                  <div className={styles.price}>{pl.price}<small>{pl.per}</small></div>
                  <span className={styles.planNote}>{pl.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.fine} data-reveal>
            Payment is charged to your Apple Account. A subscription renews automatically unless you cancel at
            least 24 hours before the end of the current period. Manage or cancel it in Settings &rsaquo; Apple
            Account &rsaquo; Subscriptions. See the <Link className={`${styles.link} u-link`} href="/flip/terms">Terms of Use</Link>.
          </p>
        </section>

        {/* ---------- Support ---------- */}
        <section className={styles.section} aria-labelledby="support-title">
          <h2 id="support-title" className={styles.h2} data-reveal>Support</h2>
          <p className={styles.body}>
            Questions or feedback? Email{' '}
            <a className={`${styles.link} u-link`} href={`mailto:${FLIP_SUPPORT_EMAIL}`}>{FLIP_SUPPORT_EMAIL}</a>.
          </p>
          <p className={styles.body}>
            <strong>Manage or cancel a subscription:</strong> Settings &rsaquo; Apple Account &rsaquo; Subscriptions.
          </p>
          <p className={styles.body}>
            <strong>Restore a purchase:</strong> Flip &rsaquo; You &rsaquo; Restore purchases.
          </p>

          <div className={styles.rows}>
            <Link className={styles.row} href="/flip/privacy" data-cursor="read">
              <span>Privacy Policy</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link className={styles.row} href="/flip/terms" data-cursor="read">
              <span>Terms of Use</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        {/* ---------- Outro ---------- */}
        <section className={styles.outro} aria-label="Flip">
          <p className={styles.outroWord} aria-hidden="true">
            <span className={styles.hot}>URGE</span> <span className={styles.arrow}>→</span>{' '}
            <span className={styles.cool}>REP</span>
          </p>
          <Magnetic>
            <a className={styles.cta} href={`mailto:${FLIP_SUPPORT_EMAIL}`} data-cursor="mail">
              Say hi to the team <span aria-hidden="true">&rarr;</span>
            </a>
          </Magnetic>
        </section>
      </main>

      <SiteFooter flip />
    </div>
  )
}

export default FlipPage
