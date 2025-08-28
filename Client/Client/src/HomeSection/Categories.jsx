import React, { useState } from "react";
import CategoriesPage from "./categoriesPage";
import Category from "./Category";

export default function Categories() {
  const [currentView, setCurrentView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  // Render based on current view
  return (
    <>
      {currentView === 'categories' && (
        <CategoriesPage onCategoryClick={handleCategoryClick} />
      )}
      {currentView === 'category' && selectedCategory && (
        <Category 
          category={selectedCategory} 
          onBackClick={handleBackToCategories} 
        />
      )}
    </>
  );
}