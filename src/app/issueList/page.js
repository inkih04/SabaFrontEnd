'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import IssueGrid from '../../components/IssuesGrid/IssuesGrid';
import styles from "../../styles/issueList.module.css";
import Filter from "../../components/Filter/Filter";
import IssueSearchBar from '../../components/Search/Search';
import AddBulk from '../../components/AddBulk/AddBulk';
import AddIssue from '../../components/AddIssue/AddIssue';

export default function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSort, setCurrentSort] = useState({ field: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const searchParams = useSearchParams();

    const getToken = () => {
        if (typeof document === 'undefined') return null;

        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie =>
            cookie.trim().startsWith('token=')
        );

        if (tokenCookie) {
            return tokenCookie.split('=')[1].trim();
        }

        return null;
    };

    const fetchWithAuth = async (url) => {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);

                const [
                    usersData,
                    statusesData,
                    prioritiesData,
                    severitiesData,
                    typesData
                ] = await Promise.all([
                    fetchWithAuth('https://it22d-backend.onrender.com/api/users/'),
                    fetchWithAuth('https://it22d-backend.onrender.com/api/statuses/'),
                    fetchWithAuth('https://it22d-backend.onrender.com/api/priorities/'),
                    fetchWithAuth('https://it22d-backend.onrender.com/api/severities/'),
                    fetchWithAuth('https://it22d-backend.onrender.com/api/types/')
                ]);

                setUsers(usersData);
                setStatuses(statusesData);
                setPriorities(prioritiesData);
                setSeverities(severitiesData);
                setTypes(typesData);
            } catch (err) {
                console.error('Error loading metadata:', err);
                setError(err.message);
            }
        };

        loadAllData();
    }, []);

    useEffect(() => {
        const loadIssues = async () => {
            try {
                setLoading(true);

                let issuesUrl = '';

                if (searchQuery) {
                    issuesUrl = `https://it22d-backend.onrender.com/api/issues/search/${encodeURIComponent(searchQuery)}/`;
                } else {
                    const query = new URLSearchParams();
                    const paramMap = {
                        status: 'status_name',
                        priority: 'priority_name',
                        severity: 'severity_name',
                        issue_type: 'issue_type',
                        assigned_to_username: 'assigned_to_username',
                        created_by: 'created_by_username'
                    };

                    Object.keys(paramMap).forEach(key => {
                        const value = searchParams.get(key);
                        if (value) query.set(paramMap[key], value);
                    });

                    issuesUrl = `https://it22d-backend.onrender.com/api/issues/?${query.toString()}`;
                }

                const issuesData = await fetchWithAuth(issuesUrl);
                setIssues(issuesData);
            } catch (err) {
                console.error('Error loading issues:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadIssues();
    }, [searchParams, searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSortChange = (sortString) => {
        const direction = sortString.startsWith('-') ? '-' : '';
        const field = sortString.replace('-', '');

        setCurrentSort({ field, direction });

        const sortedIssues = [...issues].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (field === 'created_at') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return direction === '-' ? 1 : -1;
            if (aValue > bValue) return direction === '-' ? -1 : 1;
            return 0;
        });

        setIssues(sortedIssues);
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        try {
            const token = getToken();
            const response = await fetch(`https://it22d-backend.onrender.com/api/issues/${issueId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status_name: newStatus }),
            });

            if (response.ok) {
                setIssues(issues.map(issue =>
                    issue.id === issueId ? { ...issue, status: newStatus } : issue
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAssigneeUpdate = async (issueId, newAssignee) => {
        try {
            const token = getToken();
            const response = await fetch(`https://it22d-backend.onrender.com/api/issues/${issueId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assigned_to_username: newAssignee || null }),
            });

            if (response.ok) {
                const updatedIssue = await response.json();
                setIssues(issues.map(issue =>
                    issue.id === issueId ? updatedIssue : issue
                ));
            }
        } catch (error) {
            console.error('Error updating assignee:', error);
        }
    };

    const handleBulkCreate = (createdIssues) => {
        setIssues((prevIssues) => [...createdIssues, ...prevIssues]);
    };

    const handleDeleteIssue = async (issueId) => {
        try {
            const token = getToken();
            const response = await fetch(`https://it22d-backend.onrender.com/api/issues/${issueId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIssues(issues.filter(issue => issue.id !== issueId));
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '18px' }}>Cargando issues...</div>;
    }

    if (error) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'red', fontSize: '18px' }}>Error: {error}</div>;
    }

    return (
        <div style={{ maxWidth: '100%', margin: 'auto', padding: 20 }}>
            <h1>Issues</h1>
            <div className={styles.issueFilterAddContainer}>
                <div className={styles.issueFilter}>
                    <Filter types={types} severities={severities} priorities={priorities} statuses={statuses} users={users} />
                    <IssueSearchBar onSearch={handleSearch} />
                </div>
                <div className={styles.issueAdd}>
                    <AddIssue
                        users={users}
                        statuses={statuses}
                        priorities={priorities}
                        severities={severities}
                        types={types}
                        onIssueCreated={(newIssue) => setIssues(prev => [newIssue, ...prev])}
                    />
                    <AddBulk onBulkCreate={handleBulkCreate} />
                </div>
            </div>

            <IssueGrid
                issues={issues}
                users={users}
                statuses={statuses}
                priorities={priorities}
                severities={severities}
                types={types}
                currentSort={currentSort}
                onSortChange={handleSortChange}
                onStatusUpdate={handleStatusUpdate}
                onAssigneeUpdate={handleAssigneeUpdate}
                onDeleteIssue={handleDeleteIssue}
            />
        </div>
    );
}