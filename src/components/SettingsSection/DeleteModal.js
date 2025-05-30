'use client';
import React from "react";
import styles from "./SettingsSection.module.css";

export default function DeleteModal({ open, onClose, onDelete, nombre, type, error }) {
  if (!open) return null;
  return (
    <div className={styles.modal__settings__edit + " " + styles['modal-show']}>
      <div className={styles.modal__settings__content}>
        <div className={styles.modal__settings__header}>
          <h2>Delete {type}</h2>
          <button className={styles.modal__settings__close} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modal__settings__body}>
          {error && (
            <div className={styles.settings__error}>
              <p>{error}</p>
            </div>
          )}
          <p>Are you sure you want to delete "{nombre}"?</p>
          <div className={styles.modal__settings__footer}>
            <button className={`${styles.btn} ${styles['btn-danger']}`} onClick={onDelete}>Delete</button>
            <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}