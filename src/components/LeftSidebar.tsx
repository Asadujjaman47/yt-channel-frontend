import type { Category } from '../types';

interface LeftSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryName: string) => void;
}

const LeftSidebar = ({ categories, selectedCategory, onCategorySelect }: LeftSidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                selectedCategory === category.name
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onCategorySelect(category.name)}
            >
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
