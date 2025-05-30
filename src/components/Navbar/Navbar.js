// components/Navbar/Navbar.js
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar({ username, avatarUrl, showBackButton = false }) {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <i className={`material-icons ${styles.icon}`}>home</i>
                <h1 className={styles.title}>Sabana</h1>
            </div>
            <nav className={styles.nav}>
                <div className={styles.navContainer}>
                    {showBackButton && (
                        <Link href="/" className={styles.backButton}>
                            <i className="material-icons">arrow_back</i>
                            <span>Back to issues</span>
                        </Link>
                    )}

                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="avatar"
                            width={42}
                            height={42}
                            className={styles.avatarImg}
                        />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            <span className="material-icons">person</span>
                        </div>
                    )}
                    <span className={styles.username}>{username}</span>
                </div>
            </nav>
        </header>
    )
}
