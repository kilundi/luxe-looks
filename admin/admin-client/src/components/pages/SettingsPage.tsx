import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Upload, Database, Bell, Shield, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

/**
 * Settings Page - Admin panel configuration
 * TODO: Implement full settings management with API integration
 */
export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('general');
  const [isSaving, setIsSaving] = React.useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement settings save
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved! (Not implemented yet)');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Settings</h1>
          <p className="text-dark-400 mt-1">Configure your admin panel</p>
        </div>
        <Button leftIcon={<Save size={18} />} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500/10 text-primary-500'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Luxe Looks"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="hello@luxelooks.co.ke"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+254 700 000 000"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Logo
                    </label>
                    <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-dark-500 mb-3" />
                      <p className="text-sm text-dark-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-dark-500 mt-1">SVG, PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Favicon
                    </label>
                    <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-dark-500 mb-3" />
                      <p className="text-sm text-dark-400">Click to upload icon</p>
                      <p className="text-xs text-dark-500 mt-1">ICO, PNG up to 1MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+254 700 000 000"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-400">
                    Email notification settings will be available once email service is configured.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      JWT Secret
                    </label>
                    <input
                      type="password"
                      defaultValue="luxe-looks-secret-key-change-in-production"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                    <p className="text-xs text-dark-500 mt-2">
                      Change this in production for better security.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="1440"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limiting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Max Requests per Hour
                    </label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full px-4 py-2 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'backup' && (
            <motion.div
              key="backup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Database Backup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-dark-400">
                    Create and restore database backups.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button leftIcon={<Database size={18} />}>Download Backup</Button>
                    <Button variant="secondary" leftIcon={<Upload size={18} />}>
                      Restore Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-dark-300">Database Size</span>
                      <span className="text-white font-mono">24.5 MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark-300">Storage Used</span>
                      <span className="text-white font-mono">156 MB / 1 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark-300">Active Sessions</span>
                      <span className="text-white font-mono">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-dark-300">Server Uptime</span>
                      <span className="text-white font-mono">3 days, 7 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" leftIcon={<SettingsIcon size={18} />}>
                    Clear Cache
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings - Under Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-dark-400">
              The full settings system is being implemented and will include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>Save settings to database with real-time updates</li>
              <li>Logo and favicon upload with preview</li>
              <li>Email configuration (SMTP settings)</li>
              <li>API rate limiting configuration</li>
              <li>Automatic database backups (daily)</li>
              <li>Activity log viewer with export</li>
              <li>Multi-admin user management (roles & permissions)</li>
              <li>Session management (view and revoke sessions)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
