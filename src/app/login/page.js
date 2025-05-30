'use client';

import React, { useEffect } from 'react';
import Login from '../../components/Login/Login'

export default function LoginPage() {
    useEffect(() => {
        document.cookie = 'token=; Max-Age=0; path=/;';
    });

    return (
        <Login/>

    );
}
