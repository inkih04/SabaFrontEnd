"use client";

import React, { useState } from "react";
import styles from "./AddIssue.module.css";

export default function AddIssue({ users = [], statuses = [], priorities = [], severities = [], types = [], onIssueCreated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        status_name: statuses[0]?.nombre || "",
        priority_name: priorities[0]?.nombre || "",
        severity_name: severities[0]?.nombre || "",
        issue_type_name: types[0]?.nombre || "",
        assigned_to_username: users[0]?.username || "",
        watchers_usernames: []
    });
    const [attachments, setAttachments] = useState([]);  // Archivos adjuntos
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => {
        if (typeof document === "undefined") return null;
        const tokenCookie = document.cookie.split(";").find(c => c.trim().startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1].trim() : null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAttachmentsChange = (e) => {
        setAttachments(Array.from(e.target.files)); // Guardamos los archivos seleccionados
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = getToken();
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => data.append(key, v));
                } else {
                    data.append(key, value);
                }
            });

            attachments.forEach((file) => {
                data.append("files", file);  // <- aquí el cambio
            });

            const response = await fetch("https://it22d-backend.onrender.com/api/issues/", {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error creating issue");
            }

            const newIssue = await response.json();
            if (onIssueCreated) onIssueCreated(newIssue);

            setFormData({
                subject: "",
                description: "",
                status_name: statuses[0]?.nombre || "",
                priority_name: priorities[0]?.nombre || "",
                severity_name: severities[0]?.nombre || "",
                issue_type_name: types[0]?.nombre || "",
                assigned_to_username: users[0]?.username || "",
                watchers_usernames: []
            });
            setAttachments([]);
            setIsModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <>
            <div className={styles.issueAddButtonContainer} onClick={() => setIsModalOpen(true)}>
                <span className="material-icons">add</span>
                <p>New Issue</p>
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.navBarModal}>
                            <h1>New Issue</h1>
                            <button className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>

                        <form className={styles.modalFormContainer} onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className={styles.modalFormSubject}>
                                <label>Subject</label>
                                <input name="subject" value={formData.subject} onChange={handleInputChange} required />
                            </div>

                            <div className={styles.modalFormField}>
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                            </div>

                            <div className={styles.modalFormField}>
                                <label className={styles.modalText}>Status</label>
                                <select name="status_name" value={formData.status_name} onChange={handleInputChange}>
                                    {statuses.map((s) => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
                                </select>
                            </div>

                            <div className={styles.modalSubgroup}>
                                <div className={styles.fieldContainer}>
                                    <label className={styles.modalText}>Type</label>
                                    <select name="issue_type_name" value={formData.issue_type_name} onChange={handleInputChange}>
                                        {types.map((t) => <option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
                                    </select>
                                </div>
                                <div className={styles.fieldContainer}>
                                    <label className={styles.modalText}>Priority</label>
                                    <select name="priority_name" value={formData.priority_name} onChange={handleInputChange}>
                                        {priorities.map((p) => <option key={p.nombre} value={p.nombre}>{p.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalSubgroup2}>
                                <div className={styles.fieldContainer}>
                                    <label className={styles.modalText}>Severity</label>
                                    <select name="severity_name" value={formData.severity_name} onChange={handleInputChange}>
                                        {severities.map((s) => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
                                    </select>
                                </div>
                                <div className={styles.fieldContainer}>
                                    <label className={styles.modalText}>Assigned To</label>
                                    <select name="assigned_to_username" value={formData.assigned_to_username} onChange={handleInputChange}>
                                        {users.map((u) => <option key={u.username} value={u.username}>{u.username}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalFormField}>
                                <label className={styles.modalText}>Attachments</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleAttachmentsChange}
                                    accept="*/*"
                                />
                            </div>

                            {error && <div className={styles.errorlist}>{error}</div>}

                            <button type="submit" className={styles.createBtn} disabled={submitting}>
                                {submitting ? "Creating..." : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
