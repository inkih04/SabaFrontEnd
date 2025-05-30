// Directory: src/components/Teammates/UserCard.js
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './Teammates.module.css'

export default function UserCard({ user }) {
    const router = useRouter()
    const {
        username,
        assigned_issues_count,
        watched_issues_count,
        comments_count,
        profile
    } = user

    return (
        <div
            className={styles.userCard}
            onClick={() => router.push(`/teammates/${username}`)}
        >
            <div className={styles.avatar}>
                {profile.avatar ? (
                    <img src={profile.avatar} alt={username} />
                ) : (
                    <span className="material-icons">person</span>
                )}
            </div>
            <div className={styles.bioSection}>
                <p className={styles.userName}>{username}</p>
                {profile.biography && (
                    <p className={styles.bioText}>{profile.biography}</p>
                )}
            </div>
            <div className={styles.stat}>{assigned_issues_count}</div>
            <div className={styles.stat}>{watched_issues_count}</div>
            <div className={styles.stat}>{comments_count}</div>
        </div>
    )
}