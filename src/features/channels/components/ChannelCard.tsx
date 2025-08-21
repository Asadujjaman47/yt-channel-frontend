import type { Channel } from '../../../types';

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  const handleChannelClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
            {channel.name}
          </h3>
          <button
            type="button"
            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            onClick={() => handleChannelClick(channel.url)}
            aria-label="Open channel"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
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

      {/* Hover tooltip */}
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
  );
};

export default ChannelCard;
