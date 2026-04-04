import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

/**
 * Categories Page - Manage product categories
 * TODO: Implement full category management with drag & drop reordering
 */
export const CategoriesPage: React.FC = () => {
  // Placeholder categories - will be replaced with API data
  const [categories, setCategories] = React.useState([
    { id: 1, name: 'Fragrances', slug: 'fragrances', description: 'Oil-based perfumes', product_count: 12, color: '#D4AF37' },
    { id: 2, name: 'Beauty', slug: 'beauty', description: 'Cosmetics & Skincare', product_count: 8, color: '#3B82F6' },
    { id: 3, name: 'Hair', slug: 'hair', description: 'Human hair products', product_count: 5, color: '#8B5CF6' },
    { id: 4, name: 'Bags', slug: 'bags', description: 'Luxury handbags', product_count: 3, color: '#EC4899' },
    { id: 5, name: 'Watches', slug: 'watches', description: 'Luxury timepieces', product_count: 7, color: '#10B981' },
    { id: 6, name: 'Jewelry', slug: 'jewelry', description: 'Fine accessories', product_count: 9, color: '#F59E0B' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Categories</h1>
          <p className="text-dark-400 mt-1">Organize your products into categories</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Add Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hoverable className="group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{category.name}</h3>
                      <p className="text-sm text-dark-400">{category.product_count} products</p>
                      <code className="text-xs text-dark-500">/{category.slug}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
                      <GripVertical size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-dark-400 mt-3">{category.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management - Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-dark-400">
              The full category management system is being built and will include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>Add, edit, and delete categories</li>
              <li>Custom category colors and icons</li>
              <li>Drag & drop reordering</li>
              <li>Dynamic category assignment in product forms</li>
              <li>Category statistics and product counts</li>
              <li>Import/export categories</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
