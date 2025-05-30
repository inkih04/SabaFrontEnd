'use client';
import React, { useState } from 'react';
import styles from './Search.module.css';

export default function IssueSearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue.trim());
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.issueSearchBar}>
                <div className={styles.issueSearchBarContainer}>
                    <span className="material-icons">search</span>
                    <input
                        type="text"
                        placeholder="Search issues..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
            </div>
        </form>
    );
}
