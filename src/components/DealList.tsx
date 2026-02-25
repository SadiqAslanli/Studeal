"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './DealList.module.css';

interface DealListProps {
  activeCategoryId: number;
  searchQuery: string;
}

export default function DealList({ activeCategoryId, searchQuery }: DealListProps) {
  const { t } = useLanguage();
  const { user, toggleFavorite, addNotification } = useAuth();

  const allDeals = [
    {
      id: 1,
      title: 'KFC Tələbə Menyu',
      company: 'KFC Azerbaijan',
      discount: '20%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#ff4d4d',
      image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Nike Tələbə Kartı',
      company: 'Nike Store',
      discount: '15%',
      type: t.categories.shop,
      typeId: 2,
      color: '#1a1a1a',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'IELTS Hazırlığı',
      company: 'CELT Colleges',
      discount: '30%',
      type: t.categories.education,
      typeId: 3,
      color: '#0066ff',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'Sinema Bileti',
      company: 'CinemaPlus',
      discount: '50%',
      type: t.categories.entertainment,
      typeId: 4,
      color: '#9c27b0',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'MacBook Pro',
      company: 'Alma Store',
      discount: '10%',
      type: t.categories.tech,
      typeId: 5,
      color: '#607d8b',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      title: 'Pizza Festivalı',
      company: 'Pizza Mizza',
      discount: '25%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#ff9800',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 7,
      title: 'McDonalds Tələbə Kombo',
      company: 'McDonalds',
      discount: '15%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#ffbc0d',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 8,
      title: 'Mado Səhər Yeməyi',
      company: 'Mado',
      discount: '10%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#8b4513',
      image: 'https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 9,
      title: 'Starbucks Coffee',
      company: 'Starbucks',
      discount: '15%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#00704a',
      image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 10,
      title: 'Fryday Menyu',
      company: 'Fryday',
      discount: '20%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#e31837',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 11,
      title: 'Vapiano Pasta',
      company: 'Vapiano',
      discount: '10%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#df0615',
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 12,
      title: 'Entree Bakery',
      company: 'Entree',
      discount: '20%',
      type: t.categories.restaurant,
      typeId: 1,
      color: '#e6bd1a',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
    },
    { id: 13, title: 'Baku Book Center', company: 'BBC', discount: '15%', type: t.categories.shop, typeId: 2, color: '#4b3621', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
    { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', discount: '10%', type: t.categories.shop, typeId: 2, color: '#ed1c24', image: 'https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800' },
    { id: 15, title: 'Bravo Market', company: 'Bravo', discount: '5%', type: t.categories.shop, typeId: 2, color: '#f7931e', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
  ];

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

  return (
    <section className={styles.dealList}>
      <div className="container">
        <div className={styles.grid}>
          {filteredDeals.length > 0 ? (
            filteredDeals.map((deal, index) => {
              const isFavorite = user?.favorites?.includes(deal.id);
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
                        <span className={styles.dealIcon} style={{ color: deal.color }}>🔖</span>
                      </div>
                    )}
                    <div className={styles.overlay}></div>
                    <div className={styles.discountBadge}>-{deal.discount}</div>
                    <button
                      className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : ''}`}
                      onClick={(e) => handleFavorite(e, deal.id, deal.title)}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTop}>
                      <span className={styles.typeBadge}>{deal.type}</span>
                      <span className={styles.company}>{deal.company}</span>
                    </div>
                    <h3>{deal.title}</h3>
                    <div className={styles.cardFooter}>
                      <Link href={`/company/${deal.id}`} className={styles.btnView}>
                        {t.deals.view}
                        <span className={styles.arrow}>↗</span>
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
