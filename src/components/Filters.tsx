"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import styles from './Filters.module.css';

interface FiltersProps {
  onCategoryChange: (categoryId: number) => void;
}

export default function Filters({ onCategoryChange }: FiltersProps) {
  const { t } = useLanguage();
  const [activeCat, setActiveCat] = useState(6); // Default to 'All'
  const [activeSort, setActiveSort] = useState('new');

  const categories = [
    { id: 1, name: t.categories.restaurant, icon: "🍴" },
    { id: 2, name: t.categories.shop, icon: "🛍️" },
    { id: 3, name: t.categories.education, icon: "📚" },
    { id: 4, name: t.categories.entertainment, icon: "🎫" },
    { id: 5, name: t.categories.tech, icon: "💻" },
    { id: 6, name: t.categories.all, icon: "✨" },
  ];

  const handleCategoryClick = (id: number) => {
    setActiveCat(id);
    onCategoryChange(id);
  };

  const subFilters = [
    { id: 'fast', name: t.tags.fast, parent: 1 },
    { id: 'cafe', name: t.tags.cafe, parent: 1 },
    { id: 'cloth', name: t.tags.cloth, parent: 2 },
    { id: 'book', name: t.tags.book, parent: 3 },
    { id: 'cinema', name: t.tags.cinema, parent: 4 },
  ];

  const sortOptions = [
    { id: 'new', name: t.sort.new },
    { id: 'popular', name: t.sort.popular },
    { id: 'max', name: t.sort.max },
  ];

  return (
    <section className={styles.filters}>
      <div className="container">
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
                <span className={styles.icon}>{cat.icon}</span>
                <span className={styles.name}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Secondary Filters */}
        <div className={styles.secondaryFilters}>
          <div className={styles.subTags}>
            {subFilters.filter(sub => activeCat === 6 || sub.parent === activeCat).map((tag) => (
              <button key={tag.id} className={styles.tagBtn}>
                #{tag.name}
              </button>
            ))}
          </div>

          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>{t.sort.label}</span>
            <div className={styles.sortList}>
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  className={`${styles.sortBtn} ${activeSort === opt.id ? styles.activeSort : ''}`}
                  onClick={() => setActiveSort(opt.id)}
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
