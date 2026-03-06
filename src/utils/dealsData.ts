export const allCompanies = [
    {
        id: 1,
        name: "KFC Azerbaijan",
        logo: "🍗",
        tagline: "Always Original, Always Fresh",
        image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 101, title: 'Tələbə Menyu (Zinger)', desc: 'Zinger burger, fri və içki.', contents: ["Zinger® Burger", "Kartof Fri (kiçik)", "Pepsi® 0.3L", "Ketçup/Mayonez"], discount: "20%", icon: "🍔", price: "7.90 AZN" },
            { id: 102, title: 'Ailə Paketi', desc: '8 parça toyuq, 2 fri, 1.5L Pepsi.', contents: ["8 parça Toyuq", "2 Böyük Kartof Fri", "1.5L Pepsi®"], discount: "15%", icon: "🍟", price: "24.50 AZN" },
            { id: 103, title: 'Gecə Təklifi', desc: 'Saat 22:00-dan sonra 30% endirim.', contents: ["Bütün menyulara şamil olunur"], discount: "30%", icon: "🌙", price: "Dəyişir" },
        ]
    },
    {
        id: 2,
        name: "Nike Store",
        logo: "👟",
        tagline: "Just Do It",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 201, title: 'Yalnız Tələbələrə', desc: 'Bütün idman ayaqqabılarına endirim.', contents: ["Lifestyle", "Running", "Basketball", "Jordan"], discount: "15%", icon: "👟" },
            { id: 202, title: 'Yeni Sezon', desc: 'Geyim kolleksiyasında 10% keşbek.', contents: ["T-shirts", "Hoodies", "Pants"], discount: "10%", icon: "👕" },
        ]
    },
    {
        id: 4,
        name: "CinemaPlus",
        logo: "🎬",
        tagline: "Daha rəngarəng",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 401, title: 'Tələbə Bileti', desc: 'Həftə içi hər seansa 50% endirim.', contents: ["2D Seanslar", "3D Seanslar (eynək daxil deyil)"], discount: "50%", icon: "🎟️" },
            { id: 402, title: 'Popcorn Combo', desc: 'Orta boy popcorn və içki.', contents: ["Orta boy Popcorn", "0.5L Pepsi®"], discount: "20%", icon: "🍿" },
        ]
    },
    {
        id: 7,
        name: "McDonalds",
        logo: "🍟",
        tagline: "I'm Lovin' It",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 701, title: 'Tələbə Kombo', desc: 'Big Mac menyu özəl qiymətə.', contents: ["Big Mac®", "Orta boy Kartof Fri", "Orta boy İçki"], discount: "15%", icon: "🍔" },
            { id: 702, title: 'Happy Meal', desc: 'Hər Bazar günü uşaqlara özəl.', contents: ["Sandviç", "Fri", "İçki", "Oyuncaq"], discount: "10%", icon: "🎁" },
        ]
    }
];

export const staticDeals = [
    { id: 1, title: 'KFC Tələbə Menyu', company: 'KFC Azerbaijan', discount: '20%', type: 'Restaurant', typeId: 1, color: '#ff4d4d', image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Nike Tələbə Kartı', company: 'Nike Store', discount: '15%', type: 'Shop', typeId: 2, color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'IELTS Hazırlığı', company: 'CELT Colleges', discount: '30%', type: 'Education', typeId: 3, color: '#0066ff', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Sinema Bileti', company: 'CinemaPlus', discount: '50%', type: 'Entertainment', typeId: 4, color: '#9c27b0', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'MacBook Pro', company: 'Alma Store', discount: '10%', type: 'Tech', typeId: 5, color: '#607d8b', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Pizza Festivalı', company: 'Pizza Mizza', discount: '25%', type: 'Restaurant', typeId: 1, color: '#ff9800', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'McDonalds Tələbə Kombo', company: 'McDonalds', discount: '15%', type: 'Restaurant', typeId: 1, color: '#ffbc0d', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'Mado Səhər Yeməyi', company: 'Mado', discount: '10%', type: 'Restaurant', typeId: 1, color: '#8b4513', image: 'https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800' },
    { id: 9, title: 'Starbucks Coffee', company: 'Starbucks', discount: '15%', type: 'Restaurant', typeId: 1, color: '#00704a', image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800' },
    { id: 10, title: 'Fryday Menyu', company: 'Fryday', discount: '20%', type: 'Restaurant', typeId: 1, color: '#e31837', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800' },
    { id: 11, title: 'Vapiano Pasta', company: 'Vapiano', discount: '10%', type: 'Restaurant', typeId: 1, color: '#df0615', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' },
    { id: 12, title: 'Entree Bakery', company: 'Entree', discount: '20%', type: 'Restaurant', typeId: 1, color: '#e6bd1a', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
    { id: 13, title: 'Baku Book Center', company: 'BBC', discount: '15%', type: 'Shop', typeId: 2, color: '#4b3621', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
    { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', discount: '10%', type: 'Shop', typeId: 2, color: '#ed1c24', image: 'https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800' },
    { id: 15, title: 'Bravo Market', company: 'Bravo', discount: '5%', type: 'Shop', typeId: 2, color: '#f7931e', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
];
