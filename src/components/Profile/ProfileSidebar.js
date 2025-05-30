// src/components/Profile/ProfileSidebar.js
'use client'
import React, { useEffect, useState } from 'react'

// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function ProfileSidebar() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showBioModal, setShowBioModal] = useState(false)
    const [statistics, setStatistics] = useState({
        assignedIssues: 0,
        watchedIssues: 0,
        userComments: 0
    })

    // Función para obtener estadísticas específicas
    const fetchStatistics = async (profileId, token) => {
        try {
            const baseUrl = 'https://it22d-backend.onrender.com'
            const headers = {
                Authorization: token,
                'Content-Type': 'application/json'
            }

            // Obtener issues asignados
            const assignedRes = await fetch(`${baseUrl}/api/profiles/${profileId}/assigned-issues/`, {
                headers,
                cache: 'no-store'
            })
            const assignedIssues = assignedRes.ok ? await assignedRes.json() : []

            // Obtener issues observados
            const watchedRes = await fetch(`${baseUrl}/api/profiles/${profileId}/watched-issues/`, {
                headers,
                cache: 'no-store'
            })
            const watchedIssues = watchedRes.ok ? await watchedRes.json() : []

            // Obtener comentarios del usuario
            const commentsRes = await fetch(`${baseUrl}/api/profiles/${profileId}/user-comments/`, {
                headers,
                cache: 'no-store'
            })
            const userComments = commentsRes.ok ? await commentsRes.json() : []

            return {
                assignedIssues: assignedIssues.length,
                watchedIssues: watchedIssues.length,
                userComments: userComments.length
            }
        } catch (err) {
            console.error('Error al obtener estadísticas:', err)
            return {
                assignedIssues: 0,
                watchedIssues: 0,
                userComments: 0
            }
        }
    }

    // Obtener datos de /api/profiles/me/
    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = getToken()
                if (!token) {
                    throw new Error('No se encontró token en cookies')
                }

                const res = await fetch(
                    'https://it22d-backend.onrender.com/api/profiles/me/',
                    {
                        cache: 'no-store',
                        headers: {
                            Authorization: token,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (!res.ok) throw new Error('Error al obtener perfil')
                const data = await res.json()
                setProfile(data)

                // Obtener estadísticas adicionales
                const stats = await fetchStatistics(data.id, token)
                setStatistics(stats)

                setLoading(false)
            } catch (err) {
                console.error(err)
                setError(err.message)
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) return <div>Loading perfil…</div>
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
    if (!profile) return null

    const isOwnProfile = true // Esta pantalla siempre muestra el perfil propio

    return (
        <aside className="profile__sidebar shadow">
            <div className="profile__content">
                {/* Avatar + uploader sólo si es propio */}
                <ProfileAvatarUploader
                    avatarUrl={profile.avatar || null}
                    profileId={profile.id}
                    isOwn={isOwnProfile}
                    onAvatarUpdated={(newUrl) =>
                        setProfile((prev) => ({ ...prev, avatar: newUrl }))
                    }
                />

                {/* Username */}
                <span className="profile__name">{profile.user.username}</span>

                <hr className="divider" />

                {/* Estadísticas de Total Issues, Watched Issues, Comments */}
                <div className="profile__stadistics">
                    <div className="profile__stadistics-item">
                        <span>{statistics.assignedIssues}</span>
                        <span>Assigned Issues</span>
                    </div>
                    <div className="profile__stadistics-item">
                        <span>{statistics.watchedIssues}</span>
                        <span>Watched Issues</span>
                    </div>
                    <div className="profile__stadistics-item">
                        <span>{statistics.userComments}</span>
                        <span>Comments</span>
                    </div>
                </div>

                <hr className="divider" />

                {/* Biografía */}
                <p className="profile__text">
                    {profile.biography
                        ? profile.biography
                        : isOwnProfile
                            ? 'Enter a bio for your profile'
                            : "This user hasn't set a bio yet"}
                </p>

                {/* Botón "Edit Bio" solo si es propio */}
                {isOwnProfile && (
                    <button
                        className="profile__btn-Edit"
                        onClick={() => setShowBioModal(true)}
                    >
                        Edit Bio
                    </button>
                )}

                {error && <p className="alert">{error}</p>}
            </div>

            {/* Modal de editar biografía */}
            {isOwnProfile && showBioModal && (
                <ProfileBioModal
                    currentBiography={profile.biography || ''}
                    onClose={() => setShowBioModal(false)}
                    onSaved={(updatedBio) => {
                        setProfile((prev) => ({ ...prev, biography: updatedBio }))
                        setShowBioModal(false)
                    }}
                />
            )}
        </aside>
    )
}

// Importar los componentes al final para evitar errores de referencia circular
import ProfileAvatarUploader from './ProfileAvatarUploader'
import ProfileBioModal from './ProfileBioModal'