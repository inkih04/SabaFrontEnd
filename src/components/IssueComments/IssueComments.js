'use client';

import React, { useState } from 'react';
import styles from './IssueComments.module.css';

export default function IssueComments({ issue, setIssue }) {
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const getToken = () => {
        if (typeof document === 'undefined') return null;
        const c = document.cookie.split(';').find(c => c.trim().startsWith('token='));
        return c ? c.split('=')[1] : null;
    };

    // Añadir comentario
    const handleAdd = async (e) => {
        e.preventDefault();
        const token = getToken();
        const res = await fetch('https://it22d-backend.onrender.com/api/comments/', {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ issue: issue.id, text: newText })
        });
        if (res.ok) {
            const comment = await res.json();
            setIssue(prev => ({
                ...prev,
                comments: [...prev.comments, comment]
            }));
            setNewText('');
        }
    };

    // Iniciar edición
    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditingText(comment.text);
    };

    // Guardar edición
    const handleEdit = async (e) => {
        e.preventDefault();
        const token = getToken();
        const res = await fetch(`https://it22d-backend.onrender.com/api/comments/${editingId}/`, {
            method: 'PUT',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: editingText })
        });
        if (res.ok) {
            const updated = await res.json();
            setIssue(prev => ({
                ...prev,
                comments: prev.comments.map(c => c.id === updated.id ? updated : c)
            }));
            setEditingId(null);
            setEditingText('');
        }
    };

    // Borrar comentario
    const handleDelete = async (id) => {
        const token = getToken();
        const res = await fetch(`https://it22d-backend.onrender.com/api/comments/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: token }
        });
        if (res.ok) {
            setIssue(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c.id !== id)
            }));
        }
    };

    return (
        <div className={styles.issueInfoComments}>
            <div className={styles.issueInfoCommentsTitle}>
                <h2>Comments</h2>
            </div>

            {issue.comments.length === 0 && <p>No comments yet.</p>}

            {issue.comments.map(comment => (
                <div key={comment.id} className={styles.issueInfoComment}>
                    {comment.user.avatarUrl && (
                        <img
                            src={comment.user.avatarUrl}
                            alt="Avatar"
                            className={styles.commentAvatar}
                        />
                    )}
                    <div className={styles.issueInfoCommentMain}>
                        <p><strong>{comment.user.username}</strong></p>
                        {editingId === comment.id ? (
                            <form onSubmit={handleEdit} className={styles.editCommentForm}>
                <textarea
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                />
                                <button type="submit" className={styles.infoIssueSaveButton}>Save</button>
                                <button
                                    type="button"
                                    className={styles.cancelEditComment}
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <p className={styles.commentText}>{comment.text}</p>
                                <p className={styles.issueInfoCommentDate}>
                                    {new Date(comment.published_at).toLocaleString()}
                                </p>
                            </>
                        )}
                    </div>
                    <div className={styles.issueInfoCommentButtons}>
                        {editingId !== comment.id && (
                            <a className={styles.EditComment}>
                                <span
                                    className="material-icons"
                                    onClick={() => startEdit(comment)}
                                >
                edit
              </span>
                            </a>
                        )}
                        <a className={styles.DeleteComment}>
                        <span
                            className="material-icons"
                            onClick={() => handleDelete(comment.id)}
                        >
              delete
            </span>
                            </a>
                    </div>
                </div>
            ))}

            <form onSubmit={handleAdd} className={styles.addCommentForm}>
        <textarea
            placeholder="Type a new comment here"
            value={newText}
            onChange={e => setNewText(e.target.value)}
        />
                <div className={styles.saveButtons}>
                    <button type="submit" className={styles.infoIssueSaveButton}>Add Comment</button>
                </div>
            </form>
        </div>
    );
}
