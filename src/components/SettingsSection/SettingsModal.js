'use client';
import React, { useState, useEffect } from "react";
import styles from "./SettingsSection.module.css";

export default function SettingsModal({ open, onClose, onSave, initialData, type, error }) {
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [color, setColor] = useState(initialData?.color || "#000000");

  useEffect(() => {
    setNombre(initialData?.nombre || "");
    setColor(initialData?.color || "#000000");
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nombre, color });
  };

  return (
    <div className={styles.modal__settings__edit + " " + styles['modal-show']}>
      <div className={styles.modal__settings__content}>
        <div className={styles.modal__settings__header}>
          <h2>{initialData ? `Edit ${type}` : `Create ${type}`}</h2>
          <button className={styles.modal__settings__close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modal__settings__body}>
          {error && (
            <div className={styles.settings__error}>
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.form__group}>
              <label>Name:</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>
            <div className={styles.form__group}>
              <label>Color:</label>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                required
              />
            </div>
            <div className={styles.modal__settings__footer}>
              <button type="submit" className={`${styles.btn} ${styles['btn-success']}`}>Save</button>
              <button type="button" className={`${styles.btn} ${styles['btn-secondary']}`} onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}