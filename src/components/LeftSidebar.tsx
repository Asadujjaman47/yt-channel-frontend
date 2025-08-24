import type { Category } from '../types';
import CategoryList from '../features/categories/components/CategoryList';
import { useEffect } from 'react';

interface LeftSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryName: string) => void;
}

const LeftSidebar = ({ categories, selectedCategory, onCategorySelect }: LeftSidebarProps) => {
  const categoryNames = categories.map(cat => cat.name);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  
  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
        <CategoryList
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
