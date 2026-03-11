"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { Trash2, Edit, Plus, Image as ImageIcon, Upload, LogOut, BarChart3, Tag as TagIcon, Settings, Eye, Users, CheckCircle2, Heart, MessageSquare, Menu, X } from 'lucide-react';
import { uploadMediaAction } from '../admin/cloudinaryActions';
import { getMessages } from '../admin/contentActions';

export default function CompanyDashboard() {
    const { t } = useLanguage();
    const { user, updateUser, logout, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddDeal, setShowAddDeal] = useState(false);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
    const [editingDealId, setEditingDealId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.isAdmin) {
            router.push('/login');
            return;
        }

        // Fetch complaints from Supabase
        const fetchFeedback = async () => {
            const allFeedback = await getMessages();
            // Filter feedback where message mentions company name or is type complaint
            const companyComplaints = allFeedback.filter((f: any) => 
                f.message.toLowerCase().includes(user.name.toLowerCase()) ||
                (f.type === 'complaint' && f.message.toLowerCase().includes(user.name.toLowerCase()))
            );
            setComplaints(companyComplaints);
        };

        fetchFeedback();

        // Fetch all users to calculate favorites
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        setAllUsers(users);
    }, [user, isLoading]);

    const getFavoriteCount = (dealId: number) => {
        return allUsers.reduce((count, u) => {
            if (u.favorites?.includes(dealId)) {
                return count + 1;
            }
            return count;
        }, 0);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | null = null;
        if ('files' in e.target && e.target.files) {
            file = e.target.files[0];
        } else if ('dataTransfer' in e && (e as React.DragEvent).dataTransfer.files) {
            file = (e as React.DragEvent).dataTransfer.files[0];
        }

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewDeal(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentDeals = (user as any).deals || [];

        setIsUploading(true);
        let imageUrl = newDeal.image;

        // If it's a new file (actually a File object was selected), upload it to Cloudinary
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await uploadMediaAction(formData);
            if (res.success) {
                imageUrl = res.url || '';
            } else {
                alert("Xəta: Şəkil yüklənə bilmədi: " + res.error);
                setIsUploading(false);
                return;
            }
        }

        if (editingDealId) {
            const updatedDeals = currentDeals.map((d: any) => 
                d.id === editingDealId ? { ...newDeal, image: imageUrl, id: d.id, company: d.company, date: d.date } : d
            );
            updateUser({
                // @ts-ignore
                deals: updatedDeals
            });
        } else {
            const dealToSave = {
                ...newDeal,
                image: imageUrl,
                id: Date.now(),
                company: user?.name || 'Restaurant',
                date: new Date().toISOString()
            };
            updateUser({
                // @ts-ignore
                deals: [dealToSave, ...currentDeals]
            });
        }

        setIsUploading(false);
        resetForm();
    };

    const handleEditDeal = (deal: any) => {
        setNewDeal({
            title: deal.title,
            description: deal.description,
            ingredients: deal.ingredients,
            price: deal.price,
            discount: deal.discount,
            image: deal.image,
            studentCardRequired: deal.studentCardRequired
        });
        setEditingDealId(deal.id);
        setShowAddDeal(true);
    };

    const resetForm = () => {
        setNewDeal({
            title: '',
            description: '',
            ingredients: '',
            price: '',
            discount: '',
            image: '',
            studentCardRequired: false
        });
        setSelectedFile(null);
        setEditingDealId(null);
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
        <div className={styles.adminDashboard}>
            {/* Mobile Actions */}
            <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

            <div className={styles.dashboardLayout}>
                {/* Sidebar */}
                <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="Studeal" className={styles.logoImg} />
                        <span>Partner</span>
                    </div>

                    <nav className={styles.nav}>
                        <button
                            className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNavItem : ''}`}
                            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                        >
                            <BarChart3 size={20} /> <span>{t.dashboard.overview}</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'deals' ? styles.activeNavItem : ''}`}
                            onClick={() => { setActiveTab('deals'); setSidebarOpen(false); }}
                        >
                            <TagIcon size={20} /> <span>{t.dashboard.myDeals}</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'complaints' ? styles.activeNavItem : ''}`}
                            onClick={() => { setActiveTab('complaints'); setSidebarOpen(false); }}
                        >
                            <MessageSquare size={20} /> <span>Rəylər & Şikayətlər</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNavItem : ''}`}
                            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                        >
                            <Settings size={20} /> <span>{t.dashboard.settings}</span>
                        </button>
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <button className={styles.logoutBtn} onClick={logout}>
                            <LogOut size={20} /> <span>{t.dashboard.logout}</span>
                        </button>
                    </div>
                </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.dashboardHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.welcomeBadge}>Hoş gəldiniz 👋</div>
                        <h1>{user?.name}</h1>
                        <p>{t.dashboard.statsSub}</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.addBtn} onClick={() => { resetForm(); setShowAddDeal(true); }}>
                            <Plus size={20} />
                            <span>Yeni Menyu</span>
                        </button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className={styles.overviewSection}>
                        <section className={styles.statsGrid}>
                            <div className={`${styles.statCard} ${styles.statPurple}`}>
                                <div className={styles.statIconBox}>
                                    <TagIcon size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Aktiv Endirimlər</span>
                                    <span className={styles.statValue}>{userDeals.length}</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statBlue}`}>
                                <div className={styles.statIconBox}>
                                    <Users size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>İzləyici Sayı</span>
                                    <span className={styles.statValue}>
                                        {allUsers.filter((u: any) => 
                                            u.favorites?.some((fid: number) => 
                                                userDeals.some((d: any) => d.id === fid)
                                            )
                                        ).length}
                                    </span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statGreen}`}>
                                <div className={styles.statIconBox}>
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>İstifadə Sayı</span>
                                    <span className={styles.statValue}>{(user as any)?.usageCount || 0}</span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.quickDeals}>
                            <div className={styles.sectionHeader}>
                                <h2>Son Əlavə Olunanlar</h2>
                                <button onClick={() => setActiveTab('deals')}>Hamısına bax</button>
                            </div>
                            <div className={styles.miniDealGrid}>
                                {userDeals.slice(0, 3).map((deal: any) => (
                                    <div key={deal.id} className={styles.miniDealCard}>
                                        <img src={deal.image} alt={deal.title} />
                                        <div className={styles.miniDealInfo}>
                                            <h4>{deal.title}</h4>
                                            <span>{deal.price} AZN</span>
                                        </div>
                                    </div>
                                ))}
                                {userDeals.length === 0 && <p className={styles.emptyText}>Hələ heç bir menyu əlavə olunmayıb.</p>}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'deals' && (
                    <section className={styles.dealsList}>
                        <div className={styles.sectionHeader}>
                            <h2>Mənim Endirimlərim</h2>
                            <button className={styles.addBtnSmall} onClick={() => { resetForm(); setShowAddDeal(true); }}>
                                <Plus size={16} />
                                <span>Əlavə et</span>
                            </button>
                        </div>
                        <div className={styles.dealGrid}>
                            {userDeals.map((deal: any) => {
                                const favCount = getFavoriteCount(deal.id);
                                return (
                                    <div key={deal.id} className={styles.dealItemCard}>
                                        <div className={styles.dealItemImg}>
                                            {deal.image ? <img src={deal.image} alt={deal.title} /> : <div className={styles.placeholderImg}><ImageIcon /></div>}
                                            <div className={styles.dealItemDiscount}>-{deal.discount}%</div>
                                            <div className={styles.dealItemFavCount}>
                                                <Heart size={14} fill="currentColor" />
                                                <span>{favCount}</span>
                                            </div>
                                        </div>
                                        <div className={styles.dealItemContent}>
                                            <h3>{deal.title}</h3>
                                            <p className={styles.dealPrice}>{deal.price} AZN</p>
                                            <p className={styles.dealDesc}>{deal.description}</p>
                                            <div className={styles.dealMeta}>
                                                <span>{deal.studentCardRequired ? "🪪 Tələbə kartı lazımdır" : "✅ Sərbəst giriş"}</span>
                                            </div>
                                            <div className={styles.dealActions}>
                                                <button className={styles.editBtn} onClick={() => handleEditDeal(deal)} title="Redaktə et"><Edit size={18} /></button>
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteDeal(deal.id)} title="Sil"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {userDeals.length === 0 && (
                                <div className={styles.noDeals}>Hələ heç bir endirim əlavə edilməyib.</div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'complaints' && (
                    <section className={styles.complaintsContainer}>
                        <div className={styles.sectionHeader}>
                            <h2>Müştəri Rəyləri və Şikayətlər</h2>
                            <span className={styles.feedbackCount}>{complaints.length} Mesaj</span>
                        </div>
                        <div className={styles.complaintsList}>
                            {complaints.map((item: any) => (
                                <div key={item.id} className={styles.complaintCard}>
                                    <div className={styles.complaintHeader}>
                                        <div className={styles.complaintUser}>
                                            <div className={styles.userAvatar}>{item.name[0]}</div>
                                            <div>
                                                <h4>{item.name}</h4>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <div className={`${styles.complaintBadge} ${item.type === 'complaint' ? styles.badgeRed : styles.badgeBlue}`}>
                                            {item.type === 'complaint' ? '⚠️ Şikayət' : '💡 Təklif'}
                                        </div>
                                    </div>
                                    <p className={styles.complaintMsg}>"{item.message}"</p>
                                </div>
                            ))}
                            {complaints.length === 0 && (
                                <div className={styles.emptyComplaints}>
                                    <MessageSquare size={48} />
                                    <p>Sizin haqqınızda hələ heç bir rəy və ya şikayət yoxdur.</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'settings' && (
                    <section className={styles.settingsSection}>
                        <div className={styles.comingSoonBox}>
                            <Settings size={48} className={styles.spinningIcon} />
                            <h2>Tənzimləmələr</h2>
                            <p>Tezliklə aktiv olacaq! Burada profil və şirkət məlumatlarınızı yeniləyə biləcəksiniz.</p>
                        </div>
                    </section>
                )}
            </main>
            </div>

            {/* Modal */}
            {showAddDeal && (
                <div className={styles.modalOverlay} onClick={resetForm}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingDealId ? "Menyunu Redaktə Et" : "Yeni Endirim Menyu Əlavə Et"}</h2>
                            <button className={styles.closeBtn} onClick={resetForm}>✕</button>
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
                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label>Menyu Şəkli</label>
                                    <div 
                                        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            handleFileSelect(e);
                                        }}
                                        onClick={() => document.getElementById('dealFile')?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            id="dealFile" 
                                            hidden 
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                        {newDeal.image ? (
                                            <div className={styles.dropzonePreviewWrapper}>
                                                <img src={newDeal.image} alt="Preview" className={styles.dropzonePreview} />
                                                <div className={styles.dropzoneOverlay}>Şəkli dəyişmək üçün klikləyin</div>
                                            </div>
                                        ) : (
                                            <div className={styles.dropzoneText}>
                                                <Upload size={32} />
                                                <span>Şəkli seçin və ya bura sürüşdürün</span>
                                                <p>JPG, PNG, WEBP formatları (Max. 5MB)</p>
                                            </div>
                                        )}
                                    </div>
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

                            <button type="submit" className={`btn-primary ${styles.btnBlock}`} disabled={isUploading}>
                                {isUploading ? 'Yüklənir...' : (editingDealId ? "Yadda Saxla" : "Paylaş")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
