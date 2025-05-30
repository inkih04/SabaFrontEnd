'use client'
import React, { useEffect, useState } from 'react'
import ProfileTabs from '../../components/Profile/ProfileTabs'
import AssignedIssuesList from '../../components/Profile/AssignedIssuesList'
import WatchedIssuesList from '../../components/Profile/WatchedIssuesList'
import CommentsList from '../../components/Profile/CommentsList'


// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('assigned')
    const [profileId, setProfileId] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const token = getToken()
                if (!token) throw new Error('No token found in cookies')

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
                if (!res.ok) throw new Error('Unable to get profile data')
                const data = await res.json()
                setProfileId(data.id)
                setProfileData(data)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProfileData()
    }, [])

    if (loading) return <div>Loading profile…</div>
    if (error) return <div>Error: {error}</div>
    if (!profileId || !profileData) return null

    return (
        <div>
            {/* Pestañas de navegación */}
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Contenido según pestaña */}
            <div className="tab-content">
                {activeTab === 'assigned' && (
                    <AssignedIssuesList profileId={profileId} />
                )}
                {activeTab === 'watched' && (
                    <WatchedIssuesList profileId={profileId} />
                )}
                {activeTab === 'comments' && (
                    <CommentsList profileId={profileId} />
                )}
            </div>
        </div>
    )
}