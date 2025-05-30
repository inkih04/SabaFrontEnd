// pages/login.js
import { useState } from 'react';
import styles from './Login.module.css';
import users from '../../data/users';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {redirect} from "next/navigation";

export default function Login() {
    const [selectedUserId, setSelectedUserId] = useState('');

    const handleLogin = () => {
        const user = users.find(u => u.id === parseInt(selectedUserId));
        if (user) {
            Cookies.set('token', user.token); // Guarda el token en una cookie
            redirect('/issueList')
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.loginH1}>Sabana</h1>

            <select
                className={styles.socialBtn}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
            >
                <option value="">Select a user</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>

            <button className={styles.socialBtn} onClick={handleLogin}>
                <span className={styles.logo}> Sign in </span>
            </button>

            <div className={styles.footer}>
                Al iniciar sesión, aceptas nuestros Términos de servicio y Política de privacidad.
            </div>
        </div>
    );
}
