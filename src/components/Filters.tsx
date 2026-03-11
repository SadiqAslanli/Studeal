"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import styles from './Filters.module.css';

import { Search } from 'lucide-react';

interface FiltersProps {
  onCategoryChange: (categoryId: number) => void;
  onSortChange: (sortOption: string) => void;
  onSearch: (query: string) => void;
}

export default function Filters({ onCategoryChange, onSortChange, onSearch }: FiltersProps) {
  const { t } = useLanguage();
  const [activeCat, setActiveCat] = useState(6); // Default to 'All'
  const [activeSort, setActiveSort] = useState('new');

  const categories = [
    { id: 1, name: t.categories.restaurant, icon: "restaurant" },
    { id: 2, name: t.categories.shop, icon: "checkroom" }, // Clothing icon specifically mentioned
    { id: 3, name: t.categories.education, icon: "school" },
    { id: 4, name: t.categories.entertainment, icon: "theater_comedy" },
    { id: 5, name: t.categories.tech, icon: "devices" },
    { id: 6, name: t.categories.all, icon: "grid_view" },
  ];

  const handleCategoryClick = (id: number) => {
    setActiveCat(id);
    onCategoryChange(id);
  };

  const handleSortClick = (id: string) => {
    setActiveSort(id);
    onSortChange(id);
  };

  const sortOptions = [
    { id: 'new', name: t.sort.new },
    { id: 'popular', name: t.sort.popular },
    { id: 'max', name: t.sort.max },
  ];

  return (
    <section className={styles.filters}>
      <div className="container">
        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Main Categories */}
        <div className={styles.filterWrapper}>
          <div className={styles.label}>{t.categories.label}</div>
          <div className={styles.filterList}>
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                className={`${styles.filterItem} ${activeCat === cat.id ? styles.active : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={styles.icon}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <span className={styles.name}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Secondary Filters */}
        <div className={styles.secondaryFilters}>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>{t.sort.label}</span>
            <div className={styles.sortList}>
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  className={`${styles.sortBtn} ${activeSort === opt.id ? styles.activeSort : ''}`}
                  onClick={() => handleSortClick(opt.id)}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
