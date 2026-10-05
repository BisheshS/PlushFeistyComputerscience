import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import SiteFooter from '../components/SiteFooter'
import styles from '../styles/Contact.module.css'

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties)

const NotFound: NextPage = () => (
  <div className={styles.container}>
    <Head>
      <title>Page not found | puchka</title>
      <meta name="robots" content="noindex" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <Link href="/" className={`${styles.back} enter`} style={delay(0)}>
        <span aria-hidden="true">&larr;</span> puchka
      </Link>
      <p className={`${styles.lede} enter`} style={delay(60)}>404</p>
      <h1 className={`${styles.title} enter`} style={delay(120)}>This page is not here.</h1>
      <p className={`${styles.home} enter`} style={delay(240)}>
        <Link href="/" className="u-link">Go back to Home</Link>
      </p>
    </main>

    <SiteFooter />
  </div>
)

export default NotFound
