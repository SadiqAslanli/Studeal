export const allCompanies = [
    {
        id: 1,
        name: "KFC Azerbaijan",
        tagline: "Always Original, Always Fresh",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7OOVEsL1bzTuB4MJfCc8BCCqSBGoOTQVmVQ&s",
        deals: [
            { id: 101, title: 'Tələbə Menyu (Zinger)', desc: 'Zinger burger, fri və içki.', contents: ["Zinger® Burger", "Kartof Fri (kiçik)", "Pepsi® 0.3L", "Ketçup/Mayonez"], discount: "20%", icon: "🍔", price: "7.90 AZN", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" },
            { id: 102, title: 'Ailə Paketi', desc: '8 parça toyuq, 2 fri, 1.5L Pepsi.', contents: ["8 parça Toyuq", "2 Böyük Kartof Fri", "1.5L Pepsi®"], discount: "15%", icon: "🍟", price: "24.50 AZN", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400" },
            { id: 103, title: 'Gecə Təklifi', desc: 'Saat 22:00-dan sonra 30% endirim.', contents: ["Bütün menyulara şamil olunur"], discount: "30%", icon: "🌙", price: "Dəyişir", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7OOVEsL1bzTuB4MJfCc8BCCqSBGoOTQVmVQ&s" },
        ],
        branches: [
            { id: 1, city: "Bakı", address: "Fəvvarələr Meydanı", workHours: "10:00 - 23:00" },
            { id: 2, city: "Bakı", address: "28 Mall AVM", workHours: "10:00 - 22:00" },
            { id: 3, city: "Bakı", address: "Gənclik Mall", workHours: "10:00 - 22:00" },
            { id: 4, city: "Gəncə", address: "Gəncə Mall", workHours: "10:00 - 22:00" },
            { id: 5, city: "Sumqayıt", address: "Sülh küçəsi", workHours: "10:00 - 22:00" },
            { id: 6, city: "Bakı", address: "Dəniz Mall", workHours: "10:00 - 23:00" },
            { id: 7, city: "Naxçıvan", address: "Təbriz küçəsi", workHours: "10:00 - 21:00" },
        ]
    },
    {
        id: 2,
        name: "Nike Store",
        tagline: "Just Do It",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 201, title: 'Yalnız Tələbələrə', desc: 'Bütün idman ayaqqabılarına endirim.', contents: ["Lifestyle", "Running", "Basketball", "Jordan"], discount: "15%", icon: "👟", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
            { id: 202, title: 'Yeni Sezon', desc: 'Geyim kolleksiyasında 10% keşbek.', contents: ["T-shirts", "Hoodies", "Pants"], discount: "10%", icon: "👕", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [
            { id: 1, city: "Bakı", address: "Tarqovı (Nizami küç.)", workHours: "10:00 - 21:00" },
            { id: 2, city: "Bakı", address: "Park Bulvar AVM", workHours: "10:00 - 22:00" },
            { id: 3, city: "Bakı", address: "Port Baku Mall", workHours: "10:00 - 22:00" },
        ]
    },
    {
        id: 4,
        name: "CinemaPlus",
        tagline: "Daha rəngarəng",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 401, title: 'Tələbə Bileti', desc: 'Həftə içi hər seansa 50% endirim.', contents: ["2D Seanslar", "3D Seanslar (eynək daxil deyil)"], discount: "50%", icon: "🎟️", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400" },
            { id: 402, title: 'Popcorn Combo', desc: 'Orta boy popcorn və içki.', contents: ["Orta boy Popcorn", "0.5L Pepsi®"], discount: "20%", icon: "🍿", image: "https://images.unsplash.com/photo-1585647347456-478adef3c35b?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [
            { id: 1, city: "Bakı", address: "28 Mall (4-cü mərtəbə)", workHours: "10:00 - 02:00" },
            { id: 2, city: "Bakı", address: "Gənclik Mall (3-cü mərtəbə)", workHours: "10:00 - 02:00" },
            { id: 3, city: "Bakı", address: "Dəniz Mall", workHours: "10:00 - 02:00" },
            { id: 4, city: "Sumqayıt", address: "Sumqayıt r-nu, Sülh küç.", workHours: "11:00 - 00:00" },
        ]
    },
    {
        id: 7,
        name: "McDonalds",
        tagline: "I'm Lovin' It",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 701, title: 'Tələbə Kombo', desc: 'Big Mac menyu özəl qiymətə.', contents: ["Big Mac®", "Orta boy Kartof Fri", "Orta boy İçki"], discount: "15%", icon: "🍔", image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=400" },
            { id: 702, title: 'Happy Meal', desc: 'Hər Bazar günü uşaqlara özəl.', contents: ["Sandviç", "Fri", "İçki", "Oyuncaq"], discount: "10%", icon: "🎁", image: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [
            { id: 1, city: "Bakı", address: "Fəvvarələr Meydanı", workHours: "00:00 - 24:00" },
            { id: 2, city: "Bakı", address: "Əhmədli metrosu", workHours: "08:00 - 00:00" },
            { id: 3, city: "Bakı", address: "Gənclik Mall", workHours: "10:00 - 23:00" },
            { id: 4, city: "Bakı", address: "Mərdəkan yolu", workHours: "09:00 - 02:00" },
            { id: 5, city: "Gəncə", address: "Mərkəzi Universitet yanı", workHours: "10:00 - 22:00" },
        ]
    },
    {
        id: 8,
        name: "Mado",
        tagline: "Doğadan Lezzete",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 801, title: 'Mado Səhər Yeməyi', desc: 'Ənənəvi türk səhər yeməyi.', contents: ["Pendir çeşidləri", "Zeytun", "Bal-Qaymaq", "İsti çörək"], discount: "10%", icon: "🍳", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [{ id: 1, city: "Bakı", address: "Nizami küçəsi", workHours: "09:00 - 23:00" }]
    },
    {
        id: 9,
        name: "Starbucks",
        tagline: "Inspired by you",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 901, title: 'Starbucks Coffee', desc: 'İstənilən orta boy içkiyə endirim.', contents: ["Latte", "Cappuccino", "Americano"], discount: "15%", icon: "☕", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [{ id: 1, city: "Bakı", address: "28 Mall", workHours: "10:00 - 22:00" }]
    },
    {
        id: 10,
        name: "Fryday",
        tagline: "Fresh and Fast",
        image: "https://imageproxy.wolt.com/mes-image/0207ffda-d544-4106-ae2d-c371ec2070b8/e85043fa-6d4c-4380-8622-35c89b68dd25",
        deals: [
            { id: 1001, title: 'Fryday Menyu', desc: 'Dəbli burger və fri.', contents: ["Burger", "Fri", "İçki"], discount: "20%", icon: "🍔", image: "https://imageproxy.wolt.com/mes-image/0207ffda-d544-4106-ae2d-c371ec2070b8/e85043fa-6d4c-4380-8622-35c89b68dd25" },
        ],
        branches: [{ id: 1, city: "Bakı", address: "İçərişəhər", workHours: "11:00 - 23:00" }]
    },
    {
        id: 14,
        name: "Ali & Nino",
        tagline: "Sənin Kitab Evin",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
        deals: [
            { id: 1401, title: 'Kitab Endirimi', desc: 'Bütün kitablara 10% endirim.', contents: ["Bədii ədəbiyyat", "Dərsliklər"], discount: "10%", icon: "📖", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400" },
        ],
        branches: [{ id: 1, city: "Bakı", address: "Park Bulvar", workHours: "10:00 - 22:00" }]
    }
];

export const staticDeals = [
    { id: 1, title: 'KFC Tələbə Menyu', company: 'KFC Azerbaijan', discount: '20%', type: 'Restaurant', typeId: 1, color: '#ff4d4d', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7OOVEsL1bzTuB4MJfCc8BCCqSBGoOTQVmVQ&s' },
    { id: 2, title: 'Nike Tələbə Kartı', company: 'Nike Store', discount: '15%', type: 'Shop', typeId: 2, color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'IELTS Hazırlığı', company: 'CELT Colleges', discount: '30%', type: 'Education', typeId: 3, color: '#0066ff', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Sinema Bileti', company: 'CinemaPlus', discount: '50%', type: 'Entertainment', typeId: 4, color: '#9c27b0', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'MacBook Pro', company: 'Alma Store', discount: '10%', type: 'Tech', typeId: 5, color: '#607d8b', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Pizza Festivalı', company: 'Pizza Mizza', discount: '25%', type: 'Restaurant', typeId: 1, color: '#ff9800', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
    { id: 7, title: 'McDonalds Tələbə Kombo', company: 'McDonalds', discount: '15%', type: 'Restaurant', typeId: 1, color: '#ffbc0d', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' },
    { id: 8, title: 'Mado Səhər Yeməyi', company: 'Mado', discount: '10%', type: 'Restaurant', typeId: 1, color: '#8b4513', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800' },
    { id: 9, title: 'Starbucks Coffee', company: 'Starbucks', discount: '15%', type: 'Restaurant', typeId: 1, color: '#00704a', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800' },
    { id: 10, title: 'Fryday Menyu', company: 'Fryday', discount: '20%', type: 'Restaurant', typeId: 1, color: '#e31837', image: 'https://imageproxy.wolt.com/mes-image/0207ffda-d544-4106-ae2d-c371ec2070b8/e85043fa-6d4c-4380-8622-35c89b68dd25' },
    { id: 11, title: 'Vapiano Pasta', company: 'Vapiano', discount: '10%', type: 'Restaurant', typeId: 1, color: '#df0615', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' },
    { id: 12, title: 'Entree Bakery', company: 'Entree', discount: '20%', type: 'Restaurant', typeId: 1, color: '#e6bd1a', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
    { id: 13, title: 'Baku Book Center', company: 'BBC', discount: '15%', type: 'Shop', typeId: 2, color: '#4b3621', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
    { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', discount: '10%', type: 'Shop', typeId: 2, color: '#ed1c24', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800' },
    { id: 15, title: 'Bravo Market', company: 'Bravo', discount: '5%', type: 'Shop', typeId: 2, color: '#f7931e', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
];
