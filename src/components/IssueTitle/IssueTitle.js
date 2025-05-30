'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './IssueTitle.module.css';

export default function IssueTitle({ issue, setIssue, prevId, nextId }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [subject, setSubject] = useState(issue.subject);

    const getToken = () => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1].trim() : null;
    };

    const handleSubmit = async (e) => {



        e.preventDefault();
        console.log("Saving subject:", subject);
        const token = getToken();
        const issueId = issue.id;
        const res = await fetch(`https://it22d-backend.onrender.com/api/issues/${issueId}/`, {
            method: 'PATCH',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: subject }),
        });
        if (res.ok) {
            setIsEditing(false);
            router.refresh();
        }
    };

    return (
        <div className={styles.issueInfoTitleTitle}>
            {isEditing ? (
                <form onSubmit={handleSubmit} className={styles.issueInfoTitleForm}>
                    <h1 className={styles.issueTitleHeader}>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className={styles.issueInfoTitleInput}
                        />
                        <button type="submit" className={styles.issueInfoTitleSaveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSubject(issue.subject);
                                setIsEditing(false);
                            }}
                            className={styles.issueInfoTitleCancelEdit}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </h1>
                </form>
            ) : (
                <h1 className={styles.issueTitleHeader}>
                    #{issue.id} {subject}
                    <div
                        className={styles.issueInfoTitleEdit}
                        onClick={() => setIsEditing(true)}
                    >
                        <span className="material-icons">edit</span>
                    </div>
                    {issue.due_date && (
                        <div
                            className={
                                new Date(issue.due_date) < new Date()
                                    ? styles.issueInfoDueDateTitleExpired
                                    : styles.issueInfoDueDateTitleSet
                            }
                        >
                            <span className="material-icons">schedule</span>
                        </div>
                    )}
                </h1>
            )}
        </div>
    );
}
