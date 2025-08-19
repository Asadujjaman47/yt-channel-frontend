import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import MainContent from './components/MainContent.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { useCategories, useTags, useChannels } from './hooks/useApi';
import type { ChannelFilters } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // API data fetching with React Query
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useTags();

  // Build filters for channels query
  const channelFilters: ChannelFilters = {};
  if (searchQuery) channelFilters.q = searchQuery;
  if (selectedCategory) channelFilters.q = selectedCategory;
  if (selectedTags.length > 0) channelFilters.q = selectedTags[0]; // Backend supports single tag filter

  const { data: channels = [], isLoading: channelsLoading, error: channelsError } = useChannels(channelFilters);

  // Additional client-side filtering for multiple tags
  const filteredChannels = channels.filter(channel => {
    if (selectedTags.length === 0) return true;
    
    const channelTags = channel.tags.split(', ').map(tag => tag.trim().toLowerCase());
    return selectedTags.some(selectedTag => 
      channelTags.some(tag => tag.includes(selectedTag.toLowerCase()))
    );
  });

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

  // Show loading state if any data is loading
  if (categoriesLoading || tagsLoading || channelsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state if any data failed to load
  if (categoriesError || tagsError || channelsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to load data
          </h1>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
