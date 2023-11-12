// pages/contact.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link'; // Import the Link component
import styles from '../styles/Contact.module.css';

const Contact: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact us for any inquiries or feedback." />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Contact Us</h1>
        {/* Add your contact form or details here */}
        <p>If you have any inquiries or feedback, feel free to reach out to us !</p>
        <br></br>
        <a href="mailto:bishesh@puchka.in">bishesh@puchka.in</a>
      </main>

      {/* Add a link back to the home page */}
      <Link href="/">
        <h2>Go back to Home</h2>
      </Link>
    </div>
  );
};

export default Contact;
