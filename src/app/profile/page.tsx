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
                        className={`${styles.navItem} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        ❤️ {t.profile.myFavs}
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

                {activeTab === 'favorites' && (
                    <section className={styles.favSection}>
                        <h2>❤️ {t.profile.myFavs}</h2>
                        <div className={styles.favGrid}>
                            {(user.favorites || []).length > 0 ? (
                                user.favorites?.map(favId => {
                                    // Normally fetch from API, but for demo:
                                    const deals = [
                                        { id: 1, title: 'KFC Tələbə Menyu', company: 'KFC Azerbaijan', image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800' },
                                        { id: 2, title: 'Nike Tələbə Kartı', company: 'Nike Store', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
                                        { id: 3, title: 'IELTS Hazırlığı', company: 'CELT Colleges', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
                                        { id: 4, title: 'Sinema Bileti', company: 'CinemaPlus', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800' },
                                        { id: 5, title: 'MacBook Pro', company: 'Alma Store', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
                                        { id: 6, title: 'Pizza Festivalı', company: 'Pizza Mizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
                                        { id: 7, title: 'McDonalds Tələbə Kombo', company: 'McDonalds', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' },
                                        { id: 8, title: 'Mado Səhər Yeməyi', company: 'Mado', image: 'https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800' },
                                        { id: 9, title: 'Starbucks Coffee', company: 'Starbucks', image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800' },
                                        { id: 10, title: 'Fryday Menyu', company: 'Fryday', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800' },
                                        { id: 11, title: 'Vapiano Pasta', company: 'Vapiano', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' },
                                        { id: 12, title: 'Entree Bakery', company: 'Entree', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
                                        { id: 13, title: 'Baku Book Center', company: 'BBC', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
                                        { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', image: 'https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800' },
                                        { id: 15, title: 'Bravo Market', company: 'Bravo', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' }
                                    ];
                                    const favDeal = deals.find(d => d.id === favId);
                                    if (!favDeal) return null;

                                    return (
                                        <div key={favId} className={styles.favItem}>
                                            <div className={styles.favIcon}>
                                                {favDeal.image ? (
                                                    <img src={favDeal.image} alt={favDeal.title} className={styles.favImg} />
                                                ) : (
                                                    '🛍️'
                                                )}
                                            </div>
                                            <div className={styles.favInfo}>
                                                <h4>{favDeal.title}</h4>
                                                <p>{favDeal.company}</p>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => toggleFavorite(favId)}>✕</button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className={styles.emptyMsg}>{t.profile.noFavs}</p>
                            )}
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
                            <span className={styles.statValue}>12</span>
                            <span className={styles.statLabel}>{t.profile.usedDeals}</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
