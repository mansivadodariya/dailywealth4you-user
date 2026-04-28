import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: '404 – Page Not Found',
};

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={styles.btn}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
