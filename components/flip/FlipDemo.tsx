import { useRef, useState, type MutableRefObject } from 'react'
import { gsap, reducedMotion } from '../../lib/motion'
import styles from '../../styles/Flip.module.css'

// The three starter cards, copied from Flip/Models/Challenges.swift.
export const CHALLENGES = [
  { title: '2 × 15 Push-ups', subtitle: 'Nose to the floor. Every rep counts.', category: 'BODY', tone: 'body', xp: 30 },
  { title: 'Box breathing', subtitle: '4 in, 4 hold, 4 out, 4 hold. ×4.', category: 'CALM', tone: 'calm', xp: 20 },
  { title: 'Cold water splash', subtitle: 'Face or wrists. 30 seconds.', category: 'MIND', tone: 'mind', xp: 15 },
] as const

/** A playing card with a back (ember F monogram) and a face (the challenge). */
export const ChallengeCard = ({
  index,
  className = '',
  cardRef,
}: {
  index: number
  className?: string
  cardRef?: MutableRefObject<HTMLDivElement | null>
}) => {
  const c = CHALLENGES[index]
  return (
    <div className={`${styles.card3d} ${className}`} ref={cardRef}>
      <div className={styles.cardBack} aria-hidden="true">
        <span>F</span>
      </div>
      <div className={styles.cardFace} data-tone={c.tone}>
        <div className={styles.cardBand}>
          <span>{c.category}</span>
          <span>+{c.xp} XP</span>
        </div>
        <div className={styles.cardMain}>
          <strong>{c.title}</strong>
          <span>{c.subtitle}</span>
        </div>
      </div>
    </div>
  )
}

// Hero demo: press FLIP, a card is dealt and flips over, the urge wave cools.
const FlipDemo = ({ heat }: { heat: MutableRefObject<number> }) => {
  const [deal, setDeal] = useState(-1)
  const [busy, setBusy] = useState(false)
  const card = useRef<HTMLDivElement | null>(null)
  const button = useRef<HTMLButtonElement>(null)

  const press = () => {
    if (busy) return
    const next = (deal + 1) % CHALLENGES.length
    const still = reducedMotion()
    setBusy(true)

    const run = () => {
      setDeal(next)
      requestAnimationFrame(() => {
        const el = card.current
        if (!el) return
        if (still) {
          gsap.set(el, { rotationY: 180, autoAlpha: 1 })
          heat.current = 0.05
          setBusy(false)
          return
        }
        gsap
          .timeline({ onComplete: () => setBusy(false) })
          .fromTo(
            el,
            { autoAlpha: 0, y: 140, scale: 0.4, rotation: -18, rotationY: 0 },
            { autoAlpha: 1, y: 0, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.6)' }
          )
          .to(el, { rotationY: 180, rotation: 3, duration: 0.8, ease: 'back.out(1.4)' }, '+=0.15')
          .to(heat, { current: 0.05, duration: 1.8, ease: 'power2.out' }, '<')
      })
    }

    // Squash the button, then deal. If a card is out, throw it away first.
    // After the first deal the button shrinks and drops below the card.
    if (button.current) {
      if (still) gsap.set(button.current, { scale: 0.36, yPercent: 56 })
      else
        gsap.fromTo(
          button.current,
          { scale: deal >= 0 ? 0.3 : 0.88 },
          { scale: 0.36, yPercent: 56, duration: 0.9, ease: 'elastic.out(1, 0.5)' }
        )
    }
    if (deal >= 0 && card.current && !still) {
      gsap.to(heat, { current: 1, duration: 0.5, ease: 'power2.in' })
      gsap.to(card.current, {
        x: 260,
        y: -60,
        rotation: 24,
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(card.current, { x: 0 })
          run()
        },
      })
    } else {
      run()
    }
  }

  const c = deal >= 0 ? CHALLENGES[deal] : null

  return (
    <div className={styles.demo}>
      <div className={styles.demoStage}>
        <button
          ref={button}
          type="button"
          className={styles.flipButton}
          onClick={press}
          data-dealt={deal >= 0}
          data-cursor="flip"
          aria-describedby="flip-demo-status"
        >
          <span className={styles.flipButtonCore}>
            <span className={styles.flipButtonWord}>FLIP</span>
            <span className={styles.flipButtonHint}>{deal >= 0 ? 'deal another' : 'feel an urge?'}</span>
          </span>
        </button>
        {deal >= 0 && <ChallengeCard index={deal} cardRef={card} className={styles.demoCard} />}
      </div>
      <p id="flip-demo-status" className={styles.demoStatus} aria-live="polite">
        {c ? (
          <>
            Dealt: <strong>{c.title}</strong>. Do it, and the urge passes.
          </>
        ) : (
          'Try it: tap FLIP.'
        )}
      </p>
    </div>
  )
}

export default FlipDemo
