import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Link href="/" className={styles.logo}>
            TaskFlow
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Simple Project Management</span>

            <h1>
              Organize your projects.
              <br />
              Manage your tasks.
            </h1>

            <p>
              TaskFlow gives you a simple way to view projects and tasks in one
              place, helping you stay organized and focused.
            </p>

            <div className={styles.heroButtons}>
              <Link href="/dashboard" className={styles.primaryButton}>
                View Dashboard
              </Link>

              <a href="#features" className={styles.secondaryButton}>
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>TASKFLOW</p>
            <h2>Everything you need to stay organized</h2>
            <p>
              A clean public interface connected to the TaskFlow backend.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <article className={styles.card}>
              <div className={styles.cardNumber}>01</div>
              <h3>Projects</h3>
              <p>
                View your available projects and quickly understand their
                current status.
              </p>
            </article>

            <article className={styles.card}>
              <div className={styles.cardNumber}>02</div>
              <h3>Tasks</h3>
              <p>
                Keep track of tasks, priorities, and progress from one simple
                dashboard.
              </p>
            </article>

            <article className={styles.card}>
              <div className={styles.cardNumber}>03</div>
              <h3>Simple & Responsive</h3>
              <p>
                Use TaskFlow comfortably across desktop, tablet, and mobile
                screens.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>TaskFlow — Full-Stack Web Development Internship Project</p>
      </footer>
    </div>
  );
}