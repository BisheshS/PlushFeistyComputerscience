import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Magnetic from '../components/Magnetic'
import FleetPanes from '../components/fleet/FleetPanes'
import ParticleField, { fieldState } from '../components/ParticleField'
import { ChallengeCard } from '../components/flip/FlipDemo'
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/motion'
import styles from '../styles/Home.module.css'

const EMAIL = 'bishesh@puchka.in'
const FLEET_URL = 'https://fleetapp.in/'
const VICES_URL = 'https://novices-landing.vercel.app/'
const FLIP_STORE = 'https://apps.apple.com/app/id6817090864'

const PRODUCTS = [
  { id: 'flip', label: 'Flip' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'novices', label: 'no vices' },
] as const

const PRINCIPLES = [
  { title: 'Research', body: 'How people and models really behave.' },
  { title: 'Agentic engineering', body: 'Agents that build, test and ship.' },
  { title: 'Experiences', body: 'Apps that make life better.' },
] as const

const Home: NextPage = () => {
  const root = useRef<HTMLDivElement>(null)
  const seg = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>('')
  const [principle, setPrinciple] = useState(0)

  // Slide the nav pill under the product that is on screen.
  useEffect(() => {
    const wrap = seg.current
    if (!wrap) return
    const a = wrap.querySelector<HTMLElement>(`[data-seg="${active}"]`)
    wrap.style.setProperty('--pill-x', a ? `${a.offsetLeft}px` : '0px')
    wrap.style.setProperty('--pill-w', a ? `${a.offsetWidth}px` : '0px')
  }, [active])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Nav pill follows the product sections (all devices, no motion needed).
      PRODUCTS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(id),
        })
      })
      ScrollTrigger.create({
        trigger: '[data-products]',
        start: 'top 55%',
        end: 'bottom 55%',
        onLeave: () => setActive(''),
        onLeaveBack: () => setActive(''),
      })

      mm.add(MQ.motion, () => {
        // 1. Hero: lines rise from their masks, the rest fades up.
        gsap
          .timeline({ delay: 0.9 })
          .from('[data-hline]', { yPercent: 110, rotate: 2, duration: 1.4, ease: 'expo.out', stagger: 0.12 })
          .from('[data-hfade]', { y: 20, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, '-=1.0')

        gsap.to('[data-hero-copy]', {
          y: -70,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: '55% top', scrub: true },
        })
        // 3. Product cards rise into place as they enter.
        gsap.utils.toArray<HTMLElement>('[data-block-inner]').forEach((el) => {
          gsap.from(el, {
            y: 120,
            autoAlpha: 0.2,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: true },
          })
        })

        // 4. Flip block: phone drifts, the challenge card flips over as you scroll.
        gsap.fromTo(
          '[data-phone]',
          { yPercent: 14, rotate: 8 },
          {
            yPercent: -10,
            rotate: -3,
            ease: 'none',
            scrollTrigger: { trigger: '#flip', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
        gsap.fromTo(
          '[data-flipcard]',
          { rotationY: 0, rotation: -10, y: 60 },
          {
            rotationY: 180,
            rotation: 6,
            y: -20,
            ease: 'none',
            scrollTrigger: { trigger: '#flip', start: 'top 70%', end: 'center 30%', scrub: 0.6 },
          }
        )

        // 5. Fleet window rises and settles.
        gsap.from('[data-fleet-win]', {
          y: 120,
          rotateX: 18,
          scale: 0.92,
          ease: 'none',
          scrollTrigger: { trigger: '#fleet', start: 'top bottom', end: 'top 20%', scrub: true },
        })

        // 6. no vices: the 30 days fill in, one by one.
        gsap.fromTo(
          '[data-day]',
          { backgroundColor: 'rgba(255,91,46,0)', color: 'rgba(243,240,232,0.5)' },
          {
            backgroundColor: 'rgba(255,91,46,1)',
            color: '#0a0a0c',
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: '[data-days]', start: 'top 85%', end: 'bottom 35%', scrub: true },
          }
        )

        // 8. Outro and footer wordmark.
        gsap.from('[data-oline]', {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-outro]', start: 'top 75%' },
        })
      })

      // Principles: pin the section and step through the three items (wide screens).
      mm.add('(min-width: 900px) and (min-height: 640px)', () => {
        ScrollTrigger.create({
          trigger: '[data-principles]',
          start: 'top top',
          end: '+=180%',
          pin: true,
          onUpdate: (self) => {
            fieldState.principle = self.progress * 3
            setPrinciple(Math.min(2, Math.floor(self.progress * 3)))
          },
          onLeaveBack: () => (fieldState.principle = 0),
        })
      })
    },
    { scope: root }
  )

  return (
    <div className={styles.container} ref={root} data-pf-dark>
      <Head>
        <title>puchka</title>
        <meta
          name="description"
          content="puchka builds experiences. AI research, agentic engineering, and apps that make life better: Flip, Fleet and no vices."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ParticleField />

      <header className={styles.navWrap} data-dark="true">
        <nav className={styles.nav} aria-label="Main">
          <Link href="/" className={styles.logo} aria-label="puchka home">
            <span className={styles.logoBall} aria-hidden="true" />
            puchka
          </Link>
          <div className={styles.seg} ref={seg} data-has={active !== ''}>
            <span className={styles.segPill} aria-hidden="true" />
            {PRODUCTS.map((p) => (
              <a key={p.id} href={`#${p.id}`} data-seg={p.id} data-on={active === p.id}>
                {p.label}
              </a>
            ))}
          </div>
          <Link href="/contact" className={styles.navCta}>
            Say hi
          </Link>
        </nav>
      </header>

      <main>
        {/* ---------- Hero: a folding ribbon of particles ---------- */}
        <section className={styles.hero} data-hero>
          <div className={styles.heroFrame} data-pf-ribbon="hero" data-pf-dark>
            <div className={styles.heroShade} aria-hidden="true" />
            <div className={styles.heroCopy} data-hero-copy>
              <a className={styles.heroPill} href={FLEET_URL} data-hfade data-cursor="open">
                <span className={styles.pillDot} aria-hidden="true" />
                New · Fleet for Mac
                <span aria-hidden="true">&rarr;</span>
              </a>
              <h1 className={styles.title}>
                <span className={styles.line}>
                  <span data-hline>We build</span>
                </span>
                <span className={styles.line}>
                  <em data-hline>experiences.</em>
                </span>
              </h1>
              <p className={styles.sub} data-hfade>
                AI research. Agentic engineering.
                <br />
                Apps that make life better.
              </p>
              <div className={styles.heroCtas} data-hfade>
                <Magnetic>
                  <a className={styles.btnLight} href="#work" data-cursor="scroll">
                    See what we make <span aria-hidden="true">&darr;</span>
                  </a>
                </Magnetic>
                <Link className={styles.btnDarkGhost} href="/contact">
                  Say hi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Products ---------- */}
        <section className={styles.products} id="work" data-products aria-label="What we make">
          {/* Flip: in the Flip brand (ink, ember, volt, Archivo expanded heavy). */}
          <article className={`${styles.block} ${styles.blockFlip}`} id="flip" data-block>
            <div className={styles.blockInner} data-block-inner>
              <div className={styles.blockCopy}>
                <p className={styles.blockKicker}>
                  <span>01</span> Flip · iPhone · out now
                </p>
                <h2 className={styles.flipTitle}>
                  TURN <span className={styles.ember}>CRAVINGS</span> INTO <span className={styles.volt}>REPS.</span>
                </h2>
                <p className={styles.blockText}>
                  Feel an urge, tap Flip, get dealt a quick challenge card. Do it and watch the urge pass.
                </p>
                <div className={styles.btnRow}>
                  <Magnetic>
                    <a href={FLIP_STORE} className={styles.flipBtn} data-cursor="get" target="_blank" rel="noopener noreferrer">
                      Get it on the App Store <span aria-hidden="true">&rarr;</span>
                    </a>
                  </Magnetic>
                  <Link href="/flip" className={styles.flipGhost} data-cursor="open">
                    See Flip
                  </Link>
                </div>
              </div>
              <div className={styles.flipVisual}>
                <div className={styles.flipGlow} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.phone} data-phone src="/flip/01.jpg" alt="" width={380} height={822} loading="lazy" />
                <div className={styles.flipCardWrap} data-flipcard aria-hidden="true">
                  <ChallengeCard index={0} />
                </div>
              </div>
            </div>
          </article>

          {/* Fleet: in the Fleet brand (night ground, phosphor teal, IBM Plex). */}
          <article className={`${styles.block} ${styles.blockFleet}`} id="fleet" data-block>
            <div className={styles.blockInner} data-block-inner>
              <div className={styles.blockCopy}>
                <p className={styles.blockKicker}>
                  <span>02</span> Fleet · Mac app
                </p>
                <h2 className={styles.fleetTitle}>
                  Mission control for <span>AI coding agents.</span>
                </h2>
                <p className={styles.blockText}>
                  Run a dozen agents at once and always know which one needs you. See exactly where every token and dollar
                  went. A native Mac app for Claude Code and Codex.
                </p>
                <Magnetic>
                  <a href={FLEET_URL} className={styles.fleetBtn} data-cursor="open">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/fleet/icon.png" alt="" width={22} height={22} /> Get Fleet for Mac{' '}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </Magnetic>
                <p className={styles.fleetHint}>Free for 3 panes · Apple Silicon, macOS 13 or later · no proxy, no login to us</p>
              </div>
              <div className={styles.fleetVisual} data-fleet-win>
                <FleetPanes />
              </div>
            </div>
          </article>

          {/* no vices: puchka palette (no separate brand guide), ember ground. */}
          <article className={`${styles.block} ${styles.blockVices}`} id="novices" data-block>
            <div className={styles.blockInner} data-block-inner>
              <div className={styles.blockCopy}>
                <p className={styles.blockKicker}>
                  <span>03</span> no vices · 30-day challenge
                </p>
                <h2 className={styles.vicesTitle}>
                  no <em>vices.</em>
                </h2>
                <p className={styles.blockText}>Give up on vices and work on your goals, a 30-day challenge.</p>
                <ol className={styles.rules}>
                  <li>Commit to 30 days without indulging in vices.</li>
                  <li>Set and achieve daily goals: 100 pushups, a book, music, 3 miles, whatever.</li>
                  <li>Use social media for accountability.</li>
                </ol>
                <Magnetic>
                  <a className={styles.vicesBtn} href={VICES_URL} data-cursor="join">
                    Join the Faatakameezz challenge <span aria-hidden="true">&rarr;</span>
                  </a>
                </Magnetic>
              </div>
              <ol className={styles.days} data-days aria-label="30 days">
                {Array.from({ length: 30 }, (_, i) => (
                  <li key={i} data-day>
                    {i + 1}
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </section>

        {/* ---------- What we do (pinned on wide screens; the field draws each figure) ---------- */}
        <section className={styles.principles} data-principles aria-label="What we do">
          <div className={styles.prInner}>
            <ol className={styles.prList}>
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} data-on={principle === i}>
                  <h3>{p.title}</h3>
                  <p className={styles.prBodyInline}>{p.body}</p>
                </li>
              ))}
            </ol>
            <div className={styles.prStage} data-pf-stage aria-hidden="true" />
            <div className={styles.prText} aria-hidden="true">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} data-on={principle === i}>
                  <span className={styles.prNum}>0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Outro ---------- */}
        <section className={styles.outro} data-outro aria-label="Get in touch">
          <h2 className={styles.outroTitle}>
            <span className={styles.line}>
              <em data-oline>Say hi.</em>
            </span>
          </h2>
          <Magnetic strength={0.4}>
            <a className={styles.btnLight} href={`mailto:${EMAIL}`} data-cursor="mail">
              {EMAIL} <span aria-hidden="true">&rarr;</span>
            </a>
          </Magnetic>
        </section>
      </main>

      {/* ---------- Footer with giant wordmark ---------- */}
      <footer className={styles.footer}>
        <div className={styles.footCols}>
          <div>
            <h3>Products</h3>
            <Link href="/flip">Flip</Link>
            <a href={FLEET_URL}>Fleet</a>
            <a href={VICES_URL}>no vices</a>
          </div>
          <div>
            <h3>Studio</h3>
            <Link href="/contact">Contact</Link>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/flip/privacy">Flip Privacy Policy</Link>
            <Link href="/flip/terms">Flip Terms of Use</Link>
          </div>
        </div>
        <p className={styles.wordmark} data-wordmark data-pf-word="puchka" aria-hidden="true">
          {'puchka'.split('').map((ch, i) => (
            <span className={styles.wmMask} key={i}>
              <span>{ch}</span>
            </span>
          ))}
        </p>
        <div className={styles.footBottom}>
          <span>© 2026 puchka</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
