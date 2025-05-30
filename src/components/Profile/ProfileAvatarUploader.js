// src/components/Profile/ProfileAvatarUploader.js
'use client'
import React, { useRef, useState } from 'react'

// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function ProfileAvatarUploader({
                                                  avatarUrl,
                                                  profileId,
                                                  isOwn,
                                                  onAvatarUpdated,
                                              }) {
    const fileInputRef = useRef()
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setUploading(true)
            const token = getToken()
            if (!token) throw new Error('No se encontró token para subir avatar')

            const res = await fetch(
                'https://it22d-backend.onrender.com/api/profiles/edit-picture/',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: token,
                        // NO especificar Content-Type: el navegador pone el multipart/form-data correcto
                    },
                    body: formData,
                }
            )
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || 'Error subiendo avatar')
            }
            const data = await res.json()
            onAvatarUpdated(data.avatar)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="profile__avatar-wrapper">
            <div className="profile__avatar-circle">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="profile__avatar-img" />
                ) : (
                    <div className="default-avatar">
                        <span className="material-icons">person</span>
                    </div>
                )}
                {/* Si es propio, mostramos el overlay de editar */}
                {isOwn && (
                    <div
                        className="avatar-form"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="avatar-edit-icon">
                            <span className="material-icons">edit</span>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="avatar"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </div>
            {uploading && <p>Subiendo avatar…</p>}
            {error && <p className="alert">{error}</p>}
        </div>
    )
}
