import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { Button } from '@/components/ui/Button';

export const ProductFilters: React.FC = () => {
  const { filters, setFilters, searchQuery, setSearchQuery, products } = useProductStore();

  const categories = [...new Set(products.map((p) => p.category))];

  const handleCategoryChange = (category: string) => {
    setFilters({ category: category || undefined });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      search: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
    });
  };

  const activeFiltersCount =
    (!!searchQuery ? 1 : 0) +
    (!!filters.category ? 1 : 0) +
    (!!filters.minPrice ? 1 : 0) +
    (!!filters.maxPrice ? 1 : 0) +
    (!!filters.minRating ? 1 : 0);

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={filters.minRating || ''}
          onChange={(e) =>
            setFilters({
              minRating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X size={16} />}>
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};
