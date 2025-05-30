/* Directory: src/app/(dashboard)/teammates/page.js */
'use client'
import React, { useEffect, useState } from 'react'
import TeammatesHeader from '../../components/Teammates/TeammatesHeader'
import UserCard from '../../components/Teammates/UserCard'
import styles from '../../components/Teammates/Teammates.module.css'

const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const token = cookies.find(c => c.trim().startsWith('token='))
    return token ? token.split('=')[1] : null
}

export default function TeammatesPage() {
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true)
            try {
                const token = getToken()
                if (!token) throw new Error('No authentication token found')

                const res = await fetch('https://it22d-backend.onrender.com/api/users/', {
                    headers: { Authorization: token, 'Content-Type': 'application/json' }
                })
                if (!res.ok) {
                    const errorText = await res.text()
                    throw new Error(`Fetch users failed ${res.status}: ${errorText}`)
                }
                const usersData = await res.json()

                const usersWithProfile = await Promise.all(
                    usersData.map(async user => {
                        try {
                            const profRes = await fetch(
                                `https://it22d-backend.onrender.com/api/profiles/${user.profile_id}/`,
                                { headers: { Authorization: token, 'Content-Type': 'application/json' } }
                            )
                            if (!profRes.ok) throw new Error('Profile fetch failed')
                            const profile = await profRes.json()
                            return { ...user, profile }
                        } catch {
                            return { ...user, profile: { avatar: null, biography: '' } }
                        }
                    })
                )
                setUsers(usersWithProfile)
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(filter.toLowerCase())
    )

    if (loading) return <p>Loading teammates...</p>
    if (error) return <p className={styles.error}>Error: {error}</p>

    return (
        <div className={styles.container}>
            <TeammatesHeader filter={filter} onSearch={setFilter} />
            <div className={styles.list}>
                {filtered.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    )
}