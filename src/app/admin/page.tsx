"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Users,
    Image as ImageIcon,
    MessageCircle,
    Star,
    LogOut,
    Plus,
    Trash2,
    CheckCircle,
    LayoutDashboard,
    ArrowLeft,
    Megaphone,
    Menu,
    X,
    Zap,
    Upload
} from 'lucide-react';
import styles from './admin.module.css';
import Link from 'next/link';
import { createCompanyUser, listCompanies, updateCompanyStatus, deleteCompanyUser } from './actions';
import { uploadMediaAction } from './cloudinaryActions';
import { 
    getSidebarAds, addSidebarAd, deleteSidebarAd,
    getFeaturedDeals, addFeaturedDeal, deleteFeaturedDeal,
    getMessages, deleteMessage,
    getAdRequests, updateAdRequestStatus, deleteAdRequest
} from './contentActions';

type Tab = 'dashboard' | 'restaurants' | 'ads' | 'messages' | 'featured' | 'adRequests';

export default function AdminDashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ open: false, title: '', message: '', onConfirm: () => { } });

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSidebarOpen(false); // close on mobile after selection
    };

    // Data states
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [dynamicAds, setDynamicAds] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [featuredDeals, setFeaturedDeals] = useState<any[]>([]);
    const [adRequests, setAdRequests] = useState<any[]>([]);
    const [todayVisits, setTodayVisits] = useState(0);

    // Form states
    const [newRest, setNewRest] = useState({ name: '', email: '', password: '', categoryId: 1 });
    const [newFeatured, setNewFeatured] = useState({
        title: '',
        desc: '',
        discount: '',
        image: ''
    });
    const [newAd, setNewAd] = useState({
        image: '',
        discount: '',
        companyId: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [newRestImage, setNewRestImage] = useState<File | null>(null);
    const [newRestPreview, setNewRestPreview] = useState<string | null>(null);
    const [selectedAdFile, setSelectedAdFile] = useState<File | null>(null);
    const [selectedFeaturedFile, setSelectedFeaturedFile] = useState<File | null>(null);
    const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return; // wait for session to load first
        if (!user || !user.isAdmin) {
            router.push('/login');
            return;
        }

        // Load initial data
        loadRestaurants();
        loadAds();
        loadMessages();
        loadFeatured();
        loadAdRequests();
        loadVisits();
    }, [user, isLoading]);

    const loadVisits = () => {
        const today = new Date().toISOString().split('T')[0];
        const visits = JSON.parse(localStorage.getItem('siteVisits') || '{}');
        setTodayVisits(visits[today] || 0);
    };

    const loadRestaurants = async () => {
        const list = await listCompanies();
        setRestaurants(list.map((c) => ({ 
            id: c.id, 
            name: c.full_name || c.email || '—', 
            email: c.email ?? '', 
            isActive: c.is_active !== false,
            category_id: c.category_id
        })));
    };

    const loadAds = async () => {
        const ads = await getSidebarAds();
        setDynamicAds(ads);
    };

    const loadMessages = async () => {
        const msgs = await getMessages();
        setMessages(msgs);
    };

    const loadFeatured = async () => {
        const items = await getFeaturedDeals();
        setFeaturedDeals(items);
    };

    const loadAdRequests = async () => {
        const reqs = await getAdRequests();
        setAdRequests(reqs);
    };

    const handleAdRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
        const result = await updateAdRequestStatus(id, status);
        if (result.ok) await loadAdRequests();
    };


    const handleCreateRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newRest.name.trim();
        const email = newRest.email.trim().toLowerCase();
        const password = newRest.password.trim();
        
        if (!name || !email || !password) {
            alert("Ad, e-poçt və parol tələb olunur.");
            return;
        }

        setIsUploading(true);
        let uploadedImageUrl = '';
        
        if (newRestImage) {
            const formData = new FormData();
            formData.append('file', newRestImage);
            const res = await uploadMediaAction(formData);
            if (res.success) {
                uploadedImageUrl = res.url || '';
            } else {
                alert("Şəkil yüklənə bilmədi: " + res.error);
                setIsUploading(false);
                return;
            }
        }

        const result = await createCompanyUser(name, email, password, newRest.categoryId, uploadedImageUrl);
        setIsUploading(false);
        
        if (result.ok) {
            setNewRest({ name: '', email: '', password: '', categoryId: 1 });
            setNewRestImage(null);
            setNewRestPreview(null);
            setShowModal(false);
            await loadRestaurants();
            alert("Partnyor hesabı uğurla yaradıldı!");
        } else {
            alert(result.error || "Xəta baş verdi.");
        }
    };

    const toggleRestaurantStatus = (rest: { id: string; isActive?: boolean }) => {
        const newActive = !(rest.isActive !== false);
        setConfirmDialog({
            open: true,
            title: 'Statusu Dəyiş',
            message: `Bu partnyoru ${newActive ? 'yandırmaq' : 'söndürmək'} istədiyinizə əminsiniz?`,
            onConfirm: async () => {
                const result = await updateCompanyStatus(rest.id, newActive);
                if (result.ok) await loadRestaurants();
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleDeleteRestaurant = (rest: { id: string; name: string }) => {
        setConfirmDialog({
            open: true,
            title: 'Partnyoru Sil',
            message: 'Bu partnyoru tamamilə silmək istədiyinizə əminsiniz? Bu geri qaytarıla bilməz.',
            onConfirm: async () => {
                const result = await deleteCompanyUser(rest.id);
                if (result.ok) await loadRestaurants();
                else alert(result.error);
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const { loginWithUser } = useAuth(); // Import central login function

    const handleLoginAsRestaurant = (rest: { id: string; name: string; email: string }) => {
        loginWithUser({ id: rest.id, email: rest.email, name: rest.name, role: 'Company' });
        setTimeout(() => router.push('/dashboard'), 300);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | null = null;
        if ('files' in e.target && e.target.files) {
            file = e.target.files[0];
        } else if ('dataTransfer' in e && e.dataTransfer.files) {
            file = e.dataTransfer.files[0];
        }

        if (file) {
            setSelectedAdFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAd(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newAd.image || !newAd.companyId) {
            alert("Şəkil və partnyor seçilməlidir.");
            return;
        }

        setIsUploading(true);
        let finalImageUrl = newAd.image;

        // Upload to Cloudinary if we have a file
        if (selectedAdFile) {
            const formData = new FormData();
            formData.append('file', selectedAdFile);
            const res = await uploadMediaAction(formData);
            if (res.success) {
                finalImageUrl = res.url || '';
            } else {
                alert("Reklam yüklənə bilmədi: " + res.error);
                setIsUploading(false);
                return;
            }
        }

        const result = await addSidebarAd(finalImageUrl, newAd.discount, newAd.companyId);
        
        if (result.ok) {
            await loadAds();
            setNewAd({ image: '', discount: '', companyId: '' });
            setSelectedAdFile(null);
            alert("Reklam əlavə edildi!");
        } else {
            alert("Xəta: " + result.error);
        }
        setIsUploading(false);
    };

    const handleDeleteAd = (id: string) => {
        setConfirmDialog({
            open: true,
            title: 'Reklamı Sil',
            message: 'Bu reklamı silmək istədiyinizə əminsiniz?',
            onConfirm: async () => {
                const result = await deleteSidebarAd(id);
                if (result.ok) await loadAds();
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleDeleteMessage = (id: string) => {
        setConfirmDialog({
            open: true,
            title: 'Mesajı Sil',
            message: 'Bu mesajı silmək istədiyinizə əminsiniz?',
            onConfirm: async () => {
                const result = await deleteMessage(id);
                if (result.ok) await loadMessages();
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleAddFeatured = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsUploading(true);
        let finalImageUrl = newFeatured.image;

        if (selectedFeaturedFile) {
            const formData = new FormData();
            formData.append('file', selectedFeaturedFile);
            const res = await uploadMediaAction(formData);
            if (res.success) {
                finalImageUrl = res.url || '';
            } else {
                alert("Xəta: Fayl yüklənə bilmədi: " + res.error);
                setIsUploading(false);
                return;
            }
        }

        const result = await addFeaturedDeal({
            title: newFeatured.title,
            description: newFeatured.desc,
            discount: newFeatured.discount,
            image_url: finalImageUrl
        });

        if (result.ok) {
            await loadFeatured();
            setNewFeatured({ title: '', desc: '', discount: '', image: '' });
            setSelectedFeaturedFile(null);
            setFeaturedPreview(null);
        } else {
            alert("Xəta: " + result.error);
        }
        setIsUploading(false);
    };

    const handleDeleteFeatured = (id: string) => {
        setConfirmDialog({
            open: true,
            title: 'Seçilmişi Sil',
            message: 'Bu endirimi slider-dən silmək istədiyinizə əminsiniz?',
            onConfirm: async () => {
                const result = await deleteFeaturedDeal(id);
                if (result.ok) await loadFeatured();
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleDeleteAdRequest = (id: string) => {
        setConfirmDialog({
            open: true,
            title: 'Müraciəti Sil',
            message: 'Bu reklam müraciətini silmək istədiyinizə əminsiniz?',
            onConfirm: async () => {
                const result = await deleteAdRequest(id);
                if (result.ok) await loadAdRequests();
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleLogout = () => {
        setConfirmDialog({
            open: true,
            title: 'Çıxış edin',
            message: 'Sistemdən çıxmaq istədiyinizə əminsiniz? Bütün sessiya məlumatları təmizlənəcək.',
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, open: false }));
                await logout();
            }
        });
    };

    return (
        <div className={styles.adminDashboard}>
            {/* Mobile Actions */}
            <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

            <div className={styles.dashboardLayout}>
                {/* Modal for New Partner */}
                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Yeni Partnyor Əlavə Et</h2>
                                <button onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateRestaurant} className={styles.modalForm}>
                                <div className={styles.formGroup}>
                                    <label>Ad</label>
                                    <input 
                                        type="text" 
                                        value={newRest.name} 
                                        onChange={e => setNewRest({...newRest, name: e.target.value})} 
                                        placeholder="Məs: KFC Azerbaijan"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Kateqoriya</label>
                                    <select 
                                        value={newRest.categoryId} 
                                        onChange={e => setNewRest({...newRest, categoryId: parseInt(e.target.value)})}
                                        className={styles.modalSelect}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: '1px solid #e0e5f2',
                                            background: '#f4f7fe'
                                        }}
                                    >
                                        <option value={1}>Restoran və Kafe</option>
                                        <option value={2}>Geyim və Mağazalar</option>
                                        <option value={3}>Təhsil</option>
                                        <option value={4}>Əyləncə</option>
                                        <option value={5}>Texnologiya</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={newRest.email} 
                                        onChange={e => setNewRest({...newRest, email: e.target.value})} 
                                        placeholder="company@studeal.az"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Parol</label>
                                    <input 
                                        type="password" 
                                        value={newRest.password} 
                                        onChange={e => setNewRest({...newRest, password: e.target.value})} 
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Loqo / Şəkil / Video</label>
                                    <div 
                                        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                        style={{ height: '120px' }}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                const file = e.dataTransfer.files[0];
                                                setNewRestImage(file);
                                                setNewRestPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        onClick={() => document.getElementById('restFile')?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            id="restFile" 
                                            hidden 
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    setNewRestImage(file);
                                                    setNewRestPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {newRestPreview ? (
                                            newRestImage?.type.startsWith('video') ? 
                                            <video src={newRestPreview} style={{ height: '100%', width: '100%', objectFit: 'contain' }} muted /> :
                                            <img src={newRestPreview} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <div className={styles.dropzoneText}>
                                                <Upload size={20} />
                                                <span style={{ fontSize: '12px' }}>Fayl seçin (Media)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" className={styles.modalSubmitBtn} disabled={isUploading}>
                                    {isUploading ? 'Yüklənir...' : 'Yarat'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Sidebar */}
                <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="Studeal" className={styles.logoImg} />
                        <span>Admin</span>
                    </div>

                    <nav className={styles.nav}>
                        <button
                            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('dashboard')}
                        >
                            <LayoutDashboard size={20} /> <span>Dashboard</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'restaurants' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('restaurants')}
                        >
                            <Users size={20} /> <span>Partnyorlar</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'ads' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('ads')}
                        >
                            <ImageIcon size={20} /> <span>Reklamlar</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'messages' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('messages')}
                        >
                            <MessageCircle size={20} /> <span>Mesajlar</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'featured' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('featured')}
                        >
                            <Star size={20} /> <span>Seçilmişlər</span>
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'adRequests' ? styles.activeNavItem : ''}`}
                            onClick={() => handleTabChange('adRequests')}
                        >
                            <Megaphone size={20} />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Müraciətlər
                                {(adRequests as any).filter((r: any) => r.status === 'pending').length > 0 && (
                                    <span style={{
                                        background: '#ee5d50',
                                        color: 'white',
                                        borderRadius: '10px',
                                        padding: '1px 7px',
                                        fontSize: '11px',
                                        fontWeight: 800
                                    }}>
                                        {(adRequests as any).filter((r: any) => r.status === 'pending').length}
                                    </span>
                                )}
                            </span>
                        </button>
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <LogOut size={20} /> <span>Çıxış</span>
                        </button>
                    </div>
                </aside>

                <main className={styles.mainContent}>
                    <header className={styles.dashboardHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.welcomeBadge}>Admin Panel 👋</span>
                            <h1>{
                                activeTab === 'dashboard' ? 'Dashboard' :
                                activeTab === 'restaurants' ? 'Partnyorlar' :
                                activeTab === 'ads' ? 'Reklamlar' :
                                activeTab === 'messages' ? 'Mesajlar' :
                                activeTab === 'featured' ? 'Seçilmişlər' :
                                activeTab === 'adRequests' ? 'Reklam Müraciətləri' : activeTab
                            }</h1>
                            <p>Sizin bugünkü rəqəmləriniz və fəaliyyətiniz.</p>
                        </div>
                        {activeTab === 'restaurants' && (
                            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                                <Plus size={20} /> Yeni Partnyor
                            </button>
                        )}
                    </header>

                {activeTab === 'dashboard' && (
                    <div className={styles.dashboardOverview}>
                        <div className={styles.statsGrid}>
                            <div className={`${styles.statCard} ${styles.statGreen}`}>
                                <div className={styles.statIconBox}>
                                    <Users size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Ümumi Partnyorlar</span>
                                    <span className={styles.statValue}>{restaurants.length}</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statBlue}`}>
                                <div className={styles.statIconBox}>
                                    <ImageIcon size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Aktiv Reklamlar</span>
                                    <span className={styles.statValue}>{dynamicAds.length}</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statRed}`}>
                                <div className={styles.statIconBox}>
                                    <MessageCircle size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Yeni Mesajlar</span>
                                    <span className={styles.statValue}>{messages.length}</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statYellow}`}>
                                <div className={styles.statIconBox}>
                                    <Megaphone size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Müraciətlər</span>
                                    <span className={styles.statValue}>{adRequests.length}</span>
                                </div>
                            </div>
                            <div className={`${styles.statCard} ${styles.statCyan}`}>
                                <div className={styles.statIconBox}>
                                    <Zap size={24} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statLabel}>Bu gün Ziyarət</span>
                                    <span className={styles.statValue}>{todayVisits}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.welcomeBanner}>
                            <h2>Xoş Gəlmisiniz, Admin! 👋</h2>
                            <p>Sistem üzrə bütün göstəricilər və idarəetmə paneli aşağıdadır.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'restaurants' && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Qeydiyyatdan keçmiş partnyorlar</h2>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Ad</th>
                                            <th>Kateqoriya</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {restaurants.map((rest, i) => (
                                            <tr key={i}>
                                                <td>{rest.name}</td>
                                                <td>
                                                    <span className={styles.categoryBadge}>
                                                        {rest.category_id === 1 ? 'Restoran' : 
                                                         rest.category_id === 2 ? 'Mağaza' :
                                                         rest.category_id === 3 ? 'Təhsil' :
                                                         rest.category_id === 4 ? 'Əyləncə' :
                                                         rest.category_id === 5 ? 'Texno' : 'Qeyri-müəyyən'}
                                                    </span>
                                                </td>
                                                <td>{rest.email}</td>
                                                <td>
                                                    <span style={{ 
                                                        color: rest.isActive !== false ? '#10b981' : '#ee5d50',
                                                        background: rest.isActive !== false ? '#e6f8f1' : '#fff5f5',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: 800
                                                    }}>
                                                        {rest.isActive !== false ? 'Aktiv' : 'Deaktiv'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLoginAsRestaurant(rest);
                                                            }}
                                                            style={{ 
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 800,
                                                                background: '#31c48d',
                                                                padding: '10px 18px',
                                                                borderRadius: '12px',
                                                                border: 'none',
                                                                minWidth: '130px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: '0 4px 12px rgba(49, 196, 141, 0.2)'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            Panelə Giriş
                                                        </button>
                                                        <button 
                                                            onClick={() => toggleRestaurantStatus(rest)}
                                                            style={{ 
                                                                color: rest.isActive !== false ? '#ee5d50' : '#10b981',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 800,
                                                                background: rest.isActive !== false ? '#fff5f5' : '#e6f8f1',
                                                                padding: '10px 18px',
                                                                borderRadius: '12px',
                                                                border: '1px solid currentColor',
                                                                minWidth: '100px'
                                                            }}
                                                        >
                                                            {rest.isActive !== false ? 'Söndür' : 'Yandır'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteRestaurant(rest)}
                                                            style={{ 
                                                                color: '#a3aed0', 
                                                                cursor: 'pointer',
                                                                padding: '8px',
                                                                borderRadius: '10px',
                                                                background: '#f4f7fe'
                                                            }}
                                                        >
                                                            <Trash2 size={22} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Ads Tab */}
                {activeTab === 'ads' && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Partnyor Reklamlarını İdarə Et (Sidebar)</h2>
                            <span style={{ color: '#a3aed0', fontSize: '14px' }}>{dynamicAds.length} reklam</span>
                        </div>

                        {/* Add Ad Form */}
                        <div className={styles.section} style={{ marginBottom: '30px', background: '#f8faff', border: '1px solid #e0e5f2' }}>
                            <form onSubmit={handleAddAd} className={styles.form}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ margin: 0, fontWeight: 800, color: '#1b2559' }}>🚀 Yeni Sidebar Reklamı</h3>
                                    <button type="submit" className="btn-primary" style={{ background: '#4318ff', borderRadius: '12px' }} disabled={isUploading}>
                                        <Plus size={18} /> {isUploading ? 'Yüklənir...' : 'Reklamı Əlavə Et'}
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label>Şəkli buraya sürükləyin</label>
                                        <div 
                                            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                handleFileSelect(e);
                                            }}
                                            onClick={() => document.getElementById('adFile')?.click()}
                                        >
                                            <input 
                                                type="file" 
                                                id="adFile" 
                                                hidden 
                                                accept="image/*,video/*"
                                                onChange={handleFileSelect}
                                            />
                                            {newAd.image ? (
                                                <img src={newAd.image} alt="Preview" className={styles.dropzonePreview} />
                                            ) : (
                                                <div className={styles.dropzoneText}>
                                                    <Upload size={24} />
                                                    <span>Şəkli seçin və ya bura atın</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Endirim Mətni (Badge)</label>
                                        <input
                                            type="text"
                                            value={newAd.discount}
                                            onChange={(e) => setNewAd({ ...newAd, discount: e.target.value })}
                                            placeholder="Məs: 25% ENDİRİM"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Hansı partnyora yönləndirilsin?</label>
                                    <select
                                        value={newAd.companyId}
                                        onChange={(e) => setNewAd({ ...newAd, companyId: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2' }}
                                    >
                                        <option value="">Partnyor seçin...</option>
                                        {restaurants.map(r => (
                                            <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* Ads List */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Önizləmə</th>
                                        <th>Endirim</th>
                                        <th>Yönləndirmə ID</th>
                                        <th>Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dynamicAds.map((ad) => (
                                        <tr key={ad.id}>
                                            <td>
                                                <div style={{ position: 'relative', width: '120px', height: '60px', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <img src={ad.image} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <div style={{
                                                        position: 'absolute', top: '8px', left: '8px',
                                                        background: 'white', padding: '2px 8px', borderRadius: '20px',
                                                        fontSize: '10px', fontWeight: 800, color: '#1b2559', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                    }}>
                                                        {ad.discount}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 800 }}>{ad.discount}</td>
                                            <td>{ad.companyId}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteAd(ad.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ee5d50', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {dynamicAds.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#a3aed0' }}>
                                                Hələ heç bir reklam yoxdur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>İstifadəçi Təklifləri</h2>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Ad</th>
                                        <th>Növ</th>
                                        <th>Mesaj</th>
                                        <th>Tarix</th>
                                        <th>Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg, i) => (
                                        <tr key={i}>
                                            <td>{msg.name}</td>
                                            <td>{msg.type}</td>
                                            <td style={{ maxWidth: '300px' }}>{msg.message}</td>
                                            <td>{msg.date || 'Bugün'}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className={styles.deleteBtn}
                                                    style={{ background: 'none', border: 'none', color: '#ee5d50' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center' }}>Heç bir mesaj yoxdur.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Featured Tab */}
                {activeTab === 'featured' && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Seçilmiş Endirimlər (Slider)</h2>
                            <span style={{ color: '#a3aed0', fontSize: '14px' }}>{featuredDeals.length} endirim</span>
                        </div>

                        {/* Add Form */}
                        <div className={styles.section} style={{ marginBottom: '32px', background: '#f8faff', border: '1px solid #e0e5f2' }}>
                            <form onSubmit={handleAddFeatured} className={styles.form}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1b2559' }}>✨ Yeni Seçilmiş Endirim</h3>
                                    <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '14px', display: 'flex', gap: '8px', alignItems: 'center', background: '#4318ff' }}>
                                        <Plus size={18} /> Əlavə et
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label>Başlıq</label>
                                        <input
                                            type="text"
                                            placeholder="Məs: KFC Zinger Menyu"
                                            value={newFeatured.title}
                                            onChange={(e) => setNewFeatured({ ...newFeatured, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Endirim faizi</label>
                                        <input
                                            type="text"
                                            placeholder="Məs: 20%"
                                            value={newFeatured.discount}
                                            onChange={(e) => setNewFeatured({ ...newFeatured, discount: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label>Media (Şəkil/Video)</label>
                                        <div 
                                            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                            style={{ height: '120px' }}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                    const file = e.dataTransfer.files[0];
                                                    setSelectedFeaturedFile(file);
                                                    setFeaturedPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            onClick={() => document.getElementById('featFile')?.click()}
                                        >
                                            <input 
                                                type="file" 
                                                id="featFile" 
                                                hidden 
                                                accept="image/*,video/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        setSelectedFeaturedFile(file);
                                                        setFeaturedPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                            {featuredPreview ? (
                                                selectedFeaturedFile?.type.startsWith('video') ?
                                                <video src={featuredPreview} style={{ height: '100%', width: '100%', objectFit: 'contain' }} muted /> :
                                                <img src={featuredPreview} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <div className={styles.dropzoneText}>
                                                    <Upload size={20} />
                                                    <span style={{ fontSize: '12px' }}>Fayl seçin</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Təsvir</label>
                                        <textarea
                                            placeholder="Tələbələr üçün özəl 20% endirim kampaniyası davam edir!"
                                            value={newFeatured.desc}
                                            onChange={(e) => setNewFeatured({ ...newFeatured, desc: e.target.value })}
                                            required
                                            style={{ height: '120px', padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* List */}
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Şəkil</th>
                                        <th>Başlıq</th>
                                        <th>Endirim</th>
                                        <th>Təsvir</th>
                                        <th>Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuredDeals.map((item: any) => (
                                        <tr key={item.id}>
                                            <td>
                                                {item.image && (
                                                    <img src={item.image} alt={item.title}
                                                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                                                )}
                                            </td>
                                            <td style={{ fontWeight: 800 }}>{item.title}</td>
                                            <td>
                                                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '12px' }}>-{item.discount}</span>
                                            </td>
                                            <td style={{ maxWidth: '200px', color: '#64748b', fontSize: '13px' }}>{item.desc}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteFeatured(item.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ee5d50', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {featuredDeals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>
                                                Hələ heç bir seçilmiş endirim yoxdur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Ad Requests Tab */}
                {activeTab === 'adRequests' && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Reklam Müraciətləri</h2>
                            <span style={{ color: '#a3aed0', fontSize: '14px' }}>{adRequests.length} müraciət</span>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Brend / Müəssisə</th>
                                        <th>Əlaqə</th>
                                        <th>Məzmun</th>
                                        <th>Tarix</th>
                                        <th>Status</th>
                                        <th>Əməliyyat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adRequests.map((req) => (
                                        <tr key={req.id}>
                                            <td style={{ fontWeight: 800 }}>{req.restaurantName}</td>
                                            <td>
                                                <div>{req.phoneNumber}</div>
                                                <div style={{ fontSize: '12px', color: '#a3aed0' }}>{req.email}</div>
                                            </td>
                                            <td style={{ maxWidth: '220px', color: '#64748b' }}>{req.content}</td>
                                            <td>{req.date}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    background: req.status === 'approved' ? '#d1fae5' : req.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                                    color: req.status === 'approved' ? '#059669' : req.status === 'rejected' ? '#dc2626' : '#ca8a04'
                                                }}>
                                                    {req.status === 'approved' ? '✓ Təsdiqləndi' : req.status === 'rejected' ? '✗ Rədd edildi' : '⏳ Gözləyir'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAdRequestStatus(req.id, 'approved')}
                                                                style={{ background: '#d1fae5', border: 'none', color: '#059669', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                                                            >
                                                                Təsdiqlə
                                                            </button>
                                                            <button
                                                                onClick={() => handleAdRequestStatus(req.id, 'rejected')}
                                                                style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                                                            >
                                                                Rədd et
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAdRequest(req.id)}
                                                        style={{ background: 'none', border: 'none', color: '#a3aed0', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {adRequests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#a3aed0' }}>
                                                Hələ heç bir reklam müraciəti yoxdur.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
                </main>
            </div>

            {/* Confirmation Dialog */}
            {confirmDialog.open && (
                <div className={styles.modalOverlay} onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
                    <div className={`${styles.modalContent} ${styles.confirmModal}`} style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>!</div>
                        <h2 className={styles.confirmTitle}>{confirmDialog.title}</h2>
                        <p className={styles.confirmMessage}>{confirmDialog.message}</p>
                        <div className={styles.confirmActions}>
                            <button 
                                className={styles.cancelBtn} 
                                onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                            >
                                Ləğv et
                            </button>
                            <button 
                                type="button"
                                className={styles.confirmBtn} 
                                onClick={() => {
                                    confirmDialog.onConfirm();
                                }}
                            >
                                Təsdiqlə
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
