import type { Channel } from '../types';
import LoadingSpinner from './LoadingSpinner.tsx';

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

const MainContent = ({ channels, isLoading = false, page = 1, limit = 20, total = 0, totalPages = 1, onPageChange, onLimitChange }: MainContentProps) => {
  const handleChannelClick = (url: string) => {
    window.open(url, '_blank');
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleChannelClick(channel.url)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                  {channel.name}
                </h3>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-gray-500">Category:</span>
                  <span className="ml-2 text-sm font-medium text-gray-800">{channel.category}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500">Tags:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {(channel.tags || '')
                      .split(/,\s*/)
                      .filter(Boolean)
                      .map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hover tooltip (below card, extra-compact) */}
            <div className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 w-48 max-w-[85vw] text-[10px] bg-white/95 backdrop-blur border border-gray-200 shadow rounded p-2 opacity-0 group-hover:opacity-100 pointer-events-none">
              <div className="space-y-1.5">
                {channel.description && (
                  <div>
                    <span className="font-medium text-gray-500">Description:</span>
                    <p className="mt-0.5 text-gray-700">{channel.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="mt-0.5">{new Date(channel.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Edited:</span>
                    <p className="mt-0.5">{new Date(channel.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {channels.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            {total > 0 && (
              <span>
                Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">
              Per page:
              <select
                className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                value={limit}
                onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
              >
                {[12, 20, 40, 80].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded border ${page <= 1 ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
                onClick={() => page > 1 && onPageChange && onPageChange(page - 1)}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {Math.max(1, totalPages)}
              </span>
              <button
                className={`px-3 py-1.5 text-sm rounded border ${page >= (totalPages || 1) ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
                onClick={() => page < (totalPages || 1) && onPageChange && onPageChange(page + 1)}
                disabled={page >= (totalPages || 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
