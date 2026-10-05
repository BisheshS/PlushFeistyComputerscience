import Link from 'next/link'
import styles from '../styles/SiteFooter.module.css'

type Props = {
  /** Show the Flip legal links (Flip pages only). */
  flip?: boolean
}

const SiteFooter = ({ flip = false }: Props) => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p className={styles.mark}>
        <span aria-hidden="true">©</span>
        <span className="sr-only">Copyright</span> 2026{' '}
        <Link href="/" className="u-link">puchka</Link>
      </p>
      <nav className={styles.links} aria-label="Footer">
        {flip ? (
          <>
            <Link className="u-link" href="/flip/privacy">Privacy Policy</Link>
            <Link className="u-link" href="/flip/terms">Terms of Use</Link>
          </>
        ) : (
          <>
            <Link className="u-link" href="/flip">Flip</Link>
            <Link className="u-link" href="/contact">Contact</Link>
          </>
        )}
      </nav>
    </div>
  </footer>
)

export default SiteFooter
