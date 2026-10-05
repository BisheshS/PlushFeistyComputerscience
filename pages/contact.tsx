// pages/contact.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import SiteFooter from '../components/SiteFooter';
import styles from '../styles/Contact.module.css';

const delay = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties);

const Contact: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Us | puchka</title>
        <meta name="description" content="Contact us for any inquiries or feedback." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/" className={`${styles.back} enter`} style={delay(0)}>
          <span aria-hidden="true">&larr;</span> puchka
        </Link>

        <h1 className={`${styles.title} enter`} style={delay(80)}>Contact Us</h1>
        <p className={`${styles.lede} enter`} style={delay(180)}>
          If you have any inquiries or feedback, feel free to reach out to us !
        </p>

        <a className={`${styles.email} enter`} style={delay(280)} href="mailto:bishesh@puchka.in">
          <span className={styles.emailText}>bishesh@puchka.in</span>
          <span className={styles.emailArrow} aria-hidden="true">&rarr;</span>
        </a>

        <p className={`${styles.home} enter`} style={delay(380)}>
          <Link href="/" className="u-link">Go back to Home</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Contact;
