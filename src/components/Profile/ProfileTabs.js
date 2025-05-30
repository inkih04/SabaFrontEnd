// components/ProfileTabs.js
'use client'
import React from 'react'

export default function ProfileTabs({ activeTab, onTabChange }) {
    return (
        <div className="profile__changePage">
            <button
                className={`pageChanger ${activeTab === 'assigned' ? 'active' : ''}`}
                onClick={() => onTabChange('assigned')}
            >
                Open Assigned Issues
            </button>
            <button
                className={`pageChanger ${activeTab === 'watched' ? 'active' : ''}`}
                onClick={() => onTabChange('watched')}
            >
                Watched Issues
            </button>
            <button
                className={`pageChanger ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => onTabChange('comments')}
            >
                Comments
            </button>
        </div>
    )
}
