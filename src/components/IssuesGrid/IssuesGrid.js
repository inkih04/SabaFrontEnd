import { useState } from 'react';
import styles from './IssuesGrid.module.css';

const IssuesGrid = ({
                        issues = [],
                        statuses = [],
                        users = [],
                        priorities = [],
                        severities = [],
                        types = [],
                        currentSort = { field: '', direction: '' },
                        onSortChange,
                        onStatusUpdate,
                        onAssigneeUpdate,
                        onDeleteIssue
                    }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const getSortIcon = (field) => {
        if (currentSort.field === field) {
            return currentSort.direction === '-' ? 'arrow_downward' : 'arrow_upward';
        }
        return 'unfold_more';
    };

    const handleSort = (field) => {
        const newDirection = currentSort.field === field && currentSort.direction === '' ? '-' : '';
        onSortChange(`${newDirection}${field}`);
    };

    const handleStatusChange = (issueId, statusName) => {
        onStatusUpdate(issueId, statusName);
    };

    const handleAssigneeChange = (issueId, username) => {
        onAssigneeUpdate(issueId, username);
    };

    const getColorByName = (items, name, defaultColor = '#c5c5c5') => {
        const item = items.find(item => item.nombre === name);
        return item?.color || defaultColor;
    };

    return (
        <section className={styles.issueTable}>
            {/* Header */}
            <div className={styles.issueKeyContainer}>
                {[
                    { label: 'Type', field: 'issue_type' },
                    { label: 'Severity', field: 'severity' },
                    { label: 'Priority', field: 'priority' },
                    { label: 'Issue', field: 'id' },
                    { label: 'Status', field: 'status' },
                    { label: 'Modified', field: 'created_at' },
                    { label: 'Assign to', field: 'assigned_to' }
                ].map(({ label, field }) => (
                    <span key={field} className={styles.issueKey}>
                        <div className={styles.sortHeader}>
                            <span>{label}</span>
                            <a
                                href="#"
                                className={styles.sortIcon}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSort(field);
                                }}
                            >
                                <span className="material-icons">
                                    {getSortIcon(field)}
                                </span>
                            </a>
                        </div>
                    </span>
                ))}
            </div>

            <ul>
                {issues.map((issue) => (
                    <li key={issue.id} className={styles.issueItem}>
                        <div className={styles.issueItemContent}>
                            <div
                                className={styles.issueType}
                                style={{ backgroundColor: getColorByName(types, issue.issue_type) }}
                            />
                            <div
                                className={styles.issueSeverity}
                                style={{ backgroundColor: getColorByName(severities, issue.severity) }}
                            />
                            <div
                                className={styles.issuePriority}
                                style={{ backgroundColor: getColorByName(priorities, issue.priority) }}
                            />
                            <a className={styles.issueDetailLink} href={`/issues/${issue.id}`}>
                                <div className={styles.issueDetail}>
                                    <p className={styles.issueId}>#{issue.id}</p>
                                    <p className={styles.issueTopic}>{issue.subject}</p>
                                    <p className={styles.issueDescription}>{issue.description}</p>
                                </div>
                            </a>

                            {/* Status selector */}
                            <form className={styles.issueForm} onSubmit={(e) => e.preventDefault()}>
                                <select
                                    name="status"
                                    className={styles.issueSelect}
                                    value={issue.status || ''}
                                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <option key={status.nombre} value={status.nombre}>
                                            {status.nombre}
                                        </option>
                                    ))}
                                </select>
                            </form>

                            <p className={styles.issueText}>
                                {new Date(issue.created_at).toLocaleDateString()}
                            </p>

                            {/* Assignee selector */}
                            <form className={styles.issueForm} onSubmit={(e) => e.preventDefault()}>
                                <select
                                    className={styles.issueSelect}
                                    name="assigned_to"
                                    value={issue.assigned_to || ''}
                                    onChange={(e) => handleAssigneeChange(issue.id, e.target.value)}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map((user) => (
                                        <option key={user.username} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </form>

                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDeleteIssue(issue.id);
                                }}
                            >
                                <span className={`material-icons ${styles.issueIcon}`}>delete</span>
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default IssuesGrid;
