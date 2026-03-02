"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [newRest, setNewRest] = useState({ name: '', email: '', password: '' });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            router.push('/login');
        }
        loadRestaurants();
    }, [user]);

    const loadRestaurants = () => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setRestaurants(allUsers.filter((u: any) => u.isCompany));
    };

    const handleCreateRestaurant = (e: React.FormEvent) => {
        e.preventDefault();
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if email already exists
        if (allUsers.some((u: any) => u.email === newRest.email)) {
            alert("This email is already registered!");
            return;
        }

        const newUser = {
            ...newRest,
            isCompany: true,
            isAdmin: false,
            menu: []
        };

        allUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(allUsers));
        setNewRest({ name: '', email: '', password: '' });
        setShowModal(false);
        loadRestaurants();
    };

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>System Admin Dashboard</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>Add Restaurant Admin</button>
            </header>

            <div className={styles.content}>
                <section className={styles.card}>
                    <h2>Managed Restaurants</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Restaurant Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.map((rest, i) => (
                                    <tr key={i}>
                                        <td>{rest.name}</td>
                                        <td>{rest.email}</td>
                                    </tr>
                                ))}
                                {restaurants.length === 0 && (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>No restaurants found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Create Restaurant Admin</h2>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateRestaurant} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Restaurant Name</label>
                                <input
                                    type="text"
                                    value={newRest.name}
                                    onChange={(e) => setNewRest({ ...newRest, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newRest.email}
                                    onChange={(e) => setNewRest({ ...newRest, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <input
                                    type="text"
                                    value={newRest.password}
                                    onChange={(e) => setNewRest({ ...newRest, password: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Create Account</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
