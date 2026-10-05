import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../../components/SiteFooter'
import { FLIP_SUPPORT_EMAIL } from '../../lib/flip'

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)
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

const FlipPage: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Flip | puchka</title>
      <meta name="description" content="Flip turns cravings into reps. Feel an urge, tap Flip, do a quick exercise challenge and watch the urge pass. Free to download, with a 7-day free trial of Flip Pro. Pricing, support, privacy and terms." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/" className={`${styles.back} enter`} style={delay(0)}>
        <span aria-hidden="true">&larr;</span> puchka
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <h1 className={`${styles.title} enter`} style={delay(80)}>Flip</h1>
        <p className={`${styles.tagline} enter`} style={delay(200)}>Turn cravings into reps.</p>
        <span className={`${styles.soon} enter`} style={delay(320)}>
          <span className={styles.dot} aria-hidden="true" />
          Coming soon to the App Store
        </span>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>How it works</h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li className={styles.step} key={s.title} data-reveal data-glow style={order(i + 1)}>
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
        <h2 data-reveal>A look inside</h2>
        <div className={styles.shots} data-reveal>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={`/flip/0${n}.jpg`} alt={`Flip app screenshot ${n}`} width={380} height={822} loading="lazy" />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Pricing</h2>
        <p data-reveal>Flip is free to download. After setup, the app offers Flip Pro with a 7-day free trial. The prices below are US prices. The App Store shows the price in your local currency.</p>
        <div className={styles.tiers}>
          <div className={`${styles.tier} ${styles.tierPro}`} data-reveal data-glow style={order(0)}>
            <h3>Flip Pro</h3>
            <ul>
              {proFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
        <ul className={styles.plans}>
          {plans.map((pl, i) => (
            <li
              className={`${styles.plan} ${i === 0 ? styles.planFeatured : ''}`}
              key={pl.name}
              data-reveal
              data-glow
              style={order(i)}
            >
              <div>
                <strong>{pl.name}</strong>
                <span>{pl.note}</span>
              </div>
              <div className={styles.price}>{pl.price}<small>{pl.per}</small></div>
            </li>
          ))}
        </ul>
        <p className={styles.fine} data-reveal>
          Payment is charged to your Apple Account. A subscription renews automatically unless you cancel at
          least 24 hours before the end of the current period. Manage or cancel it in Settings &rsaquo; Apple
          Account &rsaquo; Subscriptions. See the <Link className={`${styles.link} u-link`} href="/flip/terms">Terms of Use</Link>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Your data stays on your iPhone</h2>
        <div className={styles.note} data-reveal>
          <p>
            No accounts, no servers, no analytics. Everything Flip knows lives on your
            phone, and you can export or delete it anytime from the app.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 data-reveal>Support</h2>
        <p>
          Questions or feedback? Email{' '}
          <a className={`${styles.link} u-link`} href={`mailto:${FLIP_SUPPORT_EMAIL}`}>{FLIP_SUPPORT_EMAIL}</a>.
        </p>
        <p>
          <strong>Manage or cancel a subscription:</strong> Settings &rsaquo; Apple Account &rsaquo; Subscriptions.
        </p>
        <p>
          <strong>Restore a purchase:</strong> Flip &rsaquo; You &rsaquo; Restore purchases.
        </p>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.linkRow}>
          <Link className={styles.pillLink} href="/flip/privacy">Privacy Policy <span aria-hidden="true">&rarr;</span></Link>
          <Link className={styles.pillLink} href="/flip/terms">Terms of Use <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>
    </main>

    <SiteFooter flip />
  </div>
)

export default FlipPage
