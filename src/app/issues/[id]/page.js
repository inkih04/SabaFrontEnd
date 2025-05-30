'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import IssueTitle from '../../../components/IssueTitle/IssueTitle';
import IssueHeader from '../../../components/IssueHeader/IssueHeader';
import IssueDescription from '../../../components/IssueDescription/IssueDescription';
import IssueAttachments from '../../../components/IssueAttachments/IssueAttachments';
import IssueComments from '../../../components/IssueComments/IssueComments';
import IssueStatus from '../../../components/IssueStatus/IssueStatus';
import styles from '../../../styles/IssuePage.module.css';

export default function IssuePage() {
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prevNextIds, setPrevNextIds] = useState({ prevId: null, nextId: null });
    const [meta, setMeta] = useState({
        statuses: [],
        severities: [],
        priorities: [],
        types: [],
        users: []
    });


    const params = useParams();

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

    useEffect(() => {
        console.log('params.id:', params.id);
        const loadAll = async () => {
            try {
                setLoading(true);

                const token = getToken();

                let issueId = params.id;

                const [issueRes, statusesRes, severitiesRes, prioritiesRes, typesRes, usersRes] =
                    await Promise.all([
                        fetch(`https://it22d-backend.onrender.com/api/issues/${issueId}/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json' }
                        }),
                        fetch(`https://it22d-backend.onrender.com/api/statuses/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json'  }
                        }),
                        fetch(`https://it22d-backend.onrender.com/api/severities/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json'  }
                        }),
                        fetch(`https://it22d-backend.onrender.com/api/priorities/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json' }
                        }),
                        fetch(`https://it22d-backend.onrender.com/api/types/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json'  }
                        }),
                        fetch(`https://it22d-backend.onrender.com/api/users/`, {
                            method: 'GET', headers: { Authorization: token, 'Content-Type': 'application/json'  }
                        })
                    ]);

                if (!issueRes.ok) {
                    const errorText = await issueRes.text();
                    throw new Error(`HTTP error! status: ${issueRes.status} - ${errorText}`);
                }

                const issueData = await issueRes.json();

                const [statuses, severities, priorities, types, users] =
                    await Promise.all([
                        statusesRes.json(),
                        severitiesRes.json(),
                        prioritiesRes.json(),
                        typesRes.json(),
                        usersRes.json()
                    ]);

                setIssue(issueData);
                setMeta({ statuses, severities, priorities, types, users });

                const listRes = await fetch(`https://it22d-backend.onrender.com/api/issues/`, {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    }
                });

                if (!listRes.ok) {
                    throw new Error('Error fetching issue list');
                }

                const allIssues = await listRes.json();
                const sortedIds = allIssues.map(i => i.id).sort((a, b) => a - b);
                const currentIndex = sortedIds.indexOf(Number(issueId));
                const prevId = sortedIds[currentIndex - 1] || null;
                const nextId = sortedIds[currentIndex + 1] || null;

                setPrevNextIds({ prevId, nextId });

            } catch (err) {
                console.error('Error loading the issue:', err);
                setError(err.message)
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    },[params.id]);

    if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid #ccc', borderTopColor: '#3498db', animation: 'spin 1s linear infinite' }}></div>
        </div>;
    }

    if (error) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'red', fontSize: '18px' }}>Error: {error}</div>;
    }
    if (!issue) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '18px' }}>Issue not found</div>;
    }

    return (
    <div className={styles.issueInfoMain}>
        {/* Contenido principal */}
        <div className={styles.issueInfoPrincipal}>
            <IssueTitle issue={issue} setIssue={setIssue} prevId={prevNextIds.prevId} nextId={prevNextIds.nextId}/>
            <IssueHeader issue={issue} />
            <IssueDescription issue={issue} setIssue={setIssue}/>
            <IssueAttachments issue={issue} setIssue={setIssue}/>
            <IssueComments issue={issue} setIssue={setIssue}/>
        </div>


        <div className={styles.issueInfoStatusContainer}>
            <IssueStatus issue={issue}
                         setIssue={setIssue}
                         statuses={meta.statuses}
                         severities={meta.severities}
                         priorities={meta.priorities}
                         types={meta.types}
                         users={meta.users}/>
        </div>
    </div>
    );
}