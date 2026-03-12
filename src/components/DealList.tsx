import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, Tag, GraduationCap, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import styles from './DealList.module.css';

import { listCompanies } from '@/app/admin/actions';

interface DealListProps {
  activeCategoryId: number;
  searchQuery: string;
  sortOption?: string;
}

/**
 * DealImage Sub-component
 * Handles loading states and fallbacks for images and videos.
 */
function DealImage({ src, title, color }: { src?: string | null, title: string, color?: string }) {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // If no source or error during loading, show placeholder
    if (!src || error || src === "null" || src === "undefined") {
        return (
            <div className={styles.placeholderImg} style={{ backgroundColor: (color || '#4318ff') + '15' }}>
                <ImageOff size={44} style={{ opacity: 0.3 }} />
                <span className={styles.placeholderText}>{title}</span>
            </div>
        );
    }

    const isVideo = src.toLowerCase().includes('/video/') || src.endsWith('.mp4');

    if (isVideo) {
        return <video src={src} className={styles.mainImg} autoPlay muted loop playsInline />;
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {!loaded && (
                <div className={styles.placeholderImg} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <ImageOff size={44} style={{ opacity: 0.3 }} />
                </div>
            )}
            <img 
                src={src} 
                alt={title} 
                className={styles.mainImg} 
                onLoad={() => setLoaded(true)}
                onError={() => {
                    console.error("Image load failed:", src);
                    setError(true);
                }}
            />
        </div>
    );
}

