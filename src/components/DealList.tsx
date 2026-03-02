import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, Tag, ArrowUpRight, Check } from 'lucide-react';
import styles from './DealList.module.css';

interface DealListProps {
  activeCategoryId: number;
  searchQuery: string;
  sortOption?: string;
}

export default function DealList({ activeCategoryId, searchQuery, sortOption }: DealListProps) {
  const { t } = useLanguage();
  const { user, toggleFavorite, addNotification } = useAuth();

  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [hoverRating, setHoverRating] = useState<Record<number, number>>({});
  const [ratedToast, setRatedToast] = useState<Record<number, boolean>>({});
  const [dynamicDeals, setDynamicDeals] = useState<any[]>([]);

  useEffect(() => {
    const savedRatings = localStorage.getItem('studeal_user_ratings');
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  }, []);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const extractedDeals: any[] = [];
    users.forEach((u: any) => {
      if (u.isCompany && u.deals) {
        u.deals.forEach((d: any) => {
          extractedDeals.push({
            ...d,
            type: t.categories.restaurant,
            typeId: 1,
            color: '#ff4d4d',
            rating: 4.5,
            ratingsCount: 0,
            discount: d.discount.toString().includes('%') ? d.discount : `${d.discount}%`
          });
        });
      }
    });
    setDynamicDeals(extractedDeals);
  }, [t.categories.restaurant]);

  const handleRate = (e: React.MouseEvent, dealId: number, star: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert(t.auth.loginNow || "Puan vermək üçün daxil olun");
      return;
    }

    const newRatings = { ...userRatings, [dealId]: star };
    setUserRatings(newRatings);
    localStorage.setItem('studeal_user_ratings', JSON.stringify(newRatings));

    setRatedToast(prev => ({ ...prev, [dealId]: true }));
    setTimeout(() => setRatedToast(prev => ({ ...prev, [dealId]: false })), 2000);
  };

  const getDisplayRating = (deal: any) => {
    if (userRatings[deal.id]) {
      const totalScore = (deal.rating * deal.ratingsCount) + userRatings[deal.id];
      const totalCount = deal.ratingsCount + 1;
      return (totalScore / totalCount).toFixed(1);
    }
    return deal.rating.toFixed(1);
  };

  const getDisplayCount = (deal: any) => {
    return userRatings[deal.id] ? deal.ratingsCount + 1 : deal.ratingsCount;
  };

  const staticDeals = [
    { id: 1, title: 'KFC Tələbə Menyu', company: 'KFC Azerbaijan', discount: '20%', type: t.categories.restaurant, typeId: 1, color: '#ff4d4d', rating: 4.8, ratingsCount: 124, image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 2, title: 'Nike Tələbə Kartı', company: 'Nike Store', discount: '15%', type: t.categories.shop, typeId: 2, color: '#1a1a1a', rating: 4.9, ratingsCount: 89, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 3, title: 'IELTS Hazırlığı', company: 'CELT Colleges', discount: '30%', type: t.categories.education, typeId: 3, color: '#0066ff', rating: 4.7, ratingsCount: 56, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 4, title: 'Sinema Bileti', company: 'CinemaPlus', discount: '50%', type: t.categories.entertainment, typeId: 4, color: '#9c27b0', rating: 4.5, ratingsCount: 230, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 5, title: 'MacBook Pro', company: 'Alma Store', discount: '10%', type: t.categories.tech, typeId: 5, color: '#607d8b', rating: 4.9, ratingsCount: 45, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 6, title: 'Pizza Festivalı', company: 'Pizza Mizza', discount: '25%', type: t.categories.restaurant, typeId: 1, color: '#ff9800', rating: 4.6, ratingsCount: 78, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 7, title: 'McDonalds Tələbə Kombo', company: 'McDonalds', discount: '15%', type: t.categories.restaurant, typeId: 1, color: '#ffbc0d', rating: 4.7, ratingsCount: 156, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 8, title: 'Mado Səhər Yeməyi', company: 'Mado', discount: '10%', type: t.categories.restaurant, typeId: 1, color: '#8b4513', rating: 4.4, ratingsCount: 67, image: 'https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 9, title: 'Starbucks Coffee', company: 'Starbucks', discount: '15%', type: t.categories.restaurant, typeId: 1, color: '#00704a', rating: 4.8, ratingsCount: 312, image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 10, title: 'Fryday Menyu', company: 'Fryday', discount: '20%', type: t.categories.restaurant, typeId: 1, color: '#e31837', rating: 4.5, ratingsCount: 42, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 11, title: 'Vapiano Pasta', company: 'Vapiano', discount: '10%', type: t.categories.restaurant, typeId: 1, color: '#df0615', rating: 4.7, ratingsCount: 94, image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 12, title: 'Entree Bakery', company: 'Entree', discount: '20%', type: t.categories.restaurant, typeId: 1, color: '#e6bd1a', rating: 4.6, ratingsCount: 58, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', studentCardRequired: false },
    { id: 13, title: 'Baku Book Center', company: 'BBC', discount: '15%', type: t.categories.shop, typeId: 2, color: '#4b3621', rating: 4.9, ratingsCount: 156, image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', discount: '10%', type: t.categories.shop, typeId: 2, color: '#ed1c24', rating: 4.8, ratingsCount: 89, image: 'https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
    { id: 15, title: 'Bravo Market', company: 'Bravo', discount: '5%', type: t.categories.shop, typeId: 2, color: '#f7931e', rating: 4.7, ratingsCount: 234, image: 'https://images.unsplash.com/photo-15422838132-92c53300491e?auto=format&fit=crop&q=80&w=800', studentCardRequired: true },
  ];

  const allDeals = [...staticDeals, ...dynamicDeals];

  const handleFavorite = (e: React.MouseEvent, dealId: number, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert(t.fav.loginRequired);
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
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <section className={styles.dealList}>
      <div className="container">
        <div className={styles.grid}>
          {filteredDeals.length > 0 ? (
            filteredDeals.map((deal, index) => {
              const isFavorite = user?.favorites?.includes(deal.id);
              const displayRating = getDisplayRating(deal);
              return (
                <div
                  key={deal.id}
                  className={styles.card}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={styles.cardImage}>
                    {deal.image ? (
                      <img src={deal.image} alt={deal.title} className={styles.mainImg} />
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
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTop}>
                      <span className={styles.typeBadge}>{deal.type}</span>
                      <div className={styles.ratingBox}>
                        <Star size={13} color="#ffae00" fill="#ffae00" />
                        <span className={styles.ratingValue}>
                          {getDisplayRating(deal)}
                        </span>
                        <span className={styles.ratingsCount}>
                          ({getDisplayCount(deal)})
                        </span>
                      </div>
                    </div>
                    <h3>{deal.title}</h3>
                    <div className={styles.cardInfo}>
                      <span className={styles.company}>{deal.company}</span>
                    </div>

                    <div className={styles.starRatingRow}>
                      {userRatings[deal.id] ? (
                        <div className={styles.ratedState}>
                          <div className={styles.ratedStars}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                size={15}
                                color={s <= userRatings[deal.id] ? "#ffae00" : "#e2e8f0"}
                                fill={s <= userRatings[deal.id] ? "#ffae00" : "none"}
                              />
                            ))}
                          </div>
                          <span className={styles.ratedBadge}>Puanlandı <Check size={12} style={{ display: 'inline' }} /></span>
                        </div>
                      ) : (
                        <div className={styles.ratePrompt}>
                          <span className={styles.starRatingLabel}>Puan ver</span>
                          <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map(star => {
                              const active = star <= (hoverRating[deal.id] ?? 0);
                              return (
                                <button
                                  key={star}
                                  className={styles.starBtn}
                                  onMouseEnter={() => setHoverRating(prev => ({ ...prev, [deal.id]: star }))}
                                  onMouseLeave={() => setHoverRating(prev => ({ ...prev, [deal.id]: 0 }))}
                                  onClick={(e) => handleRate(e, deal.id, star)}
                                  aria-label={`${star} ulduz`}
                                >
                                  <Star
                                    size={20}
                                    color={active ? "#ffae00" : "#cbd5e1"}
                                    fill={active ? "#ffae00" : "none"}
                                    style={{ transition: 'all 0.12s ease', display: 'block' }}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <Link href={`/company/${deal.id}`} className={styles.btnView}>
                        {t.deals.view}
                        <ArrowUpRight size={18} className={styles.arrow} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
              <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>{t.fav.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
