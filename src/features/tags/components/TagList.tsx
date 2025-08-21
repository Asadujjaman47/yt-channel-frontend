import TagItem from './TagItem';

interface TagListProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (name: string) => void;
}

const TagList = ({ tags, selectedTags, onTagSelect }: TagListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagItem
          key={tag}
          name={tag}
          isSelected={selectedTags.includes(tag)}
          onSelect={onTagSelect}
        />
      ))}
    </div>
  );
};

export default TagList;