export default function DealList({ activeCategoryId, searchQuery, sortOption }: DealListProps) {
  const { t } = useLanguage();
  const { user, toggleFavorite, addNotification } = useAuth();
  const router = useRouter();

  const [userRatings, setUserRatings] = useState<Record<string | number, number>>({});
  const [hoverRating, setHoverRating] = useState<Record<string | number, number>>({});
  const [dynamicDeals, setDynamicDeals] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchDynamicCompanies = async () => {
    try {
      const companies = await listCompanies();
      const allMenus: any[] = [];
      
      companies.filter(c => c.is_active !== false).forEach(company => {
        let meta = company.metadata;
        if (typeof meta === 'string') {
          try { meta = JSON.parse(meta); } catch (e) { meta = {}; }
        }
        
        const deals = meta?.deals || [];
        const companySlug = meta?.slug || company.id;

        if (deals.length === 0) {
          allMenus.push({
            id: `company_${company.id}`,
            companyId: company.id,
            companySlug: companySlug,
            companyName: company.full_name || 'Sahibkar',
            title: company.full_name || 'Yeni Sahibkar',
            discount: 'Yeni',
            image: company.image_url,
            type: company.category_id === 1 ? 'Restaurant' : 
                  company.category_id === 2 ? 'Shop' :
                  company.category_id === 3 ? 'Education' :
                  company.category_id === 4 ? 'Entertainment' : 'Tech',
            typeId: company.category_id || 1,
            color: '#4318ff',
            rating: 5.0,
            ratingsCount: 0,
            isDynamic: true,
            createdAt: company.created_at || new Date().toISOString()
          });
        }

        deals.forEach((deal: any) => {
          allMenus.push({
            ...deal,
            id: deal.id,
            companyId: company.id,
            companySlug: companySlug,
            companyName: company.full_name || 'Restaurant',
            image: deal.image || company.image_url, // Use deal image if exists, else company image
            type: company.category_id === 1 ? 'Restaurant' : 
                  company.category_id === 2 ? 'Shop' :
                  company.category_id === 3 ? 'Education' :
                  company.category_id === 4 ? 'Entertainment' : 'Tech',
            typeId: company.category_id || 1,
            color: '#4318ff',
            rating: 5.0,
            ratingsCount: 1,
            isDynamic: true,
            createdAt: deal.date || company.created_at
          });
        });
      });
      // Sort: Newest first
      allMenus.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      setDynamicDeals(allMenus);
    } catch (error) {
      console.error("Failed to fetch dynamic companies:", error);
    }
  };

  useEffect(() => {
    const savedRatings = localStorage.getItem('studeal_user_ratings');
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings));
      } catch (e) {
        setUserRatings({});
      }
    }
    fetchDynamicCompanies();
  }, [activeCategoryId]); // Refetch when category changes to ensure fresh data

  useEffect(() => {
    if (currentPage > 1) {
      document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleRate = (e: React.MouseEvent, dealId: string | number, star: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    const newRatings = { ...userRatings, [dealId]: star };
    setUserRatings(newRatings);
    localStorage.setItem('studeal_user_ratings', JSON.stringify(newRatings));
  };

  const getDisplayRating = (deal: any) => {
    const baseRating = deal.rating || 0;
    const baseCount = deal.ratingsCount || 0;

    if (userRatings[deal.id]) {
      const totalScore = (baseRating * baseCount) + userRatings[deal.id];
      const totalCount = baseCount + 1;
      return (totalScore / totalCount).toFixed(1);
    }
    return baseRating > 0 ? baseRating.toFixed(1) : "0.0";
  };

  const getDisplayCount = (deal: any) => {
    const baseCount = deal.ratingsCount || 0;
    return userRatings[deal.id] ? baseCount + 1 : baseCount;
  };

  const allDeals = [...dynamicDeals];

  const handleFavorite = (e: React.MouseEvent, dealId: string | number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    const isFav = user.favorites?.includes(dealId as any);
    toggleFavorite(dealId as any);

    if (!isFav) {
      addNotification({
        title: t.fav.added,
        message: `${title} ${t.fav.addedMsg}`
      });
    }
  };

  const filteredDeals = allDeals.filter(deal => {
    const matchesCategory = activeCategoryId === 6 || deal.typeId === activeCategoryId;
    const matchesSearch = (deal.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortOption === 'popular') {
    filteredDeals.sort((a, b) => parseFloat(getDisplayRating(b)) - parseFloat(getDisplayRating(a)));
  } else if (sortOption === 'max') {
    filteredDeals.sort((a, b) => {
      const discA = parseInt(a.discount.replace('%', '')) || 0;
      const discB = parseInt(b.discount.replace('%', '')) || 0;
      return discB - discA;
    });
  }

  const totalPages = Math.ceil((filteredDeals.length + 0.1) / itemsPerPage);
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const showComingSoonCard = paginatedDeals.length < itemsPerPage && currentPage === totalPages;

  return (
    <section className={styles.dealList}>
      <div className="container" id="deals">
        <div className={styles.grid}>
          {paginatedDeals.map((deal, index) => {
            const isFavorite = user?.favorites?.includes(deal.id as any);
            const displayRating = getDisplayRating(deal);
            return (
              <div
                key={deal.id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  router.push(`/company/${deal.companySlug}`);
                }}
              >
                <div className={styles.cardImage}>
                  <DealImage src={deal.image} title={deal.title} color={deal.color} />
                  
                  <div className={styles.overlay}></div>
                  <div className={styles.ratingBubble}>
                    <Star size={12} fill="#ffae00" color="#ffae00" />
                    <span>{displayRating}</span>
                  </div>
                  <div className={styles.discountBadge}>-{deal.discount}</div>
                  {deal.studentCardRequired && <div className={styles.cardCardBadge} title="Tələbə Kartı Tələb Olunur">🪪</div>}
                  <button
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : ''}`}
                    onClick={(e) => handleFavorite(e, deal.id, deal.title)}
                  >
                    <Heart
                      size={20}
                      fill={isFavorite ? "#ff4d4d" : "rgba(0,0,0,0.1)"}
                      color={isFavorite ? "#ff4d4d" : "white"}
                      style={{ transform: isFavorite ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                    />
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <span className={styles.typeBadge}>{deal.type}</span>
                    <div className={styles.ratingBox}>
                      <Star size={13} color="#ffae00" fill="#ffae00" />
                      <span className={styles.ratingValue}>{displayRating}</span>
                      <span className={styles.ratingsCount}>({getDisplayCount(deal)})</span>
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>{deal.title}</h3>
                  <p className={styles.company}>{deal.companyName}</p>

                  <div className={styles.starRatingRow}>
                    <div className={styles.ratePrompt}>
                      <span className={styles.starRatingLabel}>
                        {userRatings[deal.id] ? t.rating.updatePrompt : t.rating.ratePrompt}
                      </span>
                      <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(star => {
                          const isUserRating = star <= (userRatings[deal.id] ?? 0);
                          const isHovering = star <= (hoverRating[deal.id] ?? 0);
                          const active = isHovering || (isUserRating && !hoverRating[deal.id]);

                          return (
                            <button
                              key={star}
                              className={styles.starBtn}
                              onMouseEnter={() => setHoverRating(prev => ({ ...prev, [deal.id]: star }))}
                              onMouseLeave={() => setHoverRating(prev => ({ ...prev, [deal.id]: 0 }))}
                              onClick={(e) => handleRate(e, deal.id, star)}
                            >
                              <Star
                                size={18}
                                color={active ? "#ffae00" : "#cbd5e1"}
                                fill={active ? "#ffae00" : "none"}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.studentNotice}>
                      <GraduationCap size={14} /> {t.dealList.studentCard}
                    </div>
                    <Link href={`/company/${deal.companySlug}`} className={styles.btnView}>
                      {t.common.showMore}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {showComingSoonCard && (
            <div className={`${styles.card} ${styles.comingSoonCard}`}>
              <div className={styles.comingSoonContent}>
                <div className={styles.comingSoonIcon}>✨</div>
                <h3>{t.dealList.comingSoon}</h3>
                <p>{t.dealList.comingSoonDesc}</p>
                <Link href="/partners/ad-request" className={styles.adLink}>{t.footerSection.partnerWithUs}</Link>
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.navPageBtn}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(prev => prev - 1);
                }
              }}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ''}`}
                onClick={() => {
                  setCurrentPage(i + 1);
                  document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={styles.navPageBtn}
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
