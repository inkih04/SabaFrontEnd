// src/components/Profile/ProfileBioModal.js
'use client'
import React, { useState } from 'react'

// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function ProfileBioModal({
                                            currentBiography = '',
                                            onClose,
                                            onSaved,
                                        }) {
    const [biography, setBiography] = useState(currentBiography)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            const token = getToken()
            if (!token) throw new Error('No se encontró token para actualizar bio')

            const res = await fetch(
                'https://it22d-backend.onrender.com/api/profiles/edit-bio/',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ biography }),
                }
            )
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || 'Error actualizando bio')
            }
            const data = await res.json()
            onSaved(data.biography)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    // Función para manejar clicks en el backdrop
    const handleBackdropClick = (e) => {
        // Solo cerrar si el click es exactamente en el backdrop, no en sus hijos
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Prevenir que el modal se cierre cuando se hace click dentro del contenido
    const handleContentClick = (e) => {
        e.stopPropagation()
    }

    return (
        <div className="profile__modal" onClick={handleBackdropClick}>
            <div className="profile__modal-content" onClick={handleContentClick}>
                <div className="profile__modal-header">
                    <h1>Edit Bio</h1>
                    <button
                        className="profile__modal-close"
                        onClick={onClose}
                        type="button"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="profile__modal-form">
                    <label htmlFor="biography">Your biography</label>
                    <textarea
                        id="biography"
                        name="biography"
                        rows="6"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="Escribe algo sobre ti..."
                        autoFocus
                    />
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </form>
                {error && <p className="alert">{error}</p>}
            </div>
        </div>
    )
}