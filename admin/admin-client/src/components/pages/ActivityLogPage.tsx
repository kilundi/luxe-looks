import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash,
  Upload,
  RefreshCw,
  History,
  User,
  Globe,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';
import { useActivityLogStore } from '@/store/useActivityLogStore';
import toast from 'react-hot-toast';

const actionConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  create: { icon: Plus, color: 'text-green-400', bgColor: 'bg-green-500/10', label: 'Create' },
  update: { icon: Edit3, color: 'text-blue-400', bgColor: 'bg-blue-500/10', label: 'Update' },
  delete: { icon: Trash, color: 'text-red-400', bgColor: 'bg-red-500/10', label: 'Delete' },
  upload: { icon: Upload, color: 'text-purple-400', bgColor: 'bg-purple-500/10', label: 'Upload' },
};

const entityIcons: Record<string, string> = {
  product: '📦',
  category: '📁',
  media: '🖼️',
  setting: '⚙️',
};

const formatTimeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString();
};

export const ActivityLogPage: React.FC = () => {
  const {
    logs,
    isLoading,
    totalCount,
    currentPage,
    totalPages,
    filters,
    fetchLogs,
    setFilters,
    clearFilters,
    exportLogs,
    cleanupLogs,
  } = useActivityLogStore();

  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cleanupDays, setCleanupDays] = useState('90');
  const [isCleaning, setIsCleaning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLogs();
      toast.success('Activity logs exported successfully');
    } catch {
      toast.error('Failed to export logs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      const result = await cleanupLogs(parseInt(cleanupDays));
      toast.success(result.message);
    } catch {
      toast.error('Failed to cleanup logs');
    } finally {
      setIsCleaning(false);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const toggleExpand = (id: number) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  const activeFiltersCount = [
    filters.action,
    filters.entity_type,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Activity Log</h1>
          <p className="text-dark-400 mt-1">
            {totalCount} events recorded
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            className={activeFiltersCount > 0 ? 'ring-1 ring-primary-500' : ''}
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
            isLoading={isExporting}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-dark-900 border border-dark-800 rounded-xl p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Action</label>
              <select
                value={filters.action || ''}
                onChange={(e) => setFilters({ action: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="upload">Upload</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Entity Type</label>
              <select
                value={filters.entity_type || ''}
                onChange={(e) => setFilters({ entity_type: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="product">Product</option>
                <option value="category">Category</option>
                <option value="media">Media</option>
                <option value="setting">Setting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ dateFrom: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ dateTo: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History size={20} />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={cleanupDays}
              onChange={(e) => setCleanupDays(e.target.value)}
              min="1"
              className="w-20 px-2 py-1 bg-dark-800 border border-dark-700 rounded text-white text-sm text-center"
            />
            <span className="text-dark-400 text-sm">days old</span>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={handleCleanup}
              isLoading={isCleaning}
              className="text-red-400 hover:text-red-300"
            >
              Cleanup
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16">
              <History size={40} className="mx-auto text-dark-600 mb-4" />
              <p className="text-dark-400">No activity logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-800">
              {logs.map((log) => {
                const config = actionConfig[log.action] || actionConfig.update;
                const ActionIcon = config.icon;
                const isExpanded = expandedLog === log.id;

                return (
                  <div key={log.id} className="hover:bg-dark-800/50 transition-colors">
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer"
                      onClick={() => toggleExpand(log.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                          <ActionIcon size={18} className={config.color} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-dark-300 text-sm">
                              {entityIcons[log.entity_type || ''] || '📋'} {log.entity_type || 'Unknown'}
                              {log.entity_id && ` #${log.entity_id}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-dark-500">
                            {log.username ? (
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {log.username}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                System
                              </span>
                            )}
                            {log.ip_address && (
                              <span className="flex items-center gap-1">
                                <Globe size={12} />
                                {log.ip_address}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTimeAgo(log.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-dark-500 hidden sm:block">
                          {formatDateTime(log.created_at)}
                        </span>
                        {(log.old_value || log.new_value) && (
                          isExpanded ? (
                            <ChevronUp size={16} className="text-dark-400" />
                          ) : (
                            <ChevronDown size={16} className="text-dark-400" />
                          )
                        )}
                      </div>
                    </div>
                    {isExpanded && (log.old_value || log.new_value) && (
                      <div className="px-4 pb-4 ml-14">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {log.old_value && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                              <p className="text-xs text-red-400 font-medium mb-2">Before</p>
                              <pre className="text-xs text-dark-300 font-mono overflow-x-auto">
                                {JSON.stringify(log.old_value, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.new_value && (
                            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                              <p className="text-xs text-green-400 font-medium mb-2">After</p>
                              <pre className="text-xs text-dark-300 font-mono overflow-x-auto">
                                {JSON.stringify(log.new_value, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-dark-800">
          <div className="text-sm text-dark-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-1 bg-dark-800 border border-dark-700 rounded text-white text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
