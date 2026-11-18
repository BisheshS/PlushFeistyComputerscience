import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../../components/SiteFooter'
import { replenishPrivacy } from '../../lib/replenishLegal'

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)

const doc = replenishPrivacy

const Page: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>{`${doc.title} | Replenish | puchka`}</title>
      <meta name="description" content="Replenish Privacy Policy: no accounts, no ads. Your smoking and Health data stay on your iPhone. Optional anonymous usage stats, easy to switch off." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/replenish" className={`${styles.back} enter`} style={delay(0)}>
        <span aria-hidden="true">&larr;</span> Replenish
      </Link>

      <article className={styles.doc}>
        <h1 className="enter" style={delay(80)}>{doc.title}</h1>
        <p className={`${styles.updated} enter`} style={delay(160)}>{doc.lastUpdated}</p>
        <p className={`${styles.intro} enter`} style={delay(240)}>{doc.intro}</p>
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

    <SiteFooter replenish />
  </div>
)

export default Page
