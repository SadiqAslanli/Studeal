"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';

export default function CompanyDashboard() {
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('deals');
    const [showAddDeal, setShowAddDeal] = useState(false);

    // Form State
    const [newDeal, setNewDeal] = useState({
        title: '',
        description: '',
        ingredients: '',
        price: '',
        discount: '',
        image: '',
        studentCardRequired: false
    });

    useEffect(() => {
        if (!user || user.isAdmin) {
            router.push('/login');
        }
    }, [user]);

    const handleAddDeal = (e: React.FormEvent) => {
        e.preventDefault();
        const dealToSave = {
            ...newDeal,
            id: Date.now(),
            company: user?.name || 'Restaurant',
            date: new Date().toISOString()
        };

        const currentDeals = (user as any).deals || [];
        updateUser({
            // @ts-ignore
            deals: [dealToSave, ...currentDeals]
        });

        setNewDeal({
            title: '',
            description: '',
            ingredients: '',
            price: '',
            discount: '',
            image: '',
            studentCardRequired: false
        });
        setShowAddDeal(false);
    };

    const handleDeleteDeal = (id: number) => {
        const currentDeals = (user as any).deals || [];
        const updatedDeals = currentDeals.filter((d: any) => d.id !== id);
        updateUser({
            // @ts-ignore
            deals: updatedDeals
        });
    };

    const userDeals = (user as any)?.deals || [];

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
                        <h1>{t.dashboard.welcomeMsg}, {user?.name}</h1>
                        <p>{t.dashboard.statsSub}</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddDeal(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Yeni Endirim Menyu
                    </button>
                </header>

                {activeTab === 'overview' && (
                    <section className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIconBox}>🏷️</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Aktiv Endirimlər</span>
                                <span className={styles.statValue}>{userDeals.length}</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIconBox}>👁️</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Baxış Sayı</span>
                                <span className={styles.statValue}>0</span>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'deals' && (
                    <section className={styles.dealsList}>
                        <h2>Mənim Endirimlərim</h2>
                        <div className={styles.dealGrid}>
                            {userDeals.map((deal: any) => (
                                <div key={deal.id} className={styles.dealItemCard}>
                                    <div className={styles.dealItemImg}>
                                        {deal.image ? <img src={deal.image} alt={deal.title} /> : <div className={styles.placeholderImg}><ImageIcon /></div>}
                                        <div className={styles.dealItemDiscount}>-{deal.discount}%</div>
                                    </div>
                                    <div className={styles.dealItemContent}>
                                        <h3>{deal.title}</h3>
                                        <p className={styles.dealPrice}>{deal.price} AZN</p>
                                        <p className={styles.dealDesc}>{deal.description}</p>
                                        <div className={styles.dealMeta}>
                                            <span>{deal.studentCardRequired ? "🪪 Tələbə kartı lazımdır" : "✅ Sərbəst giriş"}</span>
                                        </div>
                                        <div className={styles.dealActions}>
                                            <button className={styles.deleteBtn} onClick={() => handleDeleteDeal(deal.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {userDeals.length === 0 && (
                                <div className={styles.noDeals}>Hələ heç bir endirim əlavə edilməyib.</div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* Modal */}
            {showAddDeal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddDeal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Yeni Endirim Menyu Əlavə Et</h2>
                            <button className={styles.closeBtn} onClick={() => setShowAddDeal(false)}>✕</button>
                        </div>
                        <form className={styles.dealForm} onSubmit={handleAddDeal}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Menyu Adı</label>
                                    <input
                                        type="text"
                                        placeholder="Məs: Tələbə Kombo"
                                        value={newDeal.title}
                                        onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Qiymət (AZN)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="9.90"
                                        value={newDeal.price}
                                        onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Endirim Faizi (%)</label>
                                    <input
                                        type="number"
                                        placeholder="20"
                                        value={newDeal.discount}
                                        onChange={(e) => setNewDeal({ ...newDeal, discount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Şəkil URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={newDeal.image}
                                        onChange={(e) => setNewDeal({ ...newDeal, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Qısa İzah</label>
                                <textarea
                                    placeholder="Tələbələr üçün xüsusi təklif..."
                                    value={newDeal.description}
                                    onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>İçindəkilər (Tərkibi)</label>
                                <textarea
                                    placeholder="1 Burger, 1 Orta Kartof, 1 Orta İçki..."
                                    value={newDeal.ingredients}
                                    onChange={(e) => setNewDeal({ ...newDeal, ingredients: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="cardReq"
                                    checked={newDeal.studentCardRequired}
                                    onChange={(e) => setNewDeal({ ...newDeal, studentCardRequired: e.target.checked })}
                                />
                                <label htmlFor="cardReq">Tələbə kartı tələb olunur?</label>
                            </div>

                            <button type="submit" className={`btn-primary ${styles.btnBlock}`}>
                                Paylaş
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
