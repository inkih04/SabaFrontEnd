'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileAvatarUploader from '../Profile/ProfileAvatarUploader'
import ProfileBioModal from '../Profile/ProfileBioModal'
import '../Profile/Profile.css'

export default function TeamateSidebar({ initialProfile, isOwn, username, profileId, token }) {
    const [profile, setProfile] = useState(initialProfile)
    const [userStats, setUserStats] = useState(null)
    const [showBioModal, setShowBioModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Function to refresh profile data
    const refreshProfile = async () => {
        if (!profileId || !token) return

        try {
            setLoading(true)
            const response = await fetch(
                `https://it22d-backend.onrender.com/api/profiles/${profileId}/`,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (response.ok) {
                const updatedProfile = await response.json()
                // Ensure the profile has the user data embedded
                if (updatedProfile && !updatedProfile.user && profile?.user) {
                    updatedProfile.user = profile.user
                }
                setProfile(updatedProfile)
            }
        } catch (error) {
            console.error('Error refreshing profile:', error)
        } finally {
            setLoading(false)
        }
    }

    // Function to fetch user statistics
    const fetchUserStats = async () => {
        if (!profile?.user?.id || !token) return

        try {
            const response = await fetch(
                `https://it22d-backend.onrender.com/api/users/${profile.user.id}/`,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (response.ok) {
                const userData = await response.json()
                setUserStats(userData)
            }
        } catch (error) {
            console.error('Error fetching user stats:', error)
        }
    }

    // Fetch user stats when profile changes
    useEffect(() => {
        if (profile?.user?.id) {
            fetchUserStats()
        }
    }, [profile?.user?.id, token])

    // Handle bio update
    const handleBioUpdate = (newBio) => {
        setShowBioModal(false)
        // Update profile state immediately for instant UI update
        setProfile(prev => prev ? { ...prev, biography: newBio } : null)
        // Also refresh from server to get any other updates
        refreshProfile()
    }

    // Handle avatar update
    const handleAvatarUpdate = (newAvatarUrl) => {
        // Update profile state immediately for instant UI update
        setProfile(prev => prev ? { ...prev, avatar: newAvatarUrl } : null)
        // Also refresh from server to get any other updates
        refreshProfile()
    }

    // Handle go back to teammates
    const handleGoBack = () => {
        router.push('/teammates')
    }

    if (!profile) return <div>Loading profile...</div>

    // Get username from profile.user or fallback
    const displayUsername = profile.user?.username || profile.username || username

    // Get counters from userStats with fallbacks
    const assignedCount = userStats?.assigned_issues_count ?? 0
    const watchedCount = userStats?.watched_issues_count ?? 0
    const commentsCount = userStats?.comments_count ?? 0

    return (
        <aside className="profile__sidebar shadow" style={{ width: 300, marginRight: 20 }}>
            <div className="profile__content">
                <ProfileAvatarUploader
                    avatarUrl={profile.avatar}
                    profileId={profile.id}
                    isOwn={isOwn}
                    onAvatarUpdated={handleAvatarUpdate}
                />
                <span className="profile__name">{displayUsername}</span>
                <hr className="divider" />
                <div className="profile__stadistics">
                    <div className="profile__stadistics-item">
                        <span>{assignedCount}</span>
                        <span>Assigned Issues</span>
                    </div>
                    <div className="profile__stadistics-item">
                        <span>{watchedCount}</span>
                        <span>Watched Issues</span>
                    </div>
                    <div className="profile__stadistics-item">
                        <span>{commentsCount}</span>
                        <span>Comments</span>
                    </div>
                </div>
                <hr className="divider" />
                <div className="profile__bio-section">
                    <p className="profile__text">
                        {profile.biography || <em>No bio set.</em>}
                    </p>
                    {isOwn && (
                        <button
                            className={`profile__btn-Edit ${loading ? '' : ''}`}
                            onClick={() => setShowBioModal(true)}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Edit Bio'}
                        </button>
                    )}

                    {/* Bio Modal - only shows when showBioModal is true */}
                    {isOwn && showBioModal && (
                        <ProfileBioModal
                            currentBiography={profile.biography || ''}
                            onSaved={handleBioUpdate}
                            onClose={() => setShowBioModal(false)}
                        />
                    )}
                </div>

                {/* Go Back Button */}
                <div style={{ marginTop: '20px' }}>
                    <button
                        className="profile__btn-back"
                        onClick={handleGoBack}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            color: '#6c757d',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#e9ecef';
                            e.target.style.color = '#495057';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.color = '#6c757d';
                        }}
                    >
                        <span style={{ fontSize: '12px' }}>←</span>
                        Back to Teammates
                    </button>
                </div>
            </div>
        </aside>
    )
}