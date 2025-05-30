'use client';

import React, { useState, useEffect } from 'react';
import styles from './IssueStatus.module.css';

export default function IssueStatus({
                                        issue,
                                        setIssue,
                                        statuses,
                                        severities,
                                        priorities,
                                        types,
                                        users
                                    }) {
    const [showWatchersModal, setShowWatchersModal] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [showAssigneesModal, setShowAssigneesModal] = useState(false);
    const [selectedWatchers, setSelectedWatchers] = useState([]);
    const [showDueDateModal, setShowDueDateModal] = useState(false);
    const [dueDate, setDueDate] = useState(issue.due_date || '');
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getToken = () => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        return tokenCookie?.split('=')[1].trim() || null;
    };

    useEffect(() => {
        async function fetchCurrentUser() {
            const token = getToken();
            if (!token) return;
            try {
                const resp = await fetch('https://it22d-backend.onrender.com/api/profiles/me/', {
                    cache: 'no-store',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                });
                if (!resp.ok) throw new Error('Unable to get user');
                const profile = await resp.json();
                setCurrentUser(profile.user);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        }
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        setDueDate(issue.due_date || '');
    }, [issue]);

    // Función genérica para hacer PATCH requests
    const updateIssue = async (updateData) => {
        const token = getToken();
        if (!token) {
            setError('No authentication token found');
            return false;
        }

        setIsLoading(true);
        try {
            console.log('=== DEBUGGING INFO ===');
            console.log('Issue ID:', issue.id);
            console.log('Update data being sent:', JSON.stringify(updateData, null, 2));
            console.log('Current issue state:', issue);
            console.log('Token exists:', !!token);

            const res = await fetch(`https://it22d-backend.onrender.com/api/issues/${issue.id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            console.log('Response status:', res.status);

            const responseText = await res.text();
            console.log('Raw response:', responseText);

            if (!res.ok) {
                console.error('Error response:', responseText);
                throw new Error(`HTTP ${res.status}: ${responseText}`);
            }

            let updated;
            try {
                updated = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                throw new Error('Invalid JSON response from server');
            }

            console.log('Updated issue received from server:', updated);
            console.log('=== END DEBUGGING ===');

            setIssue(updated);
            setError(null);
            return true;
        } catch (err) {
            console.error('Error updating issue:', err);
            setError(`Error saving changes: ${err.message}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handlers simplificados
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        console.log('Changing status to:', newStatus);
        await updateIssue({ status_name: newStatus });
    };

    const handleSeverityChange = async (e) => {
        const newSeverity = e.target.value;
        console.log('Changing severity to:', newSeverity);
        await updateIssue({ severity_name: newSeverity });
    };

    const handlePriorityChange = async (e) => {
        const newPriority = e.target.value;
        console.log('Changing priority to:', newPriority);
        await updateIssue({ priority_name: newPriority });
    };

    const handleTypeChange = async (e) => {
        const newType = e.target.value;
        console.log('Changing type to:', newType);
        await updateIssue({ issue_type_name: newType });
    };

    const handleAssignToMe = async () => {
        if (!currentUser) return;
        await updateIssue({
            assigned_to_username: currentUser.username,
            assigned_to: currentUser.username
        });
    };

    // Usa el nuevo endpoint para remover asignación
    const handleRemoveAssigned = async () => {
        console.log('Eliminando assigned:', issue.assigned_to);

        try {
            const token = getToken();
            setIsLoading(true);

            const response = await fetch(
                `https://it22d-backend.onrender.com/api/issues/${issue.id}/assignment/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Remove assigned error:', errorText);
                throw new Error(`Remove assigned failed: ${response.status}`);
            }

            // Actualizar el estado local
            setIssue({
                ...issue,
                assigned_to: null,
                assigned_to_username: null
            });

            console.log('Assigned eliminado exitosamente');
            setError(null);

        } catch (error) {
            console.error('Error removing assigned:', error);
            setError('Error al eliminar el asignado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignSubmit = async () => {
        if (!selectedAssignee) return;
        const success = await updateIssue({
            assigned_to_username: selectedAssignee,
            assigned_to: selectedAssignee
        });
        if (success) {
            setShowAssigneesModal(false);
            setSelectedAssignee('');
        }
    };

    const handleWatchersSubmit = async () => {
        if (selectedWatchers.length === 0) return;
        const currentWatchers = Array.isArray(issue.watchers) ? issue.watchers : [];
        const updatedWatchers = [...currentWatchers, ...selectedWatchers];

        const success = await updateIssue({
            watchers_usernames: updatedWatchers,
            watchers: updatedWatchers
        });
        if (success) {
            setShowWatchersModal(false);
            setSelectedWatchers([]);
        }
    };

    const handleWatchIssue = async () => {
        if (!currentUser) return;
        const currentWatchers = Array.isArray(issue.watchers) ? issue.watchers : [];
        const updatedWatchers = [...currentWatchers, currentUser.username];
        await updateIssue({
            watchers_usernames: updatedWatchers,
            watchers: updatedWatchers
        });
    };

    const handleUnwatchIssue = async () => {
        if (!currentUser) return;

        try {
            setIsLoading(true);
            const token = getToken();

            // Buscar el ID del usuario actual en la lista de watchers
            const currentWatcherId = users.find(u => u.username === currentUser.username)?.id;

            if (!currentWatcherId) {
                throw new Error('No se pudo encontrar el ID del usuario actual');
            }

            const response = await fetch(
                `https://it22d-backend.onrender.com/api/issues/${issue.id}/watchers/${currentWatcherId}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Unwatch error:', errorText);
                throw new Error(`Unwatch failed: ${response.status}`);
            }

            // Actualizar el estado local eliminando al usuario actual de los watchers
            const currentWatchers = Array.isArray(issue.watchers) ? issue.watchers : [];
            const updatedWatchers = currentWatchers.filter(w => {
                const watcherName = typeof w === 'string' ? w : (w.username || w.name);
                return watcherName !== currentUser.username;
            });

            setIssue({
                ...issue,
                watchers: updatedWatchers
            });

            console.log('Issue unwatched exitosamente');
            setError(null);

        } catch (error) {
            console.error('Error unwatching issue:', error);
            setError('Error al dejar de seguir el issue');
        } finally {
            setIsLoading(false);
        }
    };

    // Usa el nuevo endpoint para eliminar watcher específico
    const handleDeleteWatcher = async (watcherToDelete) => {
        console.log('Eliminando watcher:', watcherToDelete);

        try {
            setIsLoading(true);
            const token = getToken();

            // Buscar el ID del usuario watcher
            const watcherUser = users.find(u => u.username === watcherToDelete);

            if (!watcherUser) {
                throw new Error('No se pudo encontrar el ID del usuario watcher');
            }

            const response = await fetch(
                `https://it22d-backend.onrender.com/api/issues/${issue.id}/watchers/${watcherUser.id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Delete watcher error:', errorText);
                throw new Error(`Delete watcher failed: ${response.status}`);
            }

            // Actualizar el estado local
            const currentWatchers = Array.isArray(issue.watchers) ? issue.watchers : [];
            const updatedWatchers = currentWatchers.filter(w => {
                const watcherName = typeof w === 'string' ? w : (w.username || w.name);
                return watcherName !== watcherToDelete;
            });

            setIssue({
                ...issue,
                watchers: updatedWatchers
            });

            console.log('Watcher eliminado exitosamente');
            setError(null);

        } catch (error) {
            console.error('Error deleting watcher:', error);
            setError('Error al eliminar el watcher');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDueDateSubmit = async () => {
        const success = await updateIssue({ due_date: dueDate });
        if (success) {
            setShowDueDateModal(false);
        }
    };

    const handleRemoveDueDate = async () => {
        const success = await updateIssue({ due_date: null });
        if (success) {
            setShowDueDateModal(false);
            setDueDate('');
        }
    };

    const handleDeleteIssue = async () => {
        if (!confirm('Are you sure you want to delete this issue?')) return;

        const token = getToken();
        setIsLoading(true);
        try {
            const res = await fetch(`https://it22d-backend.onrender.com/api/issues/${issue.id}/`, {
                method: 'DELETE',
                headers: { Authorization: token }
            });
            if (res.ok) {
                window.location.href = '../../issueList';
            } else {
                throw new Error('Failed to delete issue');
            }
        } catch (err) {
            console.error('Error deleting issue:', err);
            setError('Error deleting issue');
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return <p>Loading user info...</p>;
    }

    return (
        <aside className={styles.issueInfoStatus}>
            {/* Error message */}
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div style={{ color: 'blue', marginBottom: '10px' }}>
                    Saving changes...
                </div>
            )}

            {/* Status */}
            <div>
                <strong>Status:</strong>
                <select
                    className={styles.sutilSelect}
                    value={issue.status || ''}
                    onChange={handleStatusChange}
                    disabled={isLoading}
                >
                    {statuses.map(s => (
                        <option key={s.id} value={s.nombre}>
                            {s.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Severity, Priority, Type */}
            <div className={styles.issueInfoStatusProperties}>
                <div className={styles.issueInfoStatusPropertiesSeverity}>
                    <strong>Severity:</strong>
                    <select
                        className={styles.sutilSelect}
                        value={issue.severity || ''}
                        onChange={handleSeverityChange}
                        disabled={isLoading}
                    >
                        {severities.map(s => (
                            <option key={s.id} value={s.nombre}>{s.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.issueInfoStatusPropertiesPriority}>
                    <strong>Priority:</strong>
                    <select
                        className={styles.sutilSelect}
                        value={issue.priority || ''}
                        onChange={handlePriorityChange}
                        disabled={isLoading}
                    >
                        {priorities.map(p => (
                            <option key={p.id} value={p.nombre}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.issueInfoStatusPropertiesType}>
                    <strong>Type:</strong>
                    <select
                        className={styles.sutilSelect}
                        value={issue.issue_type || ''}
                        onChange={handleTypeChange}
                        disabled={isLoading}
                    >
                        {types.map(t => (
                            <option key={t.id} value={t.nombre}>{t.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Assigned */}
            <div className={styles.issueInfoStatusAssigned}>
                <strong>Assigned to:</strong>
                {issue.assigned_to ? (
                    <div className={styles.issueInfoAssignedItem}>
                        <span>{issue.assigned_to}</span>
                        <button
                            className={styles.issueInfoDeleteButton}
                            onClick={handleRemoveAssigned}
                            disabled={isLoading}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                ) : (
                    <p>Issue not assigned</p>
                )}
                <div className={styles.issueInfoStatusAssignedButtons}>
                    <button
                        className={styles.issueInfoStatusAssignedButton}
                        onClick={() => setShowAssigneesModal(true)}
                        disabled={isLoading}
                    >
                        <span className="material-icons">add</span> Assign Issue
                    </button>

                    {issue.assigned_to !== currentUser.username && (
                        <button
                            className={styles.issueInfoStatusAssignedButton}
                            onClick={handleAssignToMe}
                            disabled={isLoading}
                        >
                            <span className="material-icons">add</span> Assign to me
                        </button>
                    )}
                </div>

                {/* Modal para asignar */}
                {showAssigneesModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Assign issue</h2>
                            <select
                                value={selectedAssignee}
                                onChange={e => setSelectedAssignee(e.target.value)}
                            >
                                <option value="">-- Select a user --</option>
                                {users
                                    .filter(u => u.username !== issue.assigned_to)
                                    .map(u => (
                                        <option key={u.id} value={u.username}>
                                            {u.username}
                                        </option>
                                    ))}
                            </select>
                            <div className={styles.modalActions}>
                                <button
                                    onClick={handleAssignSubmit}
                                    className={styles.infoIssueSaveButton}
                                    disabled={!selectedAssignee || isLoading}
                                >
                                    Assign
                                </button>
                                <button
                                    className={styles.issueInfoStatusAssignedButton}
                                    onClick={() => {
                                        setShowAssigneesModal(false);
                                        setSelectedAssignee('');
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Watchers */}
            <div className={styles.issueInfoStatusWatchers}>
                <strong>Watchers:</strong>
                <div className={styles.issueInfoStatusWatchersList}>
                    {Array.isArray(issue.watchers) && issue.watchers.map((watcher, index) => (
                        <div key={`${watcher}-${index}`} className={styles.issueInfoWatcherItem}>
                            <span>{typeof watcher === 'string' ? watcher : watcher.username || watcher.name}</span>
                            <button
                                className={styles.issueInfoDeleteButton}
                                onClick={() => handleDeleteWatcher(typeof watcher === 'string' ? watcher : watcher.username)}
                                disabled={isLoading}
                            >
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.issueInfoStatusAssignedButtons}>
                    <button
                        className={styles.issueInfoStatusAssignedButton}
                        onClick={() => setShowWatchersModal(true)}
                        disabled={isLoading}
                    >
                        <span className="material-icons">add</span> Add watchers
                    </button>

                    {currentUser && Array.isArray(issue.watchers) && (
                        issue.watchers.some(w => {
                            const watcherName = typeof w === 'string' ? w : w.username;
                            return watcherName === currentUser.username;
                        }) ? (
                            <button
                                onClick={handleUnwatchIssue}
                                className={styles.issueInfoStatusAssignedButton}
                                disabled={isLoading}
                            >
                                <span className="material-icons">visibility_off</span>
                                <p>Unwatch</p>
                            </button>
                        ) : (
                            <button
                                onClick={handleWatchIssue}
                                className={styles.issueInfoStatusAssignedButton}
                                disabled={isLoading}
                            >
                                <span className="material-icons">visibility</span>
                                <p>Watch</p>
                            </button>
                        )
                    )}
                </div>

                {/* Modal para watchers */}
                {showWatchersModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Add Watchers</h2>
                            <select
                                multiple
                                value={selectedWatchers}
                                onChange={e =>
                                    setSelectedWatchers(Array.from(e.target.selectedOptions, o => o.value))
                                }
                            >
                                {users
                                    .filter(u => {
                                        if (!Array.isArray(issue.watchers)) return true;
                                        return !issue.watchers.some(w => {
                                            const watcherName = typeof w === 'string' ? w : w.username;
                                            return watcherName === u.username;
                                        });
                                    })
                                    .map(u => (
                                        <option key={u.id} value={u.username}>
                                            {u.username}
                                        </option>
                                    ))}
                            </select>
                            <div className={styles.modalActions}>
                                <button
                                    onClick={handleWatchersSubmit}
                                    className={styles.infoIssueSaveButton}
                                    disabled={selectedWatchers.length === 0 || isLoading}
                                >
                                    Add
                                </button>
                                <button
                                    className={styles.issueInfoStatusAssignedButton}
                                    onClick={() => {
                                        setShowWatchersModal(false);
                                        setSelectedWatchers([]);
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Due Date & Delete */}
            <div className={styles.issueInfoStatusButtons}>
                <button
                    className={`${styles.issueInfoStatusButtonsIcon} ${
                        issue.due_date
                            ? new Date(issue.due_date) < new Date()
                                ? styles.issueInfoDueDateExpired
                                : styles.issueInfoDueDateSet
                            : ''
                    }`}
                    onClick={() => setShowDueDateModal(true)}
                    disabled={isLoading}
                >
                    <span className="material-icons">schedule</span>
                </button>

                {showDueDateModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Set Due Date</h2>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                            <div className={styles.modalActions}>
                                <button
                                    onClick={handleDueDateSubmit}
                                    className={styles.infoIssueSaveButton}
                                    disabled={isLoading}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleRemoveDueDate}
                                    className={styles.infoIssueDeleteDueDateButton}
                                    disabled={isLoading}
                                >
                                    <span className="material-icons">delete</span>
                                </button>
                                <button
                                    onClick={() => setShowDueDateModal(false)}
                                    className={styles.issueInfoStatusAssignedButton}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    className={styles.issueInfoStatusButtonsIcon}
                    onClick={handleDeleteIssue}
                    disabled={isLoading}
                >
                    <span className="material-icons">delete</span>
                </button>
            </div>
        </aside>
    );
}