'use client';
import React, { useState } from "react";
import styles from "./AddBulk.module.css";

export default function AddBulk({ onBulkCreate }) {
    const [issuesText, setIssuesText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split(";");
        const tokenCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("token=")
        );
        if (tokenCookie) {
            return tokenCookie.split("=")[1].trim();
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Construir el body esperado por el API
        const issuesArray = issuesText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "")
            .map((subject) => ({ subject }));

        if (issuesArray.length === 0) {
            setError("Please enter at least one issue.");
            setLoading(false);
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(
                "https://it22d-backend.onrender.com/api/issues/bulk-create/",
                {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ issues: issuesArray }),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error: ${response.status} - ${text}`);
            }

            const createdIssues = await response.json();

            // Llamar a la función que el padre pase para actualizar issues
            if (onBulkCreate) {
                onBulkCreate(createdIssues);
            }

            setIssuesText("");
            // Cerrar modal cambiando la URL hash
            window.location.hash = "";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.issueAddBulkButton}>
                <a
                    className={styles.openModal}
                    href="#modalBulkCreate"
                    aria-label="Open bulk add modal"
                >
                    <span className={`material-icons ${styles.icon}`}>post_add</span>
                </a>
            </div>

            <div id="modalBulkCreate" className={styles.modal}>
                <div className={styles.modalContentBulk}>
                    <div className={styles.navBarModal}>
                        <h1>Add Issues in Bulk</h1>
                        <a
                            href="#"
                            className={styles.close}
                            aria-label="Close modal"
                            onClick={() => setIssuesText("")}
                        >
                            &times;
                        </a>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.modalFormContainer}>
                            <label htmlFor="issuesText">Enter issues (one per line)</label>
                            <textarea
                                id="issuesText"
                                name="issuesText"
                                rows="10"
                                placeholder={"Issue 1\nIssue 2\nIssue 3"}
                                value={issuesText}
                                onChange={(e) => setIssuesText(e.target.value)}
                                disabled={loading}
                            ></textarea>
                            {error && (
                                <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
                            )}
                            <button
                                type="submit"
                                className={styles.createBtn}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Issues"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
