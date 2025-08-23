import { useState, useCallback } from 'react';
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
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // API data fetching with React Query
  const { data: categories = [], error: categoriesError, refetch: refetchCategories } = useCategories();
  const { data: tags = [], error: tagsError, refetch: refetchTags } = useTags();

  // Build filters for channels query
  const channelFilters: ChannelFilters = { page, limit };
  if (searchQuery) {
    channelFilters.q = searchQuery;
  } else if (selectedCategory) {
    channelFilters.category = selectedCategory;
  } else if (selectedTags.length > 0) {
    channelFilters.tags = selectedTags;
  }

  const { data: channelsPage, isLoading: channelsLoading, error: channelsError, refetch: refetchChannels } = useChannels(channelFilters);

  const filteredChannels = channelsPage?.items ?? [];
  const paginationMeta = channelsPage?.meta;

  // Refresh function for after modal operations
  const handleDataChange = useCallback(() => {
    refetchCategories();
    refetchTags();
    refetchChannels();
    setRefreshKey(prev => prev + 1);
  }, [refetchCategories, refetchTags, refetchChannels]);

  const handleCategorySelect = (categoryName: string) => {
    const willSelect = selectedCategory !== categoryName;
    setSelectedCategory(willSelect ? categoryName : null);
    setPage(1);
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
        setPage(1);
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
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.max(1, nextPage));
  };
  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  // Do not block the full layout on loading; only MainContent will show a spinner for channels

  // Keep layout visible even if some data failed; show a lightweight banner instead of a full-screen block

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} query={searchQuery} onDataChange={handleDataChange} />
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
          <MainContent 
            channels={filteredChannels} 
            isLoading={channelsLoading}
            page={page}
            limit={limit}
            total={paginationMeta?.total ?? 0}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
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
