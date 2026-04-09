import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, X, Check } from 'lucide-react';
import { reviewService, type Review } from '@/services/api';
import toast from 'react-hot-toast';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    is_verified: true,
    avatar: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await reviewService.update(editingReview.id, formData);
        toast.success('Review updated successfully');
      } else {
        await reviewService.create(formData);
        toast.success('Review created successfully');
      }
      setShowModal(false);
      setEditingReview(null);
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error('Failed to save review:', error);
      toast.error('Failed to save review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      location: review.location || '',
      rating: review.rating,
      text: review.text,
      is_verified: review.is_verified,
      avatar: review.avatar || '',
      sort_order: review.sort_order,
      is_active: review.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.delete(id);
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      rating: 5,
      text: '',
      is_verified: true,
      avatar: '',
      sort_order: 0,
      is_active: true,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingReview(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Customer Reviews</h1>
          <p className="text-dark-400 mt-1">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-900 border border-dark-800 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {review.avatar || review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{review.name}</h3>
                  <p className="text-sm text-dark-400">{review.location || 'No location'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-600'}
                />
              ))}
            </div>

            <p className="text-dark-300 text-sm leading-relaxed mb-4">
              "{review.text}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-dark-800">
              <span className={`text-xs px-2 py-1 rounded-full ${review.is_verified ? 'bg-green-900/50 text-green-400' : 'bg-dark-700 text-dark-400'}`}>
                {review.is_verified ? 'Verified' : 'Unverified'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${review.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                {review.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-dark-400">No reviews yet. Add your first review!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-900 border border-dark-800 rounded-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingReview(null); }}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white"
                    placeholder="e.g., Nairobi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Review Text</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white resize-none"
                  required
                  placeholder="Enter the review text..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 text-primary-500"
                  />
                  <span className="text-sm text-dark-300">Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 text-primary-500"
                  />
                  <span className="text-sm text-dark-300">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingReview(null); }}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {editingReview ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};