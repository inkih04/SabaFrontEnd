// app/profile/layout.js
import React from 'react'
import ProfileSidebar from '../../components/Profile/ProfileSidebar'
import Navbar from '../../components/Navbar/Navbar'
import '../../components/Profile/Profile.css'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Mi Perfil',
}

export default async function ProfileLayout({ children }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    let username = "Usuario"
    let avatarUrl = null

    try {
        const res = await fetch('https://it22d-backend.onrender.com/api/profiles/me/', {
            cache: 'no-store',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        })

        if (res.ok) {
            const data = await res.json()
            const {
                user: { username: fetchedUsername },
                avatar: fetchedAvatarUrl
            } = data

            username = fetchedUsername
            avatarUrl = fetchedAvatarUrl
        }
    } catch (error) {
        console.error('Error fetching profile data:', error)
        // Mantener valores por defecto en caso de error
    }

    return (
        <div className="profile-page">
            {/* Navbar arriba */}
            <Navbar
                username={username}
                avatarUrl={avatarUrl}
                showBackButton={true}
            />

            {/* Sidebar fijo a la izquierda */}
            <ProfileSidebar />

            {/* Contenido principal a la derecha */}
            <main className="profile-main-content">
                {children}
            </main>
        </div>
    )
}