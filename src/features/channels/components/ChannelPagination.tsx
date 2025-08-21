interface ChannelPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const ChannelPagination = ({ 
  page, 
  limit, 
  total, 
  totalPages, 
  onPageChange, 
  onLimitChange 
}: ChannelPaginationProps) => {
  return (
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
  );
};

export default ChannelPagination;
