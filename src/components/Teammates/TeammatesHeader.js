// Directory: src/components/Teammates/TeammatesHeader.js
'use client'
import React from 'react'
import styles from './Teammates.module.css'

export default function TeammatesHeader({ filter, onSearch }) {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>User Directory</h1>
            <div className={styles.searchBar}>
                <span className="material-icons">search</span>
                <input
                    type="text"
                    placeholder="Search user..."
                    value={filter}
                    onChange={e => onSearch(e.target.value)}
                />
            </div>
            <div className={styles.navBar}>
                <div className={styles.navItem}>Issues</div>
                <div className={styles.navItem}>Watching</div>
                <div className={styles.navItem}>Comments</div>
            </div>
        </div>
    )
}
