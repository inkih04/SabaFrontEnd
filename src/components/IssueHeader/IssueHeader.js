import styles from './IssueHeader.module.css';

export default function IssueHeader({ issue }) {
    return (
        <div className={styles.issueInfoHeader}>
            <h2>Issue Details</h2>
            <div className={styles.issueInfoCreated}>
                <p><strong>Created by:</strong> {issue.created_by}</p>
                <p><strong>Created at:</strong> {new Date(issue.created_at).toLocaleString()}</p>
            </div>
        </div>
    );
}
