import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, Tag, ArrowUpRight, Check, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DealList.module.css';

import { listCompanies, CompanyProfile } from '@/app/admin/actions';

interface DealListProps {
  activeCategoryId: number;
  searchQuery: string;
  sortOption?: string;
}

export default function DealList({ activeCategoryId, searchQuery, sortOption }: DealListProps) {
  const { t } = useLanguage();
  const { user, toggleFavorite, addNotification } = useAuth();
  const router = useRouter();

  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [hoverRating, setHoverRating] = useState<Record<number, number>>({});
  const [dynamicDeals, setDynamicDeals] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const savedRatings = localStorage.getItem('studeal_user_ratings');
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
    
    // Fetch dynamic companies from database
    const fetchDynamicCompanies = async () => {
      const companies = await listCompanies();
      const formattedDeals = companies
        .filter(c => c.is_active !== false)
        .map(c => ({
          id: c.id, // ID as string from Supabase
          title: c.full_name,
          company: c.full_name,
          discount: 'Yeni', // Default label for new companies
          type: c.category_id === 1 ? 'Restaurant' : 
                c.category_id === 2 ? 'Shop' :
                c.category_id === 3 ? 'Education' :
                c.category_id === 4 ? 'Entertainment' : 'Tech',
          typeId: c.category_id || 1,
          color: '#4318ff',
          image: (c as any).metadata?.image || null, 
          rating: 5.0,
          ratingsCount: 1,
          isDynamic: true
        }));
      setDynamicDeals(formattedDeals);
    };
    
    fetchDynamicCompanies();
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleRate = (e: React.MouseEvent, dealId: number, star: number) => {
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

  const handleFavorite = (e: React.MouseEvent, dealId: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    const isFav = user.favorites?.includes(dealId);
    toggleFavorite(dealId);

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
      (deal.company || '').toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalPages = Math.ceil((filteredDeals.length + 1) / itemsPerPage);
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const showComingSoonCard = paginatedDeals.length < itemsPerPage && currentPage === totalPages;

  return (
    <section className={styles.dealList}>
      <div className="container" id="deals">
        <div className={styles.grid}>
          {paginatedDeals.map((deal, index) => {
            const isFavorite = user?.favorites?.includes(deal.id);
            const displayRating = getDisplayRating(deal);
            return (
              <div
                key={deal.id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  if (deal.isDynamic) {
                    router.push(user ? `/company/${deal.id}` : '/login');
                  } else {
                    router.push(user ? `/company/${deal.id}` : '/login');
                  }
                }}
              >
                <div className={styles.cardImage}>
                  {deal.image ? (
                    deal.image.toLowerCase().includes('/video/') || deal.image.endsWith('.mp4') ? (
                      <video src={deal.image} className={styles.mainImg} autoPlay muted loop playsInline />
                    ) : (
                      <img src={deal.image} alt={deal.title} className={styles.mainImg} />
                    )
                  ) : (
                    <div className={styles.placeholderImg} style={{ backgroundColor: deal.color + '10' }}>
                      <Tag size={32} style={{ color: deal.color }} />
                    </div>
                  )}
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
                  <h3>{deal.title}</h3>
                  <p className={styles.company}>{deal.company}</p>

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
                                size={20}
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
                    <Link href={user ? `/company/${deal.id}` : '/login'} className={styles.btnView}>
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
