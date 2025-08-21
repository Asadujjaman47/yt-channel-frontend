import type { Channel } from '../types';
import LoadingSpinner from './LoadingSpinner.tsx';
import ChannelList from '../features/channels/components/ChannelList';
import ChannelPagination from '../features/channels/components/ChannelPagination';

interface MainContentProps {
  channels: Channel[];
  isLoading?: boolean;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const MainContent = ({ 
  channels, 
  isLoading = false, 
  page = 1, 
  limit = 20, 
  total = 0, 
  totalPages = 1, 
  onPageChange, 
  onLimitChange 
}: MainContentProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading channels...</h1>
          <p className="text-gray-600">Please wait while we fetch the latest channels.</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {channels.length === 0 ? 'No channels found' : `Channels (${total || channels.length})`}
        </h1>
        <p className="text-gray-600">
          {channels.length === 0 
            ? 'Try selecting a category or tag to see channels, or use the search bar above.'
            : 'Click on any channel card to visit the YouTube channel.'
          }
        </p>
      </div>

      <ChannelList channels={channels} />

      {/* Pagination */}
      {channels.length > 0 && (
        <ChannelPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
};

export default MainContent;
