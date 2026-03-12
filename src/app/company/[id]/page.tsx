"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';
import { Star, Heart, Flag, Info, X, AlertTriangle, GraduationCap, MapPin, Clock } from 'lucide-react';
import styles from '../company.module.css';


export default function CompanyProfile() {
    const { t } = useLanguage();
    const { id } = useParams();
    const { user, addNotification, toggleFavorite, toggleCompanyFavorite } = useAuth();

    const [selectedDeal, setSelectedDeal] = useState<any>(null);
    const [reportingDeal, setReportingDeal] = useState<any>(null);
    const [reportText, setReportText] = useState("");

    // State for dynamic company data
    const [dynamicCompany, setDynamicCompany] = useState<any>(null);
    const [isDbLoading, setIsDbLoading] = useState(true);

    const [menuRatings, setMenuRatings] = useState<Record<number, { score: number, count: number }>>({});
    const [userMenuRatings, setUserMenuRatings] = useState<Record<number, number>>({});
    const [cityFilter, setCityFilter] = useState("All");

    const [companyRating, setCompanyRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [userCompanyRating, setUserCompanyRating] = useState(0);

    useEffect(() => {
        const fetchCompanyFromDb = async () => {
            try {
                const supabase = (await import('@/lib/supabase/client')).createClient();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, metadata, category_id, role')
                    .eq('id', id as string)
                    .maybeSingle();

                if (error) {
                    console.error("DEBUG: Fetch error:", error);
                    setIsDbLoading(false);
                    return;
                }

                if (data && data.role === 'Company') {
                    const metadata = data.metadata || {};
                    setDynamicCompany({
                        id: data.id,
                        name: data.full_name || data.email || 'Adsız Müəssisə',
                        tagline: metadata.tagline || (data.category_id === 1 ? 'Ləzzətli təkliflər' : 'Xüsusi endirimlər'),
                        image: metadata.image || '/hero-bg.jpg',
                        branches: metadata.branches || [{ id: 1, address: 'Baş ofis', city: 'Bakı', workHours: '09:00 - 22:00' }],
                        deals: metadata.deals || []
                    });
                }
            } catch (err) {
                console.error("DEBUG: Unexpected error:", err);
            } finally {
                setIsDbLoading(false);
            }
        };
        if (id) fetchCompanyFromDb();
        else setIsDbLoading(false);
    }, [id]);

    if (isDbLoading) return <div className={styles.loadingWrapper}><div className={styles.loader}></div><p>Yüklənir...</p></div>;
    if (!dynamicCompany) return <div className={styles.errorWrapper}><h2>Müəssisə tapılmadı</h2><p>Düzgün linkdən istifadə etdiyinizə əmin olun.</p></div>;

    const currentCompany = dynamicCompany;
    const isCompanyFavorite = user?.companyFavorites?.includes(currentCompany.id);

    const handleMenuRate = (dealId: any, rating: number) => {
        let newCount = menuRatings[dealId]?.count || 0;
        let newScore = 0;
        const currentRating = userMenuRatings[dealId] || 0;

        if (currentRating > 0) {
            newScore = ((menuRatings[dealId].score * newCount) - currentRating + rating) / newCount;
        } else {
            newCount += 1;
            newScore = (((menuRatings[dealId]?.score || 0) * (newCount - 1)) + rating) / newCount;
        }

        setMenuRatings(prev => ({ ...prev, [dealId]: { score: newScore, count: newCount } }));
        setUserMenuRatings(prev => ({ ...prev, [dealId]: rating }));

        addNotification({
            title: "Rəy yeniləndi",
            message: `Menyuya ${rating} ulduz verdiniz.`
        });
    };

    const handleCompanyRate = (rating: number) => {
        let newCount = reviewCount;
        let newRating = 0;

        if (userCompanyRating > 0) {
            newRating = ((companyRating * reviewCount) - userCompanyRating + rating) / reviewCount;
        } else {
            newCount = reviewCount + 1;
            newRating = ((companyRating * reviewCount) + rating) / newCount;
        }

        setCompanyRating(newRating);
        setReviewCount(newCount);
        setUserCompanyRating(rating);

        addNotification({
            title: "Rəyiniz yeniləndi",
            message: `Müəssisəyə ${rating} ulduz verdiniz.`
        });
    };

    const handleReport = () => {
        if (!reportText.trim()) return;
        addNotification({
            title: "Rapor göndərildi",
            message: "Şikayətiniz araşdırılacaq. Təşəkkür edirik."
        });
        setReportingDeal(null);
        setReportText("");
    };

    return (
        <div className={styles.companyPage}>
            <header className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${currentCompany.image})` }}>
                <div className="container">
                    <div className={styles.profileInfo}>
                        <div className={styles.titleInfo}>
                            <h1>{currentCompany.name}</h1>
                            <p className={styles.tagline}>{currentCompany.tagline}</p>
                        </div>
                        <button 
                            className={`${styles.companyFavBtn} ${isCompanyFavorite ? styles.isFavorite : ''}`}
                            onClick={() => toggleCompanyFavorite(currentCompany.id)}
                        >
                            <Heart 
                                size={24} 
                                fill={isCompanyFavorite ? "#ff4d4d" : "rgba(255,255,255,0.2)"} 
                                color={isCompanyFavorite ? "#ff4d4d" : "white"} 
                                style={{ transform: isCompanyFavorite ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                            />
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                    <div className={styles.mainLayout}>
                        {/* Branches Sidebar */}
                        <aside className={styles.branchesSidebar}>
                            <div className={styles.sidebarHeader}>
                                <h3>Filiallar</h3>
                                <select 
                                    className={styles.citySelect}
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                >
                                    <option value="All">Bütün filiallar</option>
                                    <option value="Bakı">Bakı</option>
                                    <option value="Gəncə">Gəncə</option>
                                    <option value="Sumqayıt">Sumqayıt</option>
                                    <option value="Naxçıvan">Naxçıvan</option>
                                </select>
                            </div>
                            
                            <div className={styles.branchesList}>
                                {currentCompany.branches?.filter((b: any) => cityFilter === "All" ? true : b.city === cityFilter).map((branch: any) => (
                                    <div key={branch.id} className={styles.branchCard}>
                                        <div className={styles.branchInfo}>
                                            <MapPin size={16} className={styles.pinIcon} />
                                            <div>
                                                <h4>{branch.address}</h4>
                                                <div className={styles.workHours}>
                                                    <Clock size={12} />
                                                    <span>{branch.workHours}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        <div className={styles.dealsContent}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t.dashboard.activeDeals}</h2>
                                <div className={styles.companyStats}>
                                    <div className={styles.ratingSection}>
                                        <div className={styles.headerStars}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star
                                                    key={s}
                                                    size={20}
                                                    onClick={() => handleCompanyRate(s)}
                                                    fill={(companyRating >= s) ? "#ffae00" : "none"}
                                                    color={(companyRating >= s) ? "#ffae00" : "#cbd5e1"}
                                                    className={styles.headerStar}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            ))}
                                        </div>
                                        <span className={styles.ratingNumber}>
                                            ⭐ {companyRating > 0 ? companyRating.toFixed(1) : "0.0"} ({reviewCount} rəy)
                                        </span>
                                    </div>
                                    <span className={styles.locationStat}>📍 {currentCompany.branches?.length || 1} məkanda</span>
                                </div>
                            </div>

                            <div className={styles.dealsGrid}>
                                {currentCompany.deals.map((deal: any) => {
                                    const isFavorite = user?.favorites?.includes(deal.id);

                                    return (
                                        <div key={deal.id} className={styles.dealCard} onClick={() => setSelectedDeal(deal)}>
                                            <div className={styles.cardHeader}>
                                                <button
                                                    className={`${styles.iconBtn} ${isFavorite ? styles.isFavorite : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(deal.id);
                                                    }}
                                                >
                                                    <Heart 
                                                        size={20} 
                                                        fill={isFavorite ? "#ff4d4d" : "rgba(0,0,0,0.1)"} 
                                                        color={isFavorite ? "#ff4d4d" : "white"} 
                                                        style={{ transform: isFavorite ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                                                    />
                                                </button>
                                                <button className={styles.iconBtn} onClick={(e) => {
                                                    e.stopPropagation();
                                                    setReportingDeal(deal);
                                                }}>
                                                    <Flag size={20} />
                                                </button>
                                            </div>

                                            <div className={styles.cardImage}>
                                                <img src={deal.image} alt={deal.title} className={styles.dealImg} />
                                                <div className={styles.discountBadge}>-{deal.discount}</div>
                                                <div className={styles.ratingBubble}>
                                                    <Star size={12} fill="#ffae00" color="#ffae00" />
                                                    <span>{(menuRatings[deal.id]?.score || 0).toFixed(1)}</span>
                                                </div>
                                                <div className={styles.infoOverlay}><Info size={32} /></div>
                                            </div>

                                            <div className={styles.cardBody}>
                                                <div className={styles.cardTop}>
                                                    <span className={styles.typeBadge}>Menyu</span>
                                                    <div className={styles.ratingBox}>
                                                        <Star size={13} color="#ffae00" fill="#ffae00" />
                                                        <span className={styles.ratingValue}>{(menuRatings[deal.id]?.score || 0).toFixed(1)}</span>
                                                        <span className={styles.ratingsCount}>({menuRatings[deal.id]?.count || 0} rəy)</span>
                                                    </div>
                                                </div>
                                                <h3>{deal.title}</h3>
                                                <p>{deal.desc}</p>

                                                <div className={styles.starRatingRow}>
                                                    <div className={styles.starRating}>
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star
                                                                key={s}
                                                                size={18}
                                                                fill={(userMenuRatings[deal.id] >= s) ? "#ffae00" : "none"}
                                                                color={(userMenuRatings[deal.id] >= s) ? "#ffae00" : "#cbd5e1"}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMenuRate(deal.id, s);
                                                                }}
                                                                className={styles.star}
                                                                style={{ cursor: userMenuRatings[deal.id] ? 'default' : 'pointer' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={styles.cardFooter}>
                                                    <div className={styles.studentNotice}>
                                                        <GraduationCap size={14} /> Tələbə kartı
                                                    </div>
                                                    <button className={styles.btnGetDeal}>
                                                        Ətraflı
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
            </main>

            {/* Modal for Menu Details */}
            {selectedDeal && (
                <div className={styles.modalOverlay} onClick={() => setSelectedDeal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedDeal(null)}><X /></button>

                        <div className={styles.modalBody}>
                            <div className={styles.detailsView}>
                                <div className={styles.detailsHeader}>
                                    <span className={styles.detailsIcon}>{selectedDeal.icon}</span>
                                    <div className={styles.detailsTitle}>
                                        <h2>{selectedDeal.title}</h2>
                                        <span className={styles.priceTag}>{selectedDeal.price || "Xüsusi Təklif"}</span>
                                    </div>
                                </div>

                                <div className={styles.contentsBox}>
                                    <h4><Info size={18} /> Menyuya daxildir:</h4>
                                    <ul>
                                        {(selectedDeal.contents || (selectedDeal.ingredients && typeof selectedDeal.ingredients === 'string' ? selectedDeal.ingredients.split(',') : [])).map((item: string, i: number) => (
                                            <li key={i}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                                                {item.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles.termsBox}>
                                    <p>
                                        <AlertTriangle size={18} style={{ flexShrink: 0 }} /> 
                                        Bu təklif yalnız tələbə kartı təqdim edildikdə kassada keçərli olur. Daha ətraflı məlumat üçün restorana müraciət edin.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnActivate} style={{ background: '#1e293b', color: 'white', width: 'auto', padding: '12px 24px' }} onClick={() => setSelectedDeal(null)}>
                                Bağla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Reporting */}
            {reportingDeal && (
                <div className={styles.modalOverlay} onClick={() => setReportingDeal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setReportingDeal(null)}><X /></button>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportIconWrapper}>
                                <AlertTriangle size={40} strokeWidth={2.5} />
                            </div>
                            <h2>Menyunu Rapor Et</h2>
                            <p><strong>{reportingDeal.title}</strong> ilə bağlı qarşılaşdığınız problemi qeyd edin. Təqdim etdiyiniz məlumatlar təshih ediləcəkdir.</p>
                        </div>
                        <div className={styles.reportForm}>
                            <textarea
                                className={styles.reportArea}
                                placeholder="Məsələn: Qiymət yanlışdır, məhsul artıq bitib və ya menyu məlumatları səhvdir..."
                                value={reportText}
                                onChange={e => setReportText(e.target.value)}
                            />
                            <button className={styles.btnReportSubmit} onClick={handleReport}>
                                Göndər
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
