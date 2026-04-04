import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Upload, Search, Grid, List, Trash2, Eye, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';
import { useMediaStore } from '@/store/useMediaStore';
import { mediaService } from '@/services/api';
import toast from 'react-hot-toast';

export const MediaPage: React.FC = () => {
  const { media, isLoading, selectedMedia, fetchMedia, deleteMedia, selectMedia, clearSelection } = useMediaStore();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [selectedDetail, setSelectedDetail] = useState<{ filename: string; path: string; size: number; size_formatted: string; uploaded_at: string; product_count: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const filesArray = Array.from(files);
      const result = await mediaService.upload(filesArray);
      setUploadProgress(100);
      toast.success(result.message);
      clearSelection();
      setTimeout(() => {
        fetchMedia();
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;
    if (!window.confirm(`Delete ${selectedMedia.size} selected image(s)? This cannot be undone.`)) return;

    selectedMedia.forEach(async (filename) => {
      await deleteMedia(filename);
    });

    toast.success(`${selectedMedia.size} image(s) deleted successfully`);
    clearSelection();
  };

  const handleDeleteSingle = async (filename: string) => {
    if (!window.confirm(`Delete ${filename}? This cannot be undone.`)) return;
    try {
      await deleteMedia(filename);
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to delete image');
    }
  };

  const selectedCount = selectedMedia.size;

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
          <div className="flex gap-2">
            {selectedCount > 0 && (
              <Button leftIcon={<Trash2 size={18} />} variant="secondary" onClick={handleBulkDelete} className="text-red-400 border-red-500/50 hover:bg-red-500/10 hover:border-red-500">
                Delete Selected ({selectedCount})
              </Button>
            )}
            <Button
              leftIcon={<Upload size={18} />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Images
            </Button>
          </div>
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

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-dark-700 rounded-xl p-8 text-center transition-all hover:border-primary-500/50 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-dark-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Drop images here or click to upload</h3>
        <p className="text-dark-400 mb-4">Upload images via product form (direct upload coming soon)</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-dark-400">Loading media...</div>
      ) : filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Image className="mx-auto h-16 w-16 text-dark-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No images found</h3>
            <p className="text-dark-400 mb-4">
              {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.filename}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`group relative aspect-square bg-dark-900 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedMedia.has(item.filename) ? 'border-primary-500' : 'border-dark-800 hover:border-primary-500/50'
              }`}
              onClick={() => {
                if (selectedMedia.size > 0) {
                  selectMedia(item.filename, !selectedMedia.has(item.filename));
                } else {
                  setSelectedDetail(item);
                }
              }}
            >
              <img
                src={item.path}
                alt={item.filename}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-3">
                {selectedMedia.size > 0 ? (
                  <div className={`p-2 rounded-lg ${selectedMedia.has(item.filename) ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400'}`}>
                    {selectedMedia.has(item.filename) ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-dark-400 rounded" />}
                  </div>
                ) : (
                  <>
                    <button
                      className="p-2 bg-dark-800/80 rounded-lg text-white hover:bg-dark-700 transition-colors"
                      title="View details"
                      onClick={(e) => { e.stopPropagation(); setSelectedDetail(item); }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 bg-dark-800/80 rounded-lg text-red-400 hover:bg-red-500 transition-colors"
                      title="Delete"
                      onClick={(e) => { e.stopPropagation(); handleDeleteSingle(item.filename); }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
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
                  <th className="px-4 py-3 w-12"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Preview</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Filename</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Used In</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-400">Uploaded</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-dark-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {filteredMedia.map((item) => (
                  <tr
                    key={item.filename}
                    className={`hover:bg-dark-800/50 transition-colors cursor-pointer ${selectedMedia.has(item.filename) ? 'bg-primary-500/10' : ''}`}
                    onClick={() => {
                      if (selectedMedia.size > 0) {
                        selectMedia(item.filename, !selectedMedia.has(item.filename));
                      } else {
                        setSelectedDetail(item);
                      }
                    }}
                  >
                    <td className="px-4 py-3">
                      {selectedMedia.size > 0 && (
                        <div className={`w-4 h-4 border-2 rounded ${selectedMedia.has(item.filename) ? 'bg-primary-500 border-primary-500' : 'border-dark-500'}`}>
                          {selectedMedia.has(item.filename) && <Check size={12} className="text-white mx-auto" />}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-16 h-16 bg-dark-900 rounded-lg overflow-hidden">
                        <img src={item.path} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-white">{item.filename}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">{item.size_formatted}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">
                      {item.product_count === 0 ? (
                        <span className="text-red-400">Unused</span>
                      ) : (
                        <span className="text-green-400">{item.product_count} product(s)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
                          onClick={(e) => { e.stopPropagation(); setSelectedDetail(item); }}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-dark-800 text-red-400 hover:text-red-300 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleDeleteSingle(item.filename); }}
                          title="Delete"
                        >
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-900 rounded-2xl border border-dark-800 max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-dark-800 flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-white">Image Details</h2>
                <button onClick={() => setSelectedDetail(null)} className="text-dark-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img src={selectedDetail.path} alt={selectedDetail.filename} className="w-full rounded-lg" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-dark-400">Filename</h4>
                      <code className="text-white">{selectedDetail.filename}</code>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dark-400">Path</h4>
                      <code className="text-white">{selectedDetail.path}</code>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dark-400">Size</h4>
                      <p className="text-white">{selectedDetail.size_formatted}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dark-400">Uploaded</h4>
                      <p className="text-white">{new Date(selectedDetail.uploaded_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-dark-400">Used In Products</h4>
                      <p className="text-white">{selectedDetail.product_count} product(s)</p>
                    </div>
                    <div className="pt-4 border-t border-dark-800 flex gap-2">
                      <Button
                        leftIcon={<Trash2 size={16} />}
                        variant="secondary"
                        className="text-red-400 border-red-500/50 hover:bg-red-500/10 hover:border-red-500"
                        onClick={() => {
                          handleDeleteSingle(selectedDetail.filename);
                          setSelectedDetail(null);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        leftIcon={<Check size={16} />}
                        onClick={() => {
                          navigator.clipboard.writeText(selectedDetail.path);
                          toast.success('Path copied to clipboard');
                        }}
                      >
                        Copy Path
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
