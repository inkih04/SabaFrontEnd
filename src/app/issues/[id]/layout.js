// src/app/(dashboard)/layout.js
import Navbar from '../../../components/Navbar/Navbar'
import Sidebar from '../../../components/Sidebar/Sidebar'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export default async function IssueListLayout({ children }) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const res = await fetch('https://it22d-backend.onrender.com/api/profiles/me/', {
        cache: 'no-store',
        headers: {
            // aquí va el Bearer token
            Authorization: token,
            'Content-Type': 'application/json',
        },
    })

    // 2) Parseamos y desestructuramos solo lo que nos interesa
    const data = await res.json()
    const {
        user: { username: username },
        avatar: avatarUrl
    } = data

    // 3) Pasamos solo userId y avatarUrl
    return (
        <>
            <Navbar username={username} avatarUrl={avatarUrl} />
            <Sidebar avatarUrl={avatarUrl} />
            <main
                style={{
                    marginTop: 70,
                    marginLeft: 'clamp(220px, 20vw, 250px)',
                    padding: 20
                }}
            >
                {children}
            </main>
        </>
    )
}