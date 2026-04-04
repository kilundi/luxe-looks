import React from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Search, Grid, List, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

/**
 * Media Library Page - Manage uploaded images
 * TODO: Implement full media library with gallery view, search, and bulk operations
 */
export const MediaPage: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Placeholder images - will be replaced with API data
  const placeholderImages = [
    { id: 1, filename: 'perfume-bottle-1.jpg', size: '245 KB', dimensions: '800x600', uploaded_at: '2025-04-01T10:30:00' },
    { id: 2, filename: 'necklace-gold.jpg', size: '512 KB', dimensions: '1200x800', uploaded_at: '2025-03-28T14:20:00' },
    { id: 3, filename: 'handbag-leather.jpg', size: '1.2 MB', dimensions: '1600x1200', uploaded_at: '2025-03-25T09:15:00' },
    { id: 4, filename: 'watch-luxury.jpg', size: '768 KB', dimensions: '1000x1000', uploaded_at: '2025-03-20T16:45:00' },
    { id: 5, filename: 'earrings-diamond.jpg', size: '432 KB', dimensions: '800x800', uploaded_at: '2025-03-18T11:00:00' },
    { id: 6, filename: 'perfume-rose.jpg', size: '890 KB', dimensions: '1024x768', uploaded_at: '2025-03-15T08:30:00' },
  ];

  const filteredImages = placeholderImages.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Media Library</h1>
            <p className="text-dark-400 mt-1">Upload and manage product images</p>
          </div>
          <Button leftIcon={<Upload size={18} />}>Upload Images</Button>
        </div>

        {/* Search and view toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search images by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500/20 text-primary-500'
                  : 'bg-dark-900 border border-dark-800 text-dark-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500/20 text-primary-500'
                  : 'bg-dark-900 border border-dark-800 text-dark-400 hover:text-white'
              }`}
              title="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Image className="mx-auto h-16 w-16 text-dark-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No images found</h3>
            <p className="text-dark-400 mb-4">
              {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
            </p>
            <Button leftIcon={<Upload size={18} />}>Upload Images</Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-square bg-dark-900 rounded-xl overflow-hidden border border-dark-800 hover:border-primary-500/50 transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                <Image className="w-12 h-12 text-dark-600" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-3">
                <button
                  className="p-2 bg-dark-800/80 rounded-lg text-white hover:bg-dark-700 transition-colors"
                  title="View"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="p-2 bg-dark-800/80 rounded-lg text-red-400 hover:bg-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{image.filename}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Preview</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Filename</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Dimensions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Uploaded</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-dark-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {filteredImages.map((image) => (
                  <tr key={image.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-dark-900 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-dark-600" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-white">{image.filename}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">{image.size}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">{image.dimensions}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">
                      {new Date(image.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 rounded hover:bg-dark-800 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Media Library - Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-dark-400">
              The full media library features are being developed and will include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>Drag & drop image upload with progress</li>
              <li>Image optimization and WebP conversion</li>
              <li>Bulk selection and operations</li>
              <li>Unused image detection and cleanup</li>
              <li>Image picker integration in product form</li>
              <li>Image details modal with dimensions and file info</li>
              <li>Search and filter by upload date</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
