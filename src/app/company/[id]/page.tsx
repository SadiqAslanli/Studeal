"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';
import { Star, Heart, Flag, Info, X, AlertTriangle, GraduationCap } from 'lucide-react';
import styles from '../company.module.css';
import { allCompanies } from '@/utils/dealsData';

export default function CompanyProfile() {
    const { t } = useLanguage();
    const { id } = useParams();
    const { user, addNotification, toggleFavorite } = useAuth();

    const [selectedDeal, setSelectedDeal] = useState<any>(null);
    const [reportingDeal, setReportingDeal] = useState<any>(null);
    const [reportText, setReportText] = useState("");

    // New: Individual menu ratings
    const [menuRatings, setMenuRatings] = useState<Record<number, { score: number, count: number }>>({});
    const [userMenuRatings, setUserMenuRatings] = useState<Record<number, number>>({});

    const handleMenuRate = (dealId: number, rating: number) => {
        let newCount = menuRatings[dealId]?.count || 0;
        let newScore = 0;
        const currentRating = userMenuRatings[dealId] || 0;

        if (currentRating > 0) {
            // Updating existing rating
            newScore = ((menuRatings[dealId].score * newCount) - currentRating + rating) / newCount;
        } else {
            // First time rating
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

    // Simulating dynamic company stats
    const [companyRating, setCompanyRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [userCompanyRating, setUserCompanyRating] = useState(0);

    const handleCompanyRate = (rating: number) => {
        let newCount = reviewCount;
        let newRating = 0;

        if (userCompanyRating > 0) {
            // User is changing their existing rating
            newRating = ((companyRating * reviewCount) - userCompanyRating + rating) / reviewCount;
        } else {
            // First time rating
            newCount = reviewCount + 1;
            newRating = ((companyRating * reviewCount) + rating) / newCount;
        }

        setCompanyRating(newRating);
        setReviewCount(newCount);
        setUserCompanyRating(rating);

        addNotification({
            title: "Rəyiniz yeniləndi",
            message: `Restorana ${rating} ulduz verdiniz.`
        });
    };


    const currentCompany = allCompanies.find(c => c.id === Number(id)) || allCompanies[0];

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
                        <div className={styles.logoBox}>{currentCompany.logo}</div>
                        <div className={styles.titleInfo}>
                            <h1>{currentCompany.name}</h1>
                            <p className={styles.tagline}>{currentCompany.tagline}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                <div className="container">
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
                            <span className={styles.locationStat}>📍 5 məkanda</span>
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
                                            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                                        </button>
                                        <button className={styles.iconBtn} onClick={(e) => {
                                            e.stopPropagation();
                                            setReportingDeal(deal);
                                        }}>
                                            <Flag size={20} />
                                        </button>
                                    </div>

                                    <div className={styles.cardImage}>
                                        <span className={styles.dealIcon}>{deal.icon}</span>
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
            </main>

            {/* Modal for Menu Details */}
            {selectedDeal && (
                <div className={styles.modalOverlay} onClick={() => setSelectedDeal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedDeal(null)}><X /></button>

                        <div className={styles.detailsView}>
                            <div className={styles.detailsHeader}>
                                <span className={styles.detailsIcon}>{selectedDeal.icon}</span>
                                <div>
                                    <h2>{selectedDeal.title}</h2>
                                    <span className={styles.priceTag}>{selectedDeal.price || "Xüsusi Təklif"}</span>
                                </div>
                            </div>

                            <div className={styles.contentsBox}>
                                <h4>🍕 Menyuya daxildir:</h4>
                                <ul>
                                    {selectedDeal.contents?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.termsBox}>
                                <p>⚠️ Bu təklif yalnız tələbə kartı təqdim edildikdə kassada keçərli olur. Daha ətraflı məlumat üçün restorana müraciət edin.</p>
                            </div>

                            <button className={styles.btnActivate} style={{ background: '#f1f5f9', color: '#64748b', cursor: 'default' }} disabled>
                                Menyu Məlumatı
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
                            <AlertTriangle size={32} color="#f44336" />
                            <h2>Menyunu Rapor Et</h2>
                            <p>{reportingDeal.title} ilə bağlı problemi qeyd edin</p>
                        </div>
                        <textarea
                            className={styles.reportArea}
                            placeholder="Məsələn: Qiymət yanlışdır, məhsul bitib və s."
                            value={reportText}
                            onChange={e => setReportText(e.target.value)}
                        />
                        <button className={styles.btnReportSubmit} onClick={handleReport}>
                            Göndər
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
