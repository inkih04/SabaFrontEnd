'use client';
import styles from "./SettingsSection.module.css";
import React, { useEffect, useState } from "react";
import {
  listSettings,
  createSetting,
  updateSetting,
  deleteSetting,
} from "@/lib/settingsApi";
import SettingsModal from "./SettingsModal";
import DeleteModal from "./DeleteModal";

export default function SettingsSection({ model, type, token }) {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listSettings(model, token).then(setList);
  }, [token, model]);

  const openCreate = () => {
    setModalData(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (obj) => {
    setModalData(obj);
    setError(null);
    setModalOpen(true);
  };

  const handleEdit = async (data) => {
    setError(null);
    try {
      const res = await updateSetting(model, modalData.id, data, token);
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 404) setError(`Element with id ${modelData.id} of ${model} not found.`);
        else if (res.status === 403) setError('Forbidden.');
        else if (res.status === 409) setError('Not able to modify the name of the default element');
        else if (res.status === 400) setError(Object.values(err).flat().join(" "));
        else setError("Unknown error.");
        return;
      }
      setModalOpen(false);
      setList(await listSettings(model, token));
    } catch (e) {
      if (e instanceof TypeError) setError("Conection error.");
      else setError("Unexpected error.");
    }
  };

  const handleCreate = async (data) => {
    setError(null);
    try {
      const res = await createSetting(model, data, token);
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 400) setError(Object.values(err).flat().join(" "));
        else if (res.status === 403) setError('Forbidden.');
        else setError("Unknown error.");
        return;
      }
      setModalOpen(false);
      setList(await listSettings(model, token));
    } catch (e) {
      if (e instanceof TypeError) setError("Conection error.");
      else setError("Unexpected error.");
    }
  };

  const openDelete = (obj) => {
    setDeleteData(obj);
    setError(null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setError(null);
    try {
      const res = await deleteSetting(model, deleteData.id, token);
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 404) setError(`Element with id ${modelData.id} of ${model} not found.`);
        else if (res.status === 403) setError('Forbidden');
        else if (res.status === 409) setError('Not able to delete the default element');
        else setError("Unknown error.");
        return;
      }
      setDeleteModalOpen(false);
      setList(await listSettings(model, token));
    } catch (e) {
      if (e instanceof TypeError) setError("Conection error.");
      else setError("Unexpected error.");
    }
  };

  return (
    <div className={styles.settings__container}>
      <div className={styles.settings__bar}>
        <div className={styles.settings__subtitle_container}>
          <h2 className={styles.settings__subtitle}>{type}</h2>
        </div>
        <div className={styles.settings__btn_container}>
          <button className="btn btn-primary" onClick={openCreate}>Add {type}</button>
        </div>
      </div>
      <div className={styles.settings__list}>
        <ul className={styles.settings__list_container}>
          {list.map(obj => (
            <li className={styles.settings__item_container} key={obj.id}>
              <div className={styles.settings__item}>
                <div className={styles.settings__color_name}>
                  <div className={styles.color}>
                    <div className={styles.color__item} style={{ backgroundColor: obj.color }}></div>
                  </div>
                  <span>{obj.nombre}</span>
                </div>
                <div className={styles.settings__item_edit}>
                  <button onClick={() => openEdit(obj)}>
                    <span className={`material-icons ${styles.settings__edit_icon}`}>edit</span>
                  </button>
                  <button onClick={() => openDelete(obj)}>
                    <span className={`material-icons ${styles.settings__edit_icon}`}>delete</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <SettingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={modalData ? handleEdit : handleCreate}
        initialData={modalData}
        type={type}
        error={error}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        nombre={deleteData?.nombre}
        type={type}
        error={error}
      />
    </div>
  );
}