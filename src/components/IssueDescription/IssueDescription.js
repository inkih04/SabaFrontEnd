'use client'

import React, { useState } from "react";
import styles from "./IssueDescription.module.css";

export default function IssueDescription({ issue, setIssue }) {
    const [description, setDescription] = useState(issue.description || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => {
        if (typeof document === "undefined") return null;
        const tokenCookie = document.cookie.split(";").find(c => c.trim().startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1].trim() : null;
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const token = getToken();
        if (!token) {
            setError("No authentication token found");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch(
                `https://it22d-backend.onrender.com/api/issues/${issue.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ description: description})
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                /*throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);*/
            }

            const updated = await response.json();
            setIssue(updated);
        } catch (err) {
            console.error("Error updating description:", err);
            setError('Error saving changes');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.descriptionContainer}>
            <h2>Description</h2>
            <textarea
                id="description"
                name="description"
                placeholder="Add description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={styles.textarea}
            />
            <div className={styles.saveButtons}>
                <button
                    className={styles.infoIssueSaveButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </div>
        </div>
    );
}
