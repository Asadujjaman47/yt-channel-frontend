import { useState } from 'react';
import Navbar from './components/Navbar.tsx';
import LeftSidebar from './components/LeftSidebar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import MainContent from './components/MainContent.tsx';
import { useCategories, useTags, useChannels } from './hooks/useApi';
import type { ChannelFilters } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // API data fetching with React Query
  const { data: categories = [], error: categoriesError } = useCategories();
  const { data: tags = [], error: tagsError } = useTags();

  // Build filters for channels query
  const channelFilters: ChannelFilters = {};
  if (searchQuery) {
    channelFilters.q = searchQuery;
  } else if (selectedCategory) {
    channelFilters.category = selectedCategory;
  } else if (selectedTags.length > 0) {
    channelFilters.tags = selectedTags;
  }

  const { data: channels = [], isLoading: channelsLoading, error: channelsError } = useChannels(channelFilters);

  // Backend handles filtering; use channels directly
  const filteredChannels = channels;

  const handleCategorySelect = (categoryName: string) => {
    const willSelect = selectedCategory !== categoryName;
    setSelectedCategory(willSelect ? categoryName : null);
    if (willSelect) {
      setSelectedTags([]);
      setSearchQuery('');
    }
  };

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName];

      if (next.length > 0) {
        setSelectedCategory(null);
        setSearchQuery('');
      }

      return next;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedCategory(null);
      setSelectedTags([]);
    }
  };

  // Do not block the full layout on loading; only MainContent will show a spinner for channels

  // Keep layout visible even if some data failed; show a lightweight banner instead of a full-screen block

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} query={searchQuery} />
      <div className="flex">
        <LeftSidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <div className="flex-1">
          {(categoriesError || tagsError || channelsError) && (
            <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm px-4 py-2">
              Some data failed to load. You can still browse available content. Try refresh.
            </div>
          )}
          <MainContent channels={filteredChannels} isLoading={channelsLoading} />
        </div>
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
