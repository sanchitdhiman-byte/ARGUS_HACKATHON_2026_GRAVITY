import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../Core/shared/GlobalHeader';
import GlobalFooter from '../../Core/shared/GlobalFooter';
import { notificationsAPI } from '../../../services/api';

const NotificationsPage = ({ onNavigate, isLoggedIn, onLogout, user }) => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsAPI.list();
        const mapped = res.data.map(n => ({
          id: n.id,
          type: mapNotificationType(n.notification_type),
          title: n.title,
          message: n.message,
          time: formatRelativeTime(n.created_at),
          read: n.is_read,
        }));
        setNotifications(mapped);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const mapNotificationType = (backendType) => {
    if (!backendType) return 'info';
    const t = backendType.toLowerCase();
    if (t.includes('approved') || t.includes('award') || t.includes('success')) return 'success';
    if (t.includes('reject') || t.includes('compliance_due') || t.includes('flag') || t.includes('warning')) return 'alert';
    if (t.includes('disburs') || t.includes('payment') || t.includes('tranche')) return 'update';
    return 'info';
  };

  const formatRelativeTime = (isoDate) => {
    if (!isoDate) return '';
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoDate).toLocaleDateString('en-IN');
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconAndColor = (type) => {
    switch (type) {
      case 'alert': return { icon: 'warning', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' };
      case 'success': return { icon: 'check_circle', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' };
      case 'info': return { icon: 'info', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' };
      case 'update': return { icon: 'autorenew', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' };
      default: return { icon: 'notifications', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20' };
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      // silent fail
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => notificationsAPI.markRead(n.id)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      // silent fail
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark font-display flex flex-col selection:bg-primary/30">
      <GlobalHeader currentView="notifications" onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2 flex items-center gap-4">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-primary text-slate-900 text-sm font-black px-3 py-1 rounded-full">{unreadCount}</span>
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Stay updated on your application status and compliance requirements.</p>
          </div>

          <div className="flex gap-2">
             <button
               onClick={() => setFilter('All')}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'All' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             >
               All
             </button>
             <button
               onClick={() => setFilter('Unread')}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'Unread' ? 'bg-primary text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             >
               Unread
             </button>
             {unreadCount > 0 && (
               <button
                 onClick={markAllAsRead}
                 className="px-4 py-2 ml-4 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
               >
                 <span className="material-symbols-outlined !text-lg">done_all</span>
                 Mark all read
               </button>
             )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="animate-spin material-symbols-outlined !text-4xl text-primary">progress_activity</span>
          </div>
        ) : (
        <div className="space-y-4">
          {filteredNotifs.length > 0 ? filteredNotifs.map(notif => {
            const { icon, color } = getIconAndColor(notif.type);

            return (
              <div
                key={notif.id}
                className={`relative p-6 rounded-3xl border ${notif.read ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'bg-primary/5 dark:bg-primary/10 border-primary/30'} shadow-sm transition-all flex gap-6 group hover:border-primary/50`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                 {!notif.read && (
                   <span className="absolute top-6 left-6 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(252,211,77,0.8)]"></span>
                 )}
                 <div className={`p-4 rounded-2xl shrink-0 ${color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined !text-2xl">{icon}</span>
                 </div>

                 <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                       <h3 className={`text-lg transition-colors ${notif.read ? 'font-bold text-slate-700 dark:text-slate-300' : 'font-black text-slate-900 dark:text-white group-hover:text-primary'} cursor-pointer`}>
                         {notif.title}
                       </h3>
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className={`text-sm ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'} leading-relaxed`}>
                      {notif.message}
                    </p>

                    {notif.type === 'alert' && (
                       <button
                         onClick={(e) => { e.stopPropagation(); onNavigate('compliance'); }}
                         className="mt-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2 w-fit"
                       >
                         Go to Compliance Center
                         <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                       </button>
                    )}
                 </div>
              </div>
            );
          }) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-16 text-center text-slate-500">
               <span className="material-symbols-outlined !text-6xl text-slate-300 dark:text-slate-700 mb-6 block">notifications_paused</span>
               <p className="font-black text-slate-900 dark:text-white text-xl mb-2">All Caught Up!</p>
               <p>You have no new notifications.</p>
            </div>
          )}
        </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
};

export default NotificationsPage;
