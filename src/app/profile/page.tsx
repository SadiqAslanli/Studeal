"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './profile.module.css';

export default function ProfilePage() {
    const { user, updateUser, toggleFavorite } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('plans');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        university: '',
        course: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Default to 'bronze' if plan not set
    const currentPlan = user?.plan || 'bronze';

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                university: user.university || '',
                course: user.course || '',
                phone: user.phone || ''
            });

            if (!user.plan) {
                updateUser({ plan: 'bronze' });
            }
        }
    }, [user, updateUser]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        setIsEditing(false);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError(t.auth.error);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === user.email);

        if (userIndex !== -1 && users[userIndex].password === passwordData.currentPassword) {
            users[userIndex].password = passwordData.newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            setPasswordSuccess(t.profile.passwordSuccess);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setPasswordError(t.auth.error);
        }
    };

    const handleUpgrade = (plan: string) => {
        updateUser({ plan });
    };

    const benefits = [
        { id: 'bronze', name: t.profile.bronze, price: '0', icon: '🥉', items: [t.profile.benefits.moreCoupons, t.profile.benefits.morePoints, t.profile.benefits.advancedFeatures] },
        { id: 'gold', name: t.profile.gold, price: '5', icon: '🥇', items: [t.profile.benefits.higherDiscounts, t.profile.benefits.priorityNotifs, t.profile.benefits.premiumSupport] }
    ];

    if (!user) return null;

    return (
        <div className={`container ${styles.profileLayout}`}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>{t.profile.panel}</h3>
                </div>
                <nav className={styles.navMenu}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 {t.profile.personalInfo}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'plans' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('plans')}
                    >
                        💎 {t.profile.plans}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        🔔 {t.profile.notifications}
                        {user.notifications?.some(n => !n.isRead) && <span className={styles.notifBadge}></span>}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'security' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        🔒 {t.profile.security}
                    </button>
                </nav>

                <div className={styles.sidebarQR}>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '20px', marginBottom: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${user.email || 'studeal'}`}
                            alt="Student QR Code"
                            width={120}
                            height={120}
                        />
                    </div>
                    <p>{t.profile.qrTitle}</p>
                    <small>{user.email}</small>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {activeTab === 'profile' && (
                    <>
                        <header className={styles.profileHeader}>
                            <h1>{t.profile.welcome}, <span>{user.name}</span>!</h1>
                            <p>{t.profile.desc}</p>
                        </header>

                        <section className={styles.infoSection}>
                            <div className={styles.sectionHeader}>
                                <h2>{t.profile.accountInfo}</h2>
                                {!isEditing && (
                                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                                        {t.profile.edit}
                                    </button>
                                )}
                            </div>

                            <form className={styles.profileForm} onSubmit={handleSave}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>{t.auth.fullName}</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t.auth.email}</label>
                                        <input type="email" value={formData.email} disabled />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t.profile.university}</label>
                                        <input
                                            type="text"
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t.profile.phone}</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className={styles.formActions}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>{t.profile.cancel}</button>
                                        <button type="submit" className="btn-primary" style={{ borderRadius: '12px' }}>{t.profile.save}</button>
                                    </div>
                                )}
                            </form>
                        </section>
                    </>
                )}

                {activeTab === 'plans' && (
                    <section className={styles.plansSection}>
                        <header className={styles.sectionHeader}>
                            <h2>💎 {t.profile.plans}</h2>
                        </header>
                        <div className={styles.planGrid}>
                            {benefits.map(plan => (
                                <div key={plan.id} className={`${styles.planCard} ${currentPlan === plan.id ? styles.activePlan : ''}`}>
                                    {currentPlan === plan.id && <span className={styles.planBadge}>{t.profile.currentPlan}</span>}
                                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>{plan.icon}</div>
                                    <h3>{plan.name}</h3>
                                    <div className={styles.planPrice}>
                                        <span className={styles.priceSymbol}>₼</span>
                                        <span className={styles.priceAmount}>{plan.price}</span>
                                        <span className={styles.pricePeriod}>/ ay</span>
                                    </div>
                                    <div className={styles.planFeatures}>
                                        {plan.items.map((item, idx) => (
                                            <div key={idx} className={styles.feature}>
                                                <span className={styles.featureIcon}>✓</span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className={`${styles.upgradeBtn} ${currentPlan === plan.id ? styles.activeUpgradeBtn : ''}`}
                                        onClick={() => plan.id !== currentPlan && handleUpgrade(plan.id)}
                                        disabled={currentPlan === plan.id}
                                    >
                                        {currentPlan === plan.id ? '✓ Aktiv' : t.profile.upgrade}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'notifications' && (
                    <section className={styles.notifSection}>
                        <h2>🔔 {t.profile.notifications}</h2>
                        <div className={styles.notifList}>
                            {(user.notifications || []).length > 0 ? (
                                user.notifications?.map((notif, index) => (
                                    <div key={`${notif.id}-${index}`} className={`${styles.notifItem} ${!notif.isRead ? styles.unread : ''}`}>
                                        <div className={styles.notifTop}>
                                            <h4>{notif.title}</h4>
                                            <span>{new Date(notif.date).toLocaleDateString()}</span>
                                        </div>
                                        <p>{notif.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyMsg}>{t.profile.noNotifs}</p>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'security' && (
                    <section className={styles.infoSection}>
                        <header className={styles.sectionHeader}>
                            <h2>🔒 {t.profile.security}</h2>
                        </header>
                        <form className={styles.profileForm} onSubmit={handlePasswordChange}>
                            <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
                                <label>{t.profile.currentPassword}</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>{t.profile.newPassword}</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t.profile.confirmPassword}</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            {passwordError && <p style={{ color: 'red', marginTop: '10px' }}>{passwordError}</p>}
                            {passwordSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{passwordSuccess}</p>}

                            <div className={styles.formActions}>
                                <button type="submit" className="btn-primary" style={{ borderRadius: '12px' }}>{t.profile.changePassword}</button>
                            </div>
                        </form>
                    </section>
                )}

                <section className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>⭐️</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{user.points || 0}</span>
                            <span className={styles.statLabel}>{t.profile.totalPoints}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🛍️</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{user.usedDealsCount || 0}</span>
                            <span className={styles.statLabel}>{t.profile.usedDeals}</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
