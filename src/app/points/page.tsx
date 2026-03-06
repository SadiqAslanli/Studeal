"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import styles from './points.module.css';

export default function PointsPage() {
    const { user, updateUser, addNotification, addTransaction } = useAuth();
    const { t } = useLanguage();
    const [activeGifts, setActiveGifts] = useState<Record<number, number>>({}); // id -> expiry

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveGifts(prev => {
                const now = Date.now();
                const newGifts: Record<number, number> = {};
                let changed = false;
                Object.entries(prev).forEach(([id, expiry]) => {
                    if (expiry > now) {
                        newGifts[Number(id)] = expiry;
                    } else {
                        changed = true; // Expiry reached
                    }
                });
                return changed ? newGifts : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showAllHistory, setShowAllHistory] = useState(false);

    const formatTime = (expiry: number) => {
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleScan = () => {
        if (!user) return;
        const bonus = 500;
        updateUser({
            points: (user.points || 0) + bonus,
            usedDealsCount: (user.usedDealsCount || 0) + 1
        });

        addTransaction({
            title: 'QR Kod Skanı (Test)',
            points: `+${bonus}`,
            type: 'earn'
        });

        addNotification({
            title: "Xallarınız artdı! 🎉",
            message: `Test rejimi: Balansınıza ${bonus} xal əlavə olundu.`
        });
    };

    const handleRedeem = (item: any) => {
        if (!user) return;
        if (activeGifts[item.id]) return;
        if ((user.points || 0) < item.cost) {
            alert("Kifayət qədər xalınız yoxdur!");
            return;
        }

        setSelectedItem(item);
        setShowConfirm(true);
    };

    const confirmActivation = () => {
        if (!selectedItem || !user) return;

        updateUser({
            points: (user.points || 0) - selectedItem.cost,
            usedDealsCount: (user.usedDealsCount || 0) + 1
        });

        const expiry = Date.now() + 10 * 60 * 1000;
        setActiveGifts(prev => ({ ...prev, [selectedItem.id]: expiry }));

        addTransaction({
            title: selectedItem.title,
            points: `-${selectedItem.cost}`,
            type: 'spend'
        });

        addNotification({
            title: "Hədiyyə alındı! 🎁",
            message: `${selectedItem.title} uğurla alındı. 10 dəqiqə ərzində kassirə göstərin.`
        });

        setShowConfirm(false);
        setSelectedItem(null);
    };

    const rewards = [
        { id: 1, title: 'KFC 5 AZN Endirim Kuponu', cost: 500, icon: '🍗', category: 'Qida' },
        { id: 2, title: 'CinemaPlus 50% Endirim Kuponu', cost: 800, icon: '🍿', category: 'Əyləncə' },
        { id: 3, title: 'Bolt 3 AZN Gediş Kuponu', cost: 400, icon: '🚕', category: 'Nəqliyyat' },
        { id: 4, title: 'Starbucks Pulsuz İçki Kuponu', cost: 600, icon: '☕️', category: 'Qida' },
        { id: 5, title: 'Ali & Nino 10 AZN-lik Hədiyyə Kuponu', cost: 1000, icon: '📚', category: 'Mağaza' },
        { id: 6, title: 'Kontakt Home 20 AZN Endirim Kuponu', cost: 1500, icon: '🔌', category: 'Texnika' },
    ];

    if (!user) return null;

    const allTransactions = user.transactions || [];
    const displayTransactions = showAllHistory ? allTransactions : allTransactions.slice(0, 5);

    return (
        <div className={styles.pointsPage}>
            {/* Confirmation Modal */}
            {showConfirm && selectedItem && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>⚠️</div>
                        <h3>Hədiyyəni aktivləşdir?</h3>
                        <p>
                            <strong>{selectedItem.title}</strong> üçün {selectedItem.cost} xal balansınızdan çıxılacaq.
                        </p>
                        <div className={styles.modalWarning}>
                            Kupon aktivləşdirildikdən sonra <strong>10 dəqiqə</strong> keçərli olacaq. Bu müddətdə istifadə edilməsə, xallar geri qaytarılmır.
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancel} onClick={() => setShowConfirm(false)}>Ləğv et</button>
                            <button className={styles.modalConfirm} onClick={confirmActivation}>Aktivləşdir</button>
                        </div>
                    </div>
                </div>
            )}
            <header className={styles.header}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>← {t.common.backHome}</Link>
                    <div className={styles.headerContent}>
                        <h1>{t.points.title}</h1>
                        <p>{t.points.subTitle}</p>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className={styles.statsContainer}>
                    <div className={styles.mainStat}>
                        <span className={styles.statLabel}>{t.points.balance}</span>
                        <div className={styles.balanceWrapper}>
                            <span className={styles.balanceIcon}>⭐️</span>
                            <span className={styles.balanceValue}>{user.points || 0}</span>
                        </div>
                        <p className={styles.balanceSub}>1,000 xal = 10 AZN Endirim</p>
                    </div>

                    <div className={styles.qrCard}>
                        <span className={styles.statLabel}>{t.points.qrTitle}</span>
                        <div className={styles.qrWrapper} onClick={handleScan}>
                            {/* Simulated QR Code */}
                            <div className={styles.qrCode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', padding: '10px', borderRadius: '15px' }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.email || 'studeal-points'}`}
                                    alt="User QR Code"
                                    width={150}
                                    height={150}
                                />
                            </div>
                            <p className={styles.qrHint}>{t.points.qrHint}</p>
                            <button className={styles.scanSimBtn} onClick={handleScan}>{t.points.scanSim}</button>
                        </div>
                    </div>

                    <div className={styles.miniStats}>
                        <div className={styles.miniStatCard}>
                            <span className={styles.miniLabel}>Bu ay qazanılıb</span>
                            <span className={styles.miniValue}>+180</span>
                        </div>
                        <div className={styles.miniStatCard}>
                            <span className={styles.miniLabel}>Ümumi qazanc</span>
                            <span className={styles.miniValue}>1,240</span>
                        </div>
                    </div>
                </div>

                <div className={styles.marketplace}>
                    <div className={styles.sectionHeader}>
                        <h2>🎁 {t.points.marketplace}</h2>
                        <p>{t.points.subTitle}</p>
                    </div>
                    <div className={styles.rewardsGrid}>
                        {rewards.map(item => {
                            const isActive = !!activeGifts[item.id];
                            const canAfford = (user.points || 0) >= item.cost;

                            return (
                                <div key={item.id} className={`${styles.rewardCard} ${isActive ? styles.activeCard : ''}`}>
                                    <div className={styles.rewardIconBg}>{item.icon}</div>
                                    <span className={styles.rewardCategory}>{item.category}</span>
                                    <h4>{item.title}</h4>
                                    <div className={styles.rewardFooter}>
                                        <div className={styles.costBadge}>
                                            {isActive ? `⏳ ${formatTime(activeGifts[item.id])}` : `⭐️ ${item.cost} xal`}
                                        </div>
                                        <button
                                            className={`${styles.redeemBtn} ${isActive ? styles.btnActive : ''}`}
                                            onClick={() => handleRedeem(item)}
                                            disabled={!canAfford || isActive}
                                        >
                                            {isActive ? t.points.active : (canAfford ? t.points.get : t.points.notEnough)}
                                        </button>
                                    </div>
                                    {isActive && <div className={styles.activeOverlay}>{t.points.showCashier}</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <section className={styles.historySection}>
                        <h2>{t.points.history}</h2>
                        <div className={styles.transactionList}>
                            {displayTransactions.length > 0 ? (
                                <>
                                    {displayTransactions.map((item: any, index: number) => (
                                        <div key={`${item.id}-${index}`} className={styles.transactionItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemTitle}>{item.title}</span>
                                                <span className={styles.itemDate}>{item.date}</span>
                                            </div>
                                            <span className={`${styles.itemPoints} ${item.type === 'earn' ? styles.plus : styles.minus}`}>
                                                {item.points}
                                            </span>
                                        </div>
                                    ))}
                                    {allTransactions.length > 5 && (
                                        <button
                                            className={styles.showMoreBtn}
                                            onClick={() => setShowAllHistory(!showAllHistory)}
                                        >
                                            {showAllHistory ? t.common.hide : t.common.showMore}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p style={{ color: '#a3aed0', textAlign: 'center', padding: '20px' }}>Hələ heç bir əməliyyat yoxdur.</p>
                            )}
                        </div>
                    </section>

                    <aside className={styles.earnSection}>
                        <h2>{t.points.howToEarn}</h2>
                        <div className={styles.earnList}>
                            <div className={styles.earnItem}>
                                <span className={styles.earnIcon}>📱</span>
                                <div>
                                    <h4>{t.points.earnQr}</h4>
                                    <p>{t.points.earnQrDesc}</p>
                                </div>
                            </div>
                            <div className={styles.earnItem}>
                                <span className={styles.earnIcon}>👥</span>
                                <div style={{ flex: 1 }}>
                                    <h4>{t.points.invite}</h4>
                                    <p>{t.points.inviteDesc}</p>
                                    <button
                                        className={styles.shareBtn}
                                        onClick={() => {
                                            const url = window.location.origin;
                                            const text = `${t.points.shareMsg} ${url}`;
                                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                            window.open(whatsappUrl, '_blank');

                                            addNotification({
                                                title: "🔗 " + t.points.shareBtn,
                                                message: t.points.shareSuccess
                                            });
                                        }}
                                    >
                                        🚀 {t.points.shareBtn}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.earnItem}>
                                <span className={styles.earnIcon}>📝</span>
                                <div>
                                    <h4>{t.points.feedback}</h4>
                                    <p>{t.points.feedbackDesc}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
