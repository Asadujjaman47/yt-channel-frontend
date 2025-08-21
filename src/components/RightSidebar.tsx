import type { Tag } from '../types';
import TagList from '../features/tags/components/TagList';

interface RightSidebarProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

const RightSidebar = ({ tags, selectedTags, onTagSelect }: RightSidebarProps) => {
  const tagNames = tags.map(tag => tag.name);
  
  return (
    <div className="w-96 bg-white shadow-md border-l border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <TagList
            tags={tagNames}
            selectedTags={selectedTags}
            onTagSelect={onTagSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
