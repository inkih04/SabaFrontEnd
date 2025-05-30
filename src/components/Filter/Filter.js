'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './filter.module.css';

export default function Filter({ types, severities, priorities, statuses, users }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('');
    const [severity, setSeverity] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    // Inicializar filtros desde los query params
    useEffect(() => {
        setType(searchParams.get('issue_type') || '');
        setSeverity(searchParams.get('severity') || '');
        setPriority(searchParams.get('priority') || '');
        setStatus(searchParams.get('status') || '');
        setAssignedTo(searchParams.get('assigned_to') || '');
        setCreatedBy(searchParams.get('created_by') || '');
    }, [searchParams]);

    const applyFilters = e => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (type)       params.set('issue_type', type);
        if (severity)   params.set('severity', severity);
        if (priority)   params.set('priority', priority);
        if (status)     params.set('status', status);
        if (assignedTo) params.set('assigned_to', assignedTo);
        if (createdBy)  params.set('created_by', createdBy);

        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    const resetFilters = () => {
        router.push('/issueList');
        setIsOpen(false);
    };

    return (
        <>
            <button
                className={styles.filterButton}
                onClick={() => setIsOpen(true)}
                type="button"
            >
                <span className="material-icons">tune</span>
                <span>Filters</span>
            </button>

            <div className={`${styles.modal} ${isOpen ? styles.show : ''}`}>
                <div className={styles.modalContent}>
                    <div className={styles.navBarModal}>
                        <h2>Filters</h2>
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                            aria-label="Close filters"
                        >
                            &times;
                        </button>
                    </div>

                    <form onSubmit={applyFilters} className={styles.filters}>
                        {/* Type */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-type">Type</label>
                            <select
                                id="filter-type"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="">All</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.nombre}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Severity */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-severity">Severity</label>
                            <select
                                id="filter-severity"
                                value={severity}
                                onChange={e => setSeverity(e.target.value)}
                            >
                                <option value="">All</option>
                                {severities.map(s => (
                                    <option key={s.id} value={s.nombre}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-priority">Priority</label>
                            <select
                                id="filter-priority"
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                            >
                                <option value="">All</option>
                                {priorities.map(p => (
                                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-status">Status</label>
                            <select
                                id="filter-status"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                {statuses.map(s => (
                                    <option key={s.id} value={s.nombre}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned To */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-assigned-to">Assigned to</label>
                            <select
                                id="filter-assigned-to"
                                value={assignedTo}
                                onChange={e => setAssignedTo(e.target.value)}
                            >
                                <option value="">All</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.username}>{u.username}</option>
                                ))}
                            </select>
                        </div>

                        {/* Created By */}
                        <div className={styles.filtersField}>
                            <label htmlFor="filter-created-by">Created by</label>
                            <select
                                id="filter-created-by"
                                value={createdBy}
                                onChange={e => setCreatedBy(e.target.value)}
                            >
                                <option value="">All</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.username}>{u.username}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className={styles.filtersSubmit}>
                            Apply Filters
                        </button>
                        <button
                            type="button"
                            className={styles.filtersReset}
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
