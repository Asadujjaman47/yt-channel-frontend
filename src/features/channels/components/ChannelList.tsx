import type { Channel } from '../../../types';
import ChannelCard from './ChannelCard';

interface ChannelListProps {
  channels: Channel[];
}

const ChannelList = ({ channels }: ChannelListProps) => {
  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No channels found</div>
        <p className="text-gray-400 text-sm">
          Try selecting a category or tag to see channels, or use the search bar above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map((channel, index) => (
        <ChannelCard key={`${channel.id || index}-${channel.name}`} channel={channel} />
      ))}
    </div>
  );
};

export default ChannelList;
