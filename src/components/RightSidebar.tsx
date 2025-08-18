import type { Tag } from '../types';

interface RightSidebarProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

const RightSidebar = ({ tags, selectedTags, onTagSelect }: RightSidebarProps) => {
  return (
    <div className="w-96 bg-white shadow-md border-l border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2 max-h-[calc(100vh-120px)] overflow-y-auto">
          {tags.map((tag) => (
            <button
              key={tag.name}
              className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                selectedTags.includes(tag.name)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              onClick={() => onTagSelect(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
