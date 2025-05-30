// src/components/CommentsList.js
'use client'
import React, { useEffect, useState } from 'react'
import './comments.css'

// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function CommentsList({ profileId }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchComments() {
            try {
                const token = getToken()
                if (!token) throw new Error('No se encontró token para cargar comentarios')

                const res = await fetch(
                    `https://it22d-backend.onrender.com/api/profiles/${profileId}/user-comments/`,
                    {
                        cache: 'no-store',
                        headers: {
                            Authorization: token,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (!res.ok) throw new Error('Error loading comments')
                const data = await res.json()
                setComments(data)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (profileId) fetchComments()
    }, [profileId])

    if (loading) return <div>Loading comments…</div>
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
    if (!comments.length) return <p>Has not written any comments.</p>

    return (
        <div className="issue-info-comments">
            <div className="issue-info-comments-title">
                <h2>{comments.length} Comentarios</h2>
            </div>
            {comments.map((c) => (
                <div key={c.id} className="issue-info-comment">
                    {c.user.avatar ? (
                        <img
                            src={c.user.avatar}
                            alt="avatar"
                            className="issue-info-comment-avatar profile--comment"
                        />
                    ) : (
                        <span className="material-icons">person</span>
                    )}
                    <div className="issue-info-comment-main">
                        <p>
                            <strong>{c.user.username}</strong> en el issue:{' '}
                            <a
                                className="profile__to-issue-link"
                                href={`/issues/${c.issue_id}`}
                            >
                                {c.issue_subject} (click para ver)
                            </a>
                        </p>
                        <p>{c.content}</p>
                        <p className="issue-info-comment-date">{new Date(c.published_at).toLocaleString()}</p>
                    </div>
                    <div className="issue-info-comment-buttons">
                        <div className="issue-info-status-buttons-comment-delete">
                            <a href="#">
                                <span className="material-icons">delete</span>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
