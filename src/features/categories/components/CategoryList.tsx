import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (name: string) => void;
}

const CategoryList = ({ categories, selectedCategory, onCategorySelect }: CategoryListProps) => {
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryItem
          key={category}
          name={category}
          isSelected={selectedCategory === category}
          onSelect={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoryList;
