// components/ExpandedContent.tsx
import styles from '../../styles/ExpandedContent.module.css';

const ExpandedContent = () => {
  return (
    <div className={`${styles.expandedContentWrapper} ${styles.show}`}>
      <div className={styles.expandedContent}>
        <p>
          <h3>what is this???? </h3>
          Join a community that's already celebrated two successful batches, boasting a thriving user base of 25 individuals. Be a part of a proven program that brings positive change.
          
        </p>

        <p>

          1. Commit to 30 days without indulging in vices.<br></br>
          2. Set and achieve daily goals: whether it's 100 pushups, writing a book, creating music, running 3 miles or whatever
          <br></br>
          3. Use social media for accountability
        </p>
        <br></br>
        <p>
          Take the first step towards a better version of yourself. <a href="https://novices-landing.vercel.app/">Join the Faatakameezz challenge now!</a>
        </p>
      </div>
    </div>
  );
};

export default ExpandedContent;
