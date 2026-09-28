import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Flip.module.css'
import { flipTerms } from '../../lib/flipLegal'

const doc = flipTerms

const Page: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>{`${doc.title} | Flip | puchka`}</title>
      <meta name="description" content="Flip Terms of Use: not medical advice, exercise safely, and how Flip Pro subscriptions work." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/flip" className={styles.back}>&larr; Flip</Link>

      <article className={styles.doc}>
        <h1>{doc.title}</h1>
        <p className={styles.updated}>{doc.lastUpdated}</p>
        <p className={styles.intro}>{doc.intro}</p>
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

    <footer className={styles.footer}>
      <div className={styles.linkRow}>
        <Link className={styles.link} href="/flip/privacy">Privacy Policy</Link>
        <Link className={styles.link} href="/flip/terms">Terms of Use</Link>
      </div>
    </footer>
  </div>
)

export default Page
