// components/Profile/AssignedIssuesList.js
'use client'
import React, { useEffect, useState } from 'react'
import styles from './ProfileIssuesList.module.css'

// Función auxiliar para leer la cookie 'token'
const getToken = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((c) => c.trim().startsWith('token='))
    return tokenCookie ? tokenCookie.split('=')[1].trim() : null
}

export default function AssignedIssuesList({ profileId }) {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortField, setSortField] = useState('')
    const [sortDirection, setSortDirection] = useState('')

    // Estados para los datos de la API
    const [types, setTypes] = useState([])
    const [severities, setSeverities] = useState([])
    const [priorities, setPriorities] = useState([])

    // Datos fallback en caso de que la API no devuelva colores
    const fallbackTypes = [
        { name: 'Bug', nombre: 'Bug', color: '#e74c3c' },
        { name: 'Feature', nombre: 'Feature', color: '#3498db' },
        { name: 'Task', nombre: 'Task', color: '#f39c12' },
        { name: 'Epic', nombre: 'Epic', color: '#9b59b6' }
    ]

    const fallbackSeverities = [
        { name: 'Low', nombre: 'Low', color: '#27ae60' },
        { name: 'Medium', nombre: 'Medium', color: '#f39c12' },
        { name: 'High', nombre: 'High', color: '#e67e22' },
        { name: 'Critical', nombre: 'Critical', color: '#e74c3c' }
    ]

    const fallbackPriorities = [
        { name: 'Low', nombre: 'Low', color: '#95a5a6' },
        { name: 'Medium', nombre: 'Medium', color: '#3498db' },
        { name: 'High', nombre: 'High', color: '#e67e22' },
        { name: 'Urgent', nombre: 'Urgent', color: '#e74c3c' }
    ]

    // Función para obtener datos de configuración de la API
    const fetchConfigData = async () => {
        try {
            const token = getToken()
            if (!token) return

            // Intentar obtener tipos, severidades y prioridades de la API
            const [typesRes, severitiesRes, prioritiesRes] = await Promise.allSettled([
                fetch('https://it22d-backend.onrender.com/api/types/', {
                    headers: { Authorization: token, 'Content-Type': 'application/json' }
                }),
                fetch('https://it22d-backend.onrender.com/api/severities/', {
                    headers: { Authorization: token, 'Content-Type': 'application/json' }
                }),
                fetch('https://it22d-backend.onrender.com/api/priorities/', {
                    headers: { Authorization: token, 'Content-Type': 'application/json' }
                })
            ])

            if (typesRes.status === 'fulfilled' && typesRes.value.ok) {
                const typesData = await typesRes.value.json()
                setTypes(typesData)
            } else {
                setTypes(fallbackTypes)
            }

            if (severitiesRes.status === 'fulfilled' && severitiesRes.value.ok) {
                const severitiesData = await severitiesRes.value.json()
                setSeverities(severitiesData)
            } else {
                setSeverities(fallbackSeverities)
            }

            if (prioritiesRes.status === 'fulfilled' && prioritiesRes.value.ok) {
                const prioritiesData = await prioritiesRes.value.json()
                setPriorities(prioritiesData)
            } else {
                setPriorities(fallbackPriorities)
            }
        } catch (err) {
            console.error('Error fetching config data:', err)
            // Usar datos fallback
            setTypes(fallbackTypes)
            setSeverities(fallbackSeverities)
            setPriorities(fallbackPriorities)
        }
    }

    useEffect(() => {
        async function fetchAssigned() {
            try {
                const token = getToken()
                if (!token) throw new Error('No se encontró token para cargar assigned issues')

                // Primero cargar datos de configuración
                await fetchConfigData()

                // Luego cargar issues - sin filtros de status para obtener todos
                const res = await fetch(
                    `https://it22d-backend.onrender.com/api/profiles/${profileId}/assigned-issues/`,
                    {
                        cache: 'no-store',
                        headers: {
                            Authorization: token,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (!res.ok) throw new Error('Error loading assigned issues')
                const data = await res.json()
                console.log('Datos recibidos:', data) // Para debug
                setIssues(data)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (profileId) fetchAssigned()
    }, [profileId])

    const getSortIcon = (field) => {
        if (sortField === field) {
            return sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward'
        }
        return 'unfold_more'
    }

    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
        setSortField(field)
        setSortDirection(newDirection)

        // Ordenar issues
        const sortedIssues = [...issues].sort((a, b) => {
            let aValue = a[field] || ''
            let bValue = b[field] || ''

            if (field === 'id') {
                aValue = parseInt(aValue)
                bValue = parseInt(bValue)
            }

            if (newDirection === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })
        setIssues(sortedIssues)
    }

    // Función mejorada para obtener colores
    const getColorByName = (items, name, defaultColor = '#c5c5c5') => {
        if (!items || !items.length || !name) return defaultColor

        // Buscar por diferentes campos posibles
        const item = items.find(item =>
            item.nombre === name ||
            item.name === name ||
            item.Name === name ||
            (typeof item === 'string' && item === name)
        )

        return item?.color || item?.Color || defaultColor
    }

    // Función mejorada para mapear datos del issue
    const mapIssueData = (issue) => {
        console.log('Issue original:', issue) // Para debug

        return {
            ...issue,
            // Diferentes formas de obtener el tipo
            issue_type: issue.issue_type || issue.type || issue.Type || issue.tipo || 'Task',
            // Diferentes formas de obtener severidad
            severity: issue.severity || issue.Severity || issue.severidad || 'Medium',
            // Diferentes formas de obtener prioridad
            priority: issue.priority || issue.Priority || issue.prioridad || 'Medium',
            // Diferentes formas de obtener título
            subject: issue.subject || issue.title || issue.Title || issue.titulo || issue.name || 'Sin título',
            // Descripción
            description: issue.description || issue.Description || issue.descripcion || 'Sin descripción',
            // Status
            status: issue.status || issue.Status || issue.estado || 'Open',
            // Fecha
            created_at: issue.created_at || issue.createdAt || issue.fecha_creacion || new Date().toISOString(),
            modified_at: issue.modified_at || issue.modifiedAt || issue.updated_at || issue.fecha_modificacion || issue.created_at || new Date().toISOString()
        }
    }

    if (loading) return <div className={styles.loadingMessage}>Loading Assigned Issues…</div>
    if (error) return <div className={styles.errorMessage}>Error: {error}</div>
    if (!issues.length) return <p className={styles.emptyMessage}>There are no issues assigned.</p>

    return (
        <section className={styles.issueTable}>
            {/* Header */}
            <div className={styles.issueKeyContainer}>
                {[
                    { label: 'Type', field: 'issue_type' },
                    { label: 'Severity', field: 'severity' },
                    { label: 'Priority', field: 'priority' },
                    { label: 'Issue', field: 'id' },
                    { label: 'Status', field: 'status' },
                    { label: 'Modified', field: 'modified_at' }
                ].map(({ label, field }) => (
                    <span key={field} className={styles.issueKey}>
                        <div className={styles.sortHeader}>
                            <span>{label}</span>
                            <a
                                href="#"
                                className={styles.sortIcon}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleSort(field)
                                }}
                            >
                                <span className="material-icons">
                                    {getSortIcon(field)}
                                </span>
                            </a>
                        </div>
                    </span>
                ))}
            </div>

            <ul className={styles.issuesList}>
                {issues.map((issue) => {
                    const mappedIssue = mapIssueData(issue)
                    console.log('Issue mapeado:', mappedIssue) // Para debug

                    return (
                        <li key={issue.id} className={styles.issueItem}>
                            <div className={styles.issueItemContent}>
                                <div
                                    className={styles.issueType}
                                    style={{
                                        backgroundColor: getColorByName(types, mappedIssue.issue_type),
                                    }}
                                    title={`Type: ${mappedIssue.issue_type}`}
                                />
                                <div
                                    className={styles.issueSeverity}
                                    style={{
                                        backgroundColor: getColorByName(severities, mappedIssue.severity),
                                    }}
                                    title={`Severity: ${mappedIssue.severity}`}
                                />
                                <div
                                    className={styles.issuePriority}
                                    style={{
                                        backgroundColor: getColorByName(priorities, mappedIssue.priority),
                                    }}
                                    title={`Priority: ${mappedIssue.priority}`}
                                />
                                <a className={styles.issueDetailLink} href={`/issues/${issue.id}`}>
                                    <div className={styles.issueDetail}>
                                        <p className={styles.issueId}>#{issue.id}</p>
                                        <p className={styles.issueTopic}>{mappedIssue.subject}</p>
                                        <p className={styles.issueDescription}>{mappedIssue.description}</p>
                                    </div>
                                </a>
                                <p className={styles.issueText}>
                                    {mappedIssue.status}
                                </p>
                                <p className={styles.issueText}>
                                    {new Date(mappedIssue.modified_at).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ul>

        </section>
    )
}