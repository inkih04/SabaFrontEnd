import Link from 'next/link'
import Image from 'next/image'
import styles from './Sidebar.module.css'

export default function Sidebar({ avatarUrl}) {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <ul>
                    <li className={styles.item}>
                        <span className="material-icons sidebar__icon">group_work</span>
                        <Link href="/teammates">Teammates</Link>
                    </li>
                    <li className={styles.item}>
                        <span className="material-icons sidebar__icon">bug_report</span>
                        <Link href="/issueList">Issues</Link>
                    </li>
                    <li className={styles.item}>
                        <span className="material-icons sidebar__icon">settings</span>
                        <Link href="/settings">Settings</Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.profile}>
                <ul>
                    <li className={styles.item}>
                        {avatarUrl
                            ? <Image
                                src={avatarUrl}
                                alt="avatar"
                                width={35}
                                height={35}
                                className={styles.profileAvatar}
                            />
                            : <span className="material-icons sidebar__icon">person</span>
                        }
                        <Link href="/profile">Profile</Link>
                    </li>
                    <li className={styles.item}>
                        <span className="material-icons sidebar__icon">logout</span>
                        <Link href="/login">Logout</Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
