interface CategoryItemProps {
  name: string;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const CategoryItem = ({ name, isSelected, onSelect }: CategoryItemProps) => {
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isSelected
          ? 'bg-red-100 text-red-700 border border-red-200'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
      onClick={() => onSelect(name)}
    >
      {name}
    </button>
  );
};

export default CategoryItem;
