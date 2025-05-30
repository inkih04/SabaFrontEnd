/* Directory: src/app/(dashboard)/teammates/[username]/page.js */
import React from 'react'
import TeammateContent from '../../../components/Teammates/TeammateContent'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function TeammatePage({ params }) {
    // ✅ Await params before accessing its properties
    const resolvedParams = await params
    const username = resolvedParams.username

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // Fetch users to get profile_id
    const res = await fetch('https://it22d-backend.onrender.com/api/users/', {
        cache: 'no-store',
        headers: { Authorization: token, 'Content-Type': 'application/json' }
    })
    if (!res.ok) return <p>Error loading user info.</p>

    const users = await res.json()
    const user = users.find(u => u.username === username)
    if (!user) return <p>User not found.</p>

    return <TeammateContent profileId={user.profile_id} />
}