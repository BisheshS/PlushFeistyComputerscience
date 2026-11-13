import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../../components/SiteFooter'
import { REPLENISH_APP_STORE_URL, REPLENISH_SUPPORT_EMAIL } from '../../lib/replenish'

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)
const order = (i: number) => ({ '--i': i } as CSSProperties)

// Replenish tint for the hero light (Flip uses volt and ember).
const glow: CSSProperties = {
  background:
    'radial-gradient(closest-side, rgba(96, 196, 255, 0.28), rgba(96, 196, 255, 0)) 5% 35% / 55% 75% no-repeat, ' +
    'radial-gradient(closest-side, rgba(120, 226, 190, 0.16), rgba(120, 226, 190, 0)) 75% 15% / 45% 60% no-repeat',
}

// From docs/LISTING.md in the app repo. Honest wording only: estimates, no medical claims.
const features = [
  { title: 'See it happen', text: 'Log a smoke and watch it enter a living 3D chest. See your lungs and heart react, then watch the air clear, hour by hour.' },
  { title: 'One more? See it first', text: 'Before you light up, preview what one more cigarette would do. Then choose: skip it and breathe, or log it. No judgement.' },
  { title: 'Quit and watch it heal', text: 'Set a quit date or a gradual plan. Your lungs recover on a timeline based on public health sources.' },
  { title: 'Built for cravings', text: 'One tap starts a guided breathing session paced by the lungs. Every craving you beat is counted.' },
]

const ReplenishPage: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Replenish | puchka</title>
      <meta name="description" content="Replenish: see your lungs recover. Log a cigarette and watch a 3D chest react, then watch it heal when you quit. Your smoking and Health data stay on your iPhone. Support, privacy and terms." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/" className={`${styles.back} enter`} style={delay(0)}>
        <span aria-hidden="true">&larr;</span> puchka
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroGlow} style={glow} aria-hidden="true" />
        <h1 className={`${styles.title} enter`} style={delay(80)}>Replenish</h1>
        <p className={`${styles.tagline} enter`} style={delay(200)}>See your lungs recover.</p>
        <a
          className={`${styles.soon} enter`}
          style={{ ...delay(320), textDecoration: 'none' }}
          href={REPLENISH_APP_STORE_URL}
        >
          <span className={styles.dot} aria-hidden="true" />
          Coming soon to the App Store
        </a>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>What it does</h2>
        <ul className={styles.steps}>
          {features.map((f, i) => (
            <li className={styles.step} key={f.title} data-reveal data-glow style={order(i + 1)}>
              <div>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Not medical advice</h2>
        <div className={styles.note} data-reveal>
          <p>
            Replenish is a self-help tool, not a medical device. The 3D lungs and heart are illustrations,
            not scans of your body. Every number is an estimate with a source you can read. For help to quit,
            talk to a doctor, pharmacist or your local stop-smoking service.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Your smoking data stays on your iPhone</h2>
        <div className={styles.note} data-reveal>
          <p>
            No account and no ads. Your smoking and Health data never leave your iPhone. The app sends only anonymous purchase and usage numbers, and you can switch that off in the app. Apple Health is optional and read-only.
            You can delete everything from the app at any time.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Replenish Pro</h2>
        <p data-reveal>
          Logging, SOS, your quit plan and milestones stay free. Replenish Pro adds the lungs a year ahead,
          full history, Apple Health trends, share cards, widgets and the Live Activity. It comes as a yearly
          or monthly subscription, or a one-time lifetime purchase. The price is shown in the app before you buy.
        </p>
        <p className={styles.fine} data-reveal>
          Payment is charged to your Apple Account. A subscription renews automatically unless you cancel at
          least 24 hours before the end of the current period. See the{' '}
          <Link className={`${styles.link} u-link`} href="/replenish/terms">Terms of Use</Link>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Support</h2>
        <p>
          Questions or feedback? Email{' '}
          <a className={`${styles.link} u-link`} href={`mailto:${REPLENISH_SUPPORT_EMAIL}`}>{REPLENISH_SUPPORT_EMAIL}</a>.
        </p>
        <p>
          <strong>Manage or cancel a subscription:</strong> Settings &rsaquo; your name &rsaquo; Subscriptions.
        </p>
        <p>
          <strong>Restore a purchase:</strong> Replenish &rsaquo; You &rsaquo; Restore purchases.
        </p>
        <p>
          <strong>Delete your data:</strong> Replenish &rsaquo; You &rsaquo; Delete all data.
        </p>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.linkRow}>
          <Link className={styles.pillLink} href="/replenish/privacy">Privacy Policy <span aria-hidden="true">&rarr;</span></Link>
          <Link className={styles.pillLink} href="/replenish/terms">Terms of Use <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>
    </main>

    <SiteFooter replenish />
  </div>
)

export default ReplenishPage
