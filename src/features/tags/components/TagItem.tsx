interface TagItemProps {
  name: string;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const TagItem = ({ name, isSelected, onSelect }: TagItemProps) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        isSelected
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      }`}
      onClick={() => onSelect(name)}
    >
      {name}
    </button>
  );
};

export default TagItem;
