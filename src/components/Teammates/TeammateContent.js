// Directory: src/components/Teammates/TeammateContent.js
'use client'
import React, { useState } from 'react'
import ProfileTabs from '../Profile/ProfileTabs'
import AssignedIssuesList from '../Profile/AssignedIssuesList'
import WatchedIssuesList from '../Profile/WatchedIssuesList'
import CommentsList from '../Profile/CommentsList'

export default function TeammateContent({ profileId }) {
    const [activeTab, setActiveTab] = useState('assigned')

    return (
        <>
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div>
                {activeTab === 'assigned' && <AssignedIssuesList profileId={profileId} />}
                {activeTab === 'watched' && <WatchedIssuesList profileId={profileId} />}
                {activeTab === 'comments' && <CommentsList profileId={profileId} />}
            </div>
        </>
    )
}