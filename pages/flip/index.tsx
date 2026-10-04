import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Flip.module.css'
import { FLIP_SUPPORT_EMAIL } from '../../lib/flip'

const steps = [
  { title: 'Feel an urge', text: 'A craving hits. Open Flip instead of giving in.' },
  { title: 'Get dealt a challenge card', text: 'Tap Flip and a quick exercise challenge is dealt to you.' },
  { title: 'Do it and watch the urge pass', text: 'Finish the reps and see how the urge fades.' },
]

const freeFeatures = [
  'One habit',
  'The full Flip loop: rate the urge, get a card, do it',
  '7 days of stats',
  'The Trade share card',
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

const FlipPage: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Flip | puchka</title>
      <meta name="description" content="Flip turns cravings into reps. Feel an urge, tap Flip, do a quick exercise challenge and watch the urge pass. Free, with optional Flip Pro. Pricing, support, privacy and terms." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/" className={styles.back}>&larr; puchka</Link>

      <section className={styles.hero}>
        <h1 className={styles.title}>Flip</h1>
        <p className={styles.tagline}>Turn cravings into reps.</p>
        <span className={styles.soon}>Coming soon to the App Store</span>
      </section>

      <section className={styles.section}>
        <h2>How it works</h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li className={styles.step} key={s.title}>
              <div className={styles.num}>{i + 1}</div>
              <div>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2>Pricing</h2>
        <p>Flip is free to download. Flip Pro is optional. Prices are in US dollars and the app is available in the United States.</p>
        <div className={styles.tiers}>
          <div className={styles.tier}>
            <h3>Free</h3>
            <ul>
              {freeFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
          <div className={`${styles.tier} ${styles.tierPro}`}>
            <h3>Flip Pro</h3>
            <ul>
              {proFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
        <ul className={styles.plans}>
          {plans.map((pl) => (
            <li className={styles.plan} key={pl.name}>
              <div>
                <strong>{pl.name}</strong>
                <span>{pl.note}</span>
              </div>
              <div className={styles.price}>{pl.price}<small>{pl.per}</small></div>
            </li>
          ))}
        </ul>
        <p className={styles.fine}>
          Payment is charged to your Apple Account. A subscription renews automatically unless you cancel at
          least 24 hours before the end of the current period. Manage or cancel it in Settings &rsaquo; Apple
          Account &rsaquo; Subscriptions. See the <Link className={styles.link} href="/flip/terms">Terms of Use</Link>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your data stays on your iPhone</h2>
        <div className={styles.note}>
          <p>
            No accounts, no servers, no analytics. Everything Flip knows lives on your
            phone, and you can export or delete it anytime from the app.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Support</h2>
        <p>
          Questions or feedback? Email{' '}
          <a className={styles.link} href={`mailto:${FLIP_SUPPORT_EMAIL}`}>{FLIP_SUPPORT_EMAIL}</a>.
        </p>
        <p>
          <strong>Manage or cancel a subscription:</strong> Settings &rsaquo; Apple Account &rsaquo; Subscriptions.
        </p>
        <p>
          <strong>Restore a purchase:</strong> Flip &rsaquo; You &rsaquo; Restore purchases.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.linkRow}>
          <Link className={styles.link} href="/flip/privacy">Privacy Policy</Link>
          <Link className={styles.link} href="/flip/terms">Terms of Use</Link>
        </div>
      </section>
    </main>

    <footer className={styles.footer}>
      <p>Made with ❤️ in India</p>
    </footer>
  </div>
)

export default FlipPage
