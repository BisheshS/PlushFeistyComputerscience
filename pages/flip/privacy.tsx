import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from '../../styles/Flip.module.css'
import SiteFooter from '../../components/SiteFooter'
import { flipPrivacy } from '../../lib/flipLegal'

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)

const doc = flipPrivacy

const Page: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>{`${doc.title} | Flip | puchka`}</title>
      <meta name="description" content="Flip Privacy Policy: no accounts, no servers, no analytics. Your data stays on your iPhone." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/flip" className={`${styles.back} enter`} style={delay(0)}>
        <span aria-hidden="true">&larr;</span> Flip
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

    <SiteFooter flip />
  </div>
)

export default Page
