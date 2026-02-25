"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './dashboard.module.css';

export default function CompanyDashboard() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddDeal, setShowAddDeal] = useState(false);

    const stats = [
        { label: t.dashboard.activeDeals, value: "12", trend: `+2 ${t.dashboard.thisWeek}`, pos: true },
        { label: t.dashboard.totalViews, value: "1,240", trend: `+15% ${t.dashboard.increase}`, pos: true },
        { label: t.dashboard.usageCount, value: "450", trend: `-5% ${t.dashboard.decrease}`, pos: false },
    ];

    const handleUpdateDeal = (title: string) => {
        alert(`${title} ${t.dashboard.updateSuccess}`);
    };

    return (
        <div className={`container ${styles.dashboardLayout}`}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>{t.dashboard.overview}</h3>
                </div>
                <nav className={styles.navMenu}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className={styles.navIcon}>📊</span>
                        {t.dashboard.overview}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'deals' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('deals')}
                    >
                        <span className={styles.navIcon}>🏷️</span>
                        {t.dashboard.myDeals}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <span className={styles.navIcon}>📈</span>
                        {t.dashboard.analytics}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className={styles.navIcon}>⚙️</span>
                        {t.dashboard.settings}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.dashboardHeader}>
                    <div>
                        <h1>{t.dashboard.welcomeMsg}, KFC Azerbaijan</h1>
                        <p>{t.dashboard.statsSub}</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddDeal(true)}>
                        <span style={{ marginRight: '8px' }}>+</span>
                        {t.dashboard.newDeal}
                    </button>
                </header>

                <section className={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statIconBox}>
                                {i === 0 ? "🏷️" : i === 1 ? "👁️" : "📈"}
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={`${styles.trend} ${stat.pos ? styles.positive : styles.negative}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>

                <section className={styles.analyticsGrid}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>{t.dashboard.weeklyStats}</h3>
                            <span className={styles.statLabel}>{t.dashboard.last7Days}</span>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.bar} style={{ height: '60%' }} data-value="120"></div>
                            <div className={styles.bar} style={{ height: '85%' }} data-value="240"></div>
                            <div className={styles.bar} style={{ height: '40%' }} data-value="80"></div>
                            <div className={styles.bar} style={{ height: '95%' }} data-value="310"></div>
                            <div className={styles.bar} style={{ height: '70%' }} data-value="190"></div>
                            <div className={styles.bar} style={{ height: '55%' }} data-value="140"></div>
                            <div className={styles.bar} style={{ height: '80%' }} data-value="220"></div>
                        </div>
                    </div>
                    <div className={styles.statCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className={styles.statLabel}>{t.dashboard.marketShare}</span>
                        <span className={styles.statValue}>24%</span>
                        <p style={{ color: '#a3aed0', fontSize: '13px', marginTop: '10px' }}>{t.dashboard.comparedToLastMonth} +4% {t.dashboard.increase}</p>
                    </div>
                </section>
            </main>

            {/* Modal */}
            {showAddDeal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddDeal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{t.dashboard.addDealTitle}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowAddDeal(false)}>✕</button>
                        </div>
                        <form className={styles.dealForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label>{t.dashboard.dealTitleLabel}</label>
                                <input type="text" placeholder={t.dashboard.dealPlaceholder} />
                            </div>
                            <button type="submit" className={`btn-primary ${styles.btnBlock}`}>
                                {t.dashboard.share}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
