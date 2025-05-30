/* Directory: src/app/(dashboard)/teammates/[username]/layout.js */
import React from 'react'
import TeamateSidebar from '../../../components/Teammates/TeamateSidebar'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function TeammateLayout({ children, params }) {
    const resolvedParams = await params
    const username = resolvedParams.username

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // Determine logged-in username
    let loggedUsername = null
    try {
        const meRes = await fetch('https://it22d-backend.onrender.com/api/profiles/me/', {
            cache: 'no-store',
            headers: { Authorization: token, 'Content-Type': 'application/json' }
        })
        if (meRes.ok) {
            const meData = await meRes.json()
            loggedUsername = meData.user.username
        }
    } catch (error) {
        console.error('Error fetching logged user:', error)
    }

    // Fetch user list with token
    const usersRes = await fetch('https://it22d-backend.onrender.com/api/users/', {
        cache: 'no-store',
        headers: { Authorization: token, 'Content-Type': 'application/json' }
    })
    if (!usersRes.ok) {
        return <p>Error loading user data.</p>
    }
    const users = await usersRes.json()
    const userObj = users.find(u => u.username === username)
    if (!userObj) {
        return <p>User "{username}" not found</p>
    }

    // Fetch profile (avatar, bio, counters)
    let profile = null
    try {
        const profileRes = await fetch(
            `https://it22d-backend.onrender.com/api/profiles/${userObj.profile_id}/`,
            { cache: 'no-store', headers: { Authorization: token, 'Content-Type': 'application/json' } }
        )
        if (profileRes.ok) {
            profile = await profileRes.json()
            // Ensure the profile has the user data embedded
            if (profile && !profile.user) {
                profile.user = userObj
            }
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
    }

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar for teammate */}
            <TeamateSidebar
                initialProfile={profile}
                isOwn={loggedUsername === username}
                username={username}
                profileId={userObj.profile_id}
                token={token}
            />
            <main style={{ flex: 1, padding: 40 }}>
                {children}
            </main>
        </div>
    )
}