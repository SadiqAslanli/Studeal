"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { Trash2, Edit, Plus, Image as ImageIcon, Upload, LogOut, BarChart3, Tag as TagIcon, Settings, Eye, Users, CheckCircle2, Heart, MessageSquare, Menu, X, Camera, Save } from 'lucide-react';
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

    // Settings State
    const [settingsState, setSettingsState] = useState({
        name: '',
        image: ''
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsFile, setSettingsFile] = useState<File | null>(null);

    useEffect(() => {
        if (user) {
            setSettingsState({
                name: user.fullName || user.name || '',
                image: user.image || ''
            });
        }
    }, [user]);

    useEffect(() => {
        if (isLoading) return;
        
        // Proper RBAC: Only companies can see this dashboard
        // Admins are redirected to their own panel, students to home
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.isAdmin) {
            router.push('/admin');
            return;
        }

        if (!user.isCompany) {
            router.push('/');
            return;
        }

        // Fetch complaints from Supabase
        const fetchFeedback = async () => {
            try {
                const allFeedback = await getMessages();
                // Filter feedback where message mentions company name or is type complaint
                const companyComplaints = (allFeedback || []).filter((f: any) => 
                    (f.message || "").toLowerCase().includes((user.fullName || user.name || "").toLowerCase()) ||
                    (f.type === 'complaint' && (f.message || "").toLowerCase().includes((user.fullName || user.name || "").toLowerCase()))
                );
                setComplaints(companyComplaints);
            } catch (err) {
                console.error("DEBUG: Feedback fetch error:", err);
            }
        };

        fetchFeedback();
    }, [user, isLoading, router]);

    const getFavoriteCount = (dealId: number) => {
        // Since we migrated to Supabase, we don't have all users' favorites locally.
        // For now, we'll return a random-looking number or 0 to avoid crashes.
        // In a real production app, this would be a COUNT query on a favorites table.
        return 0; 
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

    const handleSettingsFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSettingsFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettingsState(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);

        try {
            let imageUrl = settingsState.image;

            if (settingsFile) {
                const formData = new FormData();
                formData.append('file', settingsFile);
                const res = await uploadMediaAction(formData);
                if (res.success) {
                    imageUrl = res.url || '';
                } else {
                    alert("Xəta: Şəkil yüklənə bilmədi: " + res.error);
                    setIsSavingSettings(false);
                    return;
                }
            }

            updateUser({
                fullName: settingsState.name,
                image: imageUrl
            });

            alert("Tənzimləmələr uğurla yadda saxlanıldı!");
            setSettingsFile(null);
        } catch (error) {
            console.error("Settings update failed:", error);
            alert("Xəta baş verdi.");
        } finally {
            setIsSavingSettings(false);
        }
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
                                        {(user as any)?.favoriteCount || 0}
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
                        <div className={styles.sectionHeader}>
                            <h2>Tənzimləmələr</h2>
                        </div>
                        
                        <div className={styles.settingsContainer}>
                            <form className={styles.settingsForm} onSubmit={handleUpdateSettings}>
                                <div className={styles.profileImageSection}>
                                    <div className={styles.imagePreviewWrapper}>
                                        {settingsState.image ? (
                                            <img src={settingsState.image} alt="Profile" className={styles.profileImagePreview} />
                                        ) : (
                                            <div className={`${styles.profileImagePreview} ${styles.placeholderImg}`}>
                                                <ImageIcon size={48} />
                                            </div>
                                        )}
                                        <button 
                                            type="button" 
                                            className={styles.imageEditBadge}
                                            onClick={() => document.getElementById('settings-file')?.click()}
                                        >
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="settings-file" 
                                        hidden 
                                        accept="image/*" 
                                        onChange={handleSettingsFileSelect} 
                                    />
                                    <p className={styles.imageHint}>Restoranın əsas logosu və ya qapaq şəkli</p>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Restoran Adı</label>
                                    <div className={styles.inputWithIcon}>
                                        <input
                                            type="text"
                                            value={settingsState.name}
                                            onChange={(e) => setSettingsState({ ...settingsState, name: e.target.value })}
                                            placeholder="Restoranın rəsmi adı"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.settingsActions}>
                                    <button 
                                        type="submit" 
                                        className={styles.saveSettingsBtn} 
                                        disabled={isSavingSettings}
                                    >
                                        {isSavingSettings ? (
                                            <>Yadda saxlanılır...</>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                <span>Dəyişiklikləri Yadda Saxla</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
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
