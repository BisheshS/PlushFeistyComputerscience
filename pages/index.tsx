import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import ExpandedContent from '../pages/api/expandedContent'
import SiteFooter from '../components/SiteFooter'
import styles from '../styles/Home.module.css'

// Inline entrance delay for elements with the global "enter" class.
const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)

const TITLE = 'puchka'

const Home: NextPage = () => {
  const [isNoVicesExpanded, setIsNoVicesExpanded] = useState(false)

  const handleNoVicesToggle = () => {
    setIsNoVicesExpanded(!isNoVicesExpanded)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>puchka</title>
        <meta
          name="description"
          content="puchka is a small studio making playful products: no vices, pakoda and Flip, the app that turns cravings into reps."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.orbs} />
        <div className={styles.grain} />
      </div>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            <span className="sr-only">{TITLE}</span>
            <span className={styles.letters} aria-hidden="true">
              {TITLE.split('').map((ch, i) => (
                <span className={styles.mask} key={i}>
                  <span className={styles.letter} style={delay(60 + i * 55)}>{ch}</span>
                </span>
              ))}
            </span>
          </h1>

          <p className={`${styles.description} enter`} style={delay(520)}>
            where dreams come true
          </p>
        </header>

        <ul className={styles.grid} aria-label="Products">
          <li className="enter" style={delay(680)}>
            <div
              className={`${styles.card} ${isNoVicesExpanded ? styles.expandedCard : ''}`}
              data-glow
            >
              <div className={styles.cardHead}>
                <span className={styles.index}>01</span>
                <div className={styles.cardBody}>
                  <h2>
                    <button
                      type="button"
                      className={styles.cardButton}
                      onClick={handleNoVicesToggle}
                      aria-expanded={isNoVicesExpanded}
                      aria-controls="no-vices-details"
                    >
                      no vices
                    </button>
                  </h2>
                  <p>Give up on vices and work on your goals, a 30-day challenge</p>
                </div>
                <span className={`${styles.icon} ${styles.plus}`} aria-hidden="true" />
              </div>
              <div
                id="no-vices-details"
                className={styles.expand}
                data-open={isNoVicesExpanded}
                aria-hidden={!isNoVicesExpanded}
                {...(!isNoVicesExpanded && ({ inert: '' } as Record<string, string>))}
              >
                <div className={styles.expandInner}>
                  <ExpandedContent />
                </div>
              </div>
            </div>
          </li>

          <li className="enter" style={delay(760)}>
            <div className={styles.card} data-glow>
              <div className={styles.cardHead}>
                <span className={styles.index}>02</span>
                <div className={styles.cardBody}>
                  <h2>
                    pakoda <span className={styles.tag}>in progress</span>
                  </h2>
                  <p>WIP! creating a bunch of fun games to play in person during a gathering</p>
                </div>
              </div>
            </div>
          </li>

          <li className="enter" style={delay(840)}>
            <Link href="/flip" className={styles.card} data-glow>
              <span className={styles.index}>03</span>
              <div className={styles.cardBody}>
                <h2>flip</h2>
                <p>Turn cravings into reps</p>
              </div>
              <span className={`${styles.icon} ${styles.arrow}`} aria-hidden="true">&rarr;</span>
            </Link>
          </li>

          <li className="enter" style={delay(920)}>
            <Link href="/contact" className={styles.card} data-glow>
              <span className={styles.index}>04</span>
              <div className={styles.cardBody}>
                <h2>Contact Us</h2>
                <p>Get in touch with us for any inquiries or feedback</p>
              </div>
              <span className={`${styles.icon} ${styles.arrow}`} aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        </ul>
      </main>

      <SiteFooter />
    </div>
  )
}

export default Home
