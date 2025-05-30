'use client';
import React, { useRef, useState } from 'react';
import styles from './IssueAttachments.module.css';

export default function IssueAttachments({ issue, setIssue }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingAttachment, setDeletingAttachment] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const getToken = () => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1].trim() : null;
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        console.log(issue);
        console.log(files);

        try {
            const token = getToken();

            // Crear FormData para enviar archivos
            const formData = new FormData();

            // Agregar cada archivo al FormData
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await fetch(`https://it22d-backend.onrender.com/api/issues/${issue.id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: token
                    // NO incluir Content-Type - el navegador lo establece automáticamente
                },
                body: formData, // Usar FormData directamente
            });

            console.log(response);

            if (!response.ok) throw new Error('Upload failed');

            const updatedIssue = await response.json();
            setIssue(updatedIssue);

        } catch (err) {
            console.error(err);
            setError('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = async (e) => {
        const files = e.target.files;
        await uploadFiles(files);
    };

    // Drag & Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        await uploadFiles(files);
    };

    const handleDeleteAttachment = async (attachmentId, index) => {
        const identifier = attachmentId || index;
        setDeletingAttachment(identifier);

        try {
            const token = getToken();

            // Usar el nuevo endpoint específico para eliminar attachments
            const response = await fetch(
                `https://it22d-backend.onrender.com/api/issues/${issue.id}/attachments/${attachmentId}/`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Delete error:', errorText);
                throw new Error(`Delete failed: ${response.status}`);
            }

            // Actualizar el estado local inmediatamente
            const updatedAttachments = issue.attachment.filter(att => att.id !== attachmentId);
            setIssue({
                ...issue,
                attachment: updatedAttachments
            });

        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Error al eliminar el archivo');
        } finally {
            setDeletingAttachment(null);
        }
    };

    return (
        <div className={styles.issueInfoAttachments}>
            <div className={styles.issueInfoAttachmentsTitle}>
                <h2>Attachments</h2>
                <label htmlFor="attachments" className={styles.issueInfoAttachmentsAdd}>
                    <span className="material-icons">add</span>
                </label>
            </div>

            {issue.attachment && issue.attachment.length > 0 ? (
                issue.attachment.map((attachment, index) => {
                    const attachmentId = attachment.id;
                    return (
                        <div key={attachmentId || index} className={styles.issueInfoAttachmentMain}>
                            <div className={styles.attachmentContent}>
                                <a
                                    href={attachment.url || attachment.file || attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {attachment.name || attachment.filename || (typeof attachment === 'string' ? attachment.split('/').pop() : '' + (attachment.file))}
                                </a>
                                <p className={styles.issueInfoAttachmentDate}>
                                    {attachment.uploaded_at || attachment.created_at || 'Unknown date'}
                                </p>
                            </div>

                            <a className={styles.DeleteAttachment}>
                                <span
                                    className="material-icons"
                                    onClick={() => handleDeleteAttachment(attachmentId, index)}
                                    title="Eliminar archivo"
                                >
                                    delete
                                </span>
                            </a>
                        </div>
                    );
                })
            ) : (
                <div
                    className={`${styles.issueInfoAttachmentsBox} ${isDragOver ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <p className={styles.issueInfoAttachmentsDrop}>
                        {uploading ? 'Uploading...' : 'Drag & drop files here or click to browse'}
                    </p>
                    {isDragOver && (
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            Drop files to upload
                        </p>
                    )}
                </div>
            )}

            <input
                type="file"
                multiple
                id="attachments"
                name="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
            />
        </div>
    );
}
