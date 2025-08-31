"use client"
import React, { useState, useEffect } from 'react';
import '../../component/Drawermenu/Drawermenu.css';
import menuIcon from '../../assets/image/logoSort.png'; // パスを修正
import { categories, Category } from '../../assets/data/categories';

export default function Drawermenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [blog, setBlog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="App">
      <button className="circle-button" onClick={() => setIsOpen(true)}>
        <img src={menuIcon.src} alt="メニュー" /> {/* .srcを追加してNext.jsの静的インポートに対応 */}
      </button>
      
      <div
        className={`modal-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>絞り込む</h2>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          
          <div className="category-scroll">
            {categories.map((category, index) => (
              <button 
                key={category}
                className={`category-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
