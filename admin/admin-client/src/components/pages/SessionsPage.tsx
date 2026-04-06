import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Shield,
  Clock,
  Globe,
  Info,
} from 'lucide-react';
import { sessionService } from '@/services/api';
import type { Session } from '@/services/api';
import toast from 'react-hot-toast';

const parseUserAgent = (ua: string): { device: string; icon: React.ElementType; os: string } => {
  if (!ua || ua === 'unknown') return { device: 'Unknown Device', icon: Monitor, os: 'Unknown OS' };

  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);

  let icon = Monitor;
  let device = 'Desktop';
  if (isTablet) { icon = Tablet; device = 'Tablet'; }
  else if (isMobile) { icon = Smartphone; device = 'Mobile'; }

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone')) os = 'iOS';
  else if (ua.includes('iPad')) os = 'iPadOS';

  // Extract browser info
  if (ua.includes('Chrome') && !ua.includes('Edg')) device += ' (Chrome)';
  else if (ua.includes('Firefox')) device += ' (Firefox)';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) device += ' (Safari)';
  else if (ua.includes('Edg')) device += ' (Edge)';

  return { device, icon, os };
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

export const SessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await sessionService.getAll();
      setSessions(data.sessions);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (tokenId: string) => {
    const currentSession = sessions.find((s) => s.id === tokenId)?.isCurrent;
    try {
      setRevoking(tokenId);
      await sessionService.revoke(tokenId);
      toast.success(currentSession ? 'Current session revoked' : 'Session revoked');
      setSessions((prev) => prev.filter((s) => s.id !== tokenId));
      if (currentSession) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    } catch {
      toast.error('Failed to revoke session');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    try {
      const data = await sessionService.revokeAllOthers();
      toast.success(`${data.revoked} session(s) revoked`);
      loadSessions();
    } catch {
      toast.error('Failed to revoke other sessions');
    }
  };

  const currentSession = sessions.find((s) => s.isCurrent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Active Sessions</h1>
          <p className="text-dark-400 mt-1">Manage your login sessions across devices</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAllOthers}
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 hover:bg-dark-700 hover:text-red-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Shield size={16} />
            Revoke All Others
          </button>
        )}
      </div>

      {/* Current Session Banner */}
      {currentSession && (
        <div className="bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Shield size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">You are here</p>
              <p className="text-xs text-dark-400">
                {parseUserAgent(currentSession.user_agent).device}{' '}
                {formatTimeAgo(currentSession.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 bg-dark-900/50 rounded-xl border border-dark-800">
          <Info size={40} className="mx-auto text-dark-600 mb-4" />
          <p className="text-dark-400">No active sessions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions
            .sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0))
            .map((session) => {
              const { device, icon: DeviceIcon, os } = parseUserAgent(session.user_agent);
              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all ${
                    session.isCurrent
                      ? 'bg-dark-800/80 border-primary-500/30'
                      : 'bg-dark-900 border-dark-800 hover:border-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.isCurrent
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'bg-dark-800 text-dark-400'
                        }`}
                      >
                        <DeviceIcon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{device}</p>
                          {session.isCurrent && (
                            <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-dark-500">
                          <span className="flex items-center gap-1">
                            <Globe size={12} />
                            {session.ip_address || 'Unknown IP'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeAgo(session.created_at)}
                          </span>
                          <span>{os}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.isCurrent && sessions.length > 1 && (
                        <span className="text-xs text-dark-500">Expires {new Date(session.expires_at).toLocaleDateString()}</span>
                      )}
                      <button
                        onClick={() => handleRevoke(session.id)}
                        disabled={revoking === session.id}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          revoking === session.id
                            ? 'bg-dark-800 text-dark-600 cursor-not-allowed'
                            : 'bg-dark-800 hover:bg-red-500/20 text-dark-400 hover:text-red-400'
                        }`}
                      >
                        <LogOut size={14} />
                        {revoking === session.id ? 'Revoking...' : 'Revoke'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
