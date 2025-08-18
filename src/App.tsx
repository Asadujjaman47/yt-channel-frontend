import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import MainContent from './components/MainContent.tsx';
import type { Category, Channel, Tag} from './types';

// Import data
import categoriesData from './data/categories.json';
import channelsData from './data/channels.json';
import tagsData from './data/tags.json';

function App() {
  const [categories] = useState<Category[]>(categoriesData);
  const [channels] = useState<Channel[]>(channelsData);
  const [tags] = useState<Tag[]>(tagsData);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);

  // Filter channels based on selected category, tags, and search query
  useEffect(() => {
    let filtered = channels;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(channel => channel.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(channel => {
        const channelTags = channel.tags.split(', ').map(tag => tag.trim());
        return selectedTags.some(selectedTag => 
          channelTags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
        );
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(channel => 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.tags.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  }, [channels, selectedCategory, selectedTags, searchQuery]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <div className="flex">
        <LeftSidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <MainContent channels={filteredChannels} />
        <RightSidebar 
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>
    </div>
  );
}

export default App;
