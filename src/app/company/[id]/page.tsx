"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from '../company.module.css';

export default function CompanyProfile() {
    const { t } = useLanguage();
    const { id } = useParams();
    const { user, updateUser, addNotification } = useAuth();
    const [activeDeals, setActiveDeals] = useState<Record<number, number>>({}); // dealId -> expiry timestamp

    // Master list of companies and their deals
    const allCompanies = [
        {
            id: 1,
            name: "KFC Azerbaijan",
            logo: "🍗",
            tagline: "Always Original, Always Fresh",
            image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 101, title: 'Tələbə Menyu (Zinger)', desc: 'Zinger burger, fri və içki.', discount: "20%", icon: "🍔" },
                { id: 102, title: 'Ailə Paketi', desc: '8 parça toyuq, 2 fri, 1.5L Pepsi.', discount: "15%", icon: "🍟" },
                { id: 103, title: 'Gecə Təklifi', desc: 'Saat 22:00-dan sonra 30% endirim.', discount: "30%", icon: "🌙" },
            ]
        },
        {
            id: 2,
            name: "Nike Store",
            logo: "👟",
            tagline: "Just Do It",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 201, title: 'Yalnız Tələbələrə', desc: 'Bütün idman ayaqqabılarına endirim.', discount: "15%", icon: "👟" },
                { id: 202, title: 'Yeni Sezon', desc: 'Geyim kolleksiyasında 10% keşbek.', discount: "10%", icon: "👕" },
            ]
        },
        {
            id: 3,
            name: "CELT Colleges",
            logo: "🎓",
            tagline: "Your Bridge to Success",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 301, title: 'IELTS Intensive', desc: '2 aylıq sürətli hazırlıq kursu.', discount: "30%", icon: "📝" },
                { id: 302, title: 'General English', desc: 'Səviyyə testi və ilk ay ödənişsiz.', discount: "25%", icon: "🗣️" },
            ]
        },
        {
            id: 4,
            name: "CinemaPlus",
            logo: "🎬",
            tagline: "Daha rəngarəng",
            image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 401, title: 'Tələbə Bileti', desc: 'Həftə içi hər seansa 50% endirim.', discount: "50%", icon: "🎟️" },
                { id: 402, title: 'Popcorn Combo', desc: 'Orta boy popcorn və içki.', discount: "20%", icon: "🍿" },
            ]
        },
        {
            id: 5,
            name: "Alma Store",
            logo: "💻",
            tagline: "Authorized Reseller",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 501, title: 'MacBook Pro', desc: 'Tələbə vəzifəsi ilə əlavə endirim.', discount: "10%", icon: "💻" },
                { id: 502, title: 'iPad Air', desc: 'Back to school kampaniyası.', discount: "15%", icon: "📱" },
            ]
        },
        {
            id: 6,
            name: "Pizza Mizza",
            logo: "🍕",
            tagline: "Dadlı və Sürətli",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 601, title: 'Pizza Festivalı', desc: 'İstənilən orta boy pizza.', discount: "25%", icon: "🍕" },
                { id: 602, title: 'Kombo Menyu', desc: 'Pizza, fri və Cola.', discount: "20%", icon: "🥤" },
            ]
        },
        {
            id: 7,
            name: "McDonalds",
            logo: "🍟",
            tagline: "I'm Lovin' It",
            image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 701, title: 'Tələbə Kombo', desc: 'Big Mac menyu özəl qiymətə.', discount: "15%", icon: "🍔" },
                { id: 702, title: 'Happy Meal', desc: 'Hər Bazar günü uşaqlara özəl.', discount: "10%", icon: "🎁" },
            ]
        },
        {
            id: 8,
            name: "Mado",
            logo: "🍦",
            tagline: "Gerçek Lezzetler",
            image: "https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 801, title: 'Səhər Yeməyi', desc: 'Klassik kənd səhər yeməyi.', discount: "10%", icon: "☕" },
                { id: 802, title: 'Dondurma', desc: 'İstənilən 3 top dondurma.', discount: "15%", icon: "🍦" },
            ]
        },
        {
            id: 9,
            name: "Starbucks",
            logo: "☕",
            tagline: "To inspire and nurture the human spirit",
            image: "https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 901, title: 'Tall Latte', desc: 'Hər gün saat 12:00-dək.', discount: "15%", icon: "☕" },
                { id: 902, title: 'Soyuq İçkilər', desc: 'Frappuccino növlərinə.', discount: "10%", icon: "🧊" },
            ]
        },
        {
            id: 10,
            name: "Fryday",
            logo: "🍟",
            tagline: "Crispy and Golden",
            image: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1001, title: 'Fryday Menyu', desc: 'Fri, sous və toyuq parçaları.', discount: "20%", icon: "🍗" },
            ]
        },
        {
            id: 11,
            name: "Vapiano",
            logo: "🍝",
            tagline: "Chi va piano, va sano e va lontano",
            image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1101, title: 'Pasta / Pizza', desc: 'Bütün pastalara tələbə endirimi.', discount: "10%", icon: "🍝" },
            ]
        },
        {
            id: 12,
            name: "Entree",
            logo: "🥖",
            tagline: "Bakery and More",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1201, title: 'Sendviç & Coffee', desc: 'Gündəlik təzə məhsullar.', discount: "20%", icon: "🥪" },
            ]
        },
        {
            id: 13,
            name: "Baku Book Center",
            logo: "📚",
            tagline: "Bilginin Ünvanı",
            image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1301, title: 'Bütün Kitablar', desc: 'Tələbə kartı ilə alış-verişdə.', discount: "15%", icon: "📚" },
            ]
        },
        {
            id: 14,
            name: "Ali & Nino",
            logo: "📗",
            tagline: "Oxu!",
            image: "https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1401, title: 'Həftənin Kitabı', desc: 'Seçilmiş kitablara özəl.', discount: "10%", icon: "📖" },
            ]
        },
        {
            id: 15,
            name: "Bravo Market",
            logo: "🛒",
            tagline: "Ən aşağı qiymətlər",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
            deals: [
                { id: 1501, title: 'Məktəb Ləvazimatları', desc: 'Dəftər və qələm setlərinə.', discount: "5%", icon: "✏️" },
            ]
        },
    ];

    const currentCompany = allCompanies.find(c => c.id === Number(id)) || allCompanies[0];


    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDeals(prev => {
                const now = Date.now();
                const newDeals: Record<number, number> = {};
                let changed = false;
                Object.entries(prev).forEach(([id, expiry]) => {
                    if (expiry > now) {
                        newDeals[Number(id)] = expiry;
                    } else {
                        changed = true;
                    }
                });
                return changed ? newDeals : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleGetDeal = (dealId: number, title: string) => {
        if (!user) {
            alert(t.points.activateConfirm);
            return;
        }

        if (activeDeals[dealId]) return;

        const confirmActivation = confirm(`${title} ${t.points.activateConfirm}`);

        if (confirmActivation) {
            const expiry = Date.now() + 10 * 60 * 1000;
            setActiveDeals(prev => ({ ...prev, [dealId]: expiry }));

            updateUser({ points: (user.points || 0) + 20 });

            addNotification({
                title: t.points.activatedTitle,
                message: `${title} ${t.points.activatedMsg}`
            });

            alert(t.points.congrats);
        }
    };

    const formatTime = (expiry: number) => {
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.companyPage}>
            <header className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentCompany.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
                    <h2 className={styles.sectionTitle}>{t.dashboard.activeDeals}</h2>
                    <div className={styles.dealsGrid}>
                        {currentCompany.deals.map((deal: any) => {
                            const expiry = activeDeals[deal.id];
                            const isActive = !!expiry;

                            return (
                                <div key={deal.id} className={styles.dealCard}>
                                    <div className={styles.cardImage}>
                                        <span>{deal.icon}</span>
                                        <div className={styles.discountBadge}>-{deal.discount}</div>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3>{deal.title}</h3>
                                        <p>{deal.desc}</p>
                                        <button
                                            className={`btn-primary ${styles.btnGetDeal} ${isActive ? styles.btnActive : ''}`}
                                            onClick={() => handleGetDeal(deal.id, deal.title)}
                                        >
                                            {isActive ? (
                                                <>
                                                    <span>{t.points.active}</span>
                                                    <span className={styles.timerText}>{formatTime(expiry)} {t.points.secondsLeft}</span>
                                                </>
                                            ) : (
                                                t.points.get
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Link href="/" style={{ color: 'var(--primary)', fontWeight: '700' }}>← {t.common.backHome}</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
