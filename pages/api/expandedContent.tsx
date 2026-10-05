// The "no vices" details shown when its homepage card expands.
import styles from '../../styles/ExpandedContent.module.css';

const ExpandedContent = () => {
  return (
    <div className={styles.expandedContent}>
      <h3>what is this???? </h3>
      <p>
        Join a community that&apos;s already celebrated two successful batches, boasting a thriving user base of 25 individuals. Be a part of a proven program that brings positive change.
      </p>

      <ol className={styles.rules}>
        <li>Commit to 30 days without indulging in vices.</li>
        <li>Set and achieve daily goals: whether it&apos;s 100 pushups, writing a book, creating music, running 3 miles or whatever</li>
        <li>Use social media for accountability</li>
      </ol>

      <p>
        <a className={styles.cta} href="https://novices-landing.vercel.app/">
          Join the Faatakameezz challenge now! <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  );
};

export default ExpandedContent;
