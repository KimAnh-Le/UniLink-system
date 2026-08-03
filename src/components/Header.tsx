import React from 'react';
import { User, Notification } from '../types';
import { ShieldCheck, Bell, UserCheck, GraduationCap, MessageSquareText, Calendar, LayoutDashboard, Users, Search, Sparkles, MessageSquareHeart, LogOut, BarChart3 } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onOpenSSO: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  onOpenNotifications: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenSSO,
  activeTab,
  setActiveTab,
  notifications,
  onOpenNotifications,
  searchQuery,
  setSearchQuery,
  onLogOut
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer md:hidden" onClick={() => setActiveTab('students')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">UniLink System</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Student & Staff Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            {currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'home'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dashboard
              </button>
            )}

            {currentUser.role !== 'manager' && (
              <>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'students'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  {currentUser.role === 'student' ? 'Profile' : 'Student Directory'}
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'enquiries'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  Enquiries
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'appointments'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Appointments
                </button>
              </>
            )}

            {currentUser.role === 'manager' ? (
              <>
                <button
                  onClick={() => setActiveTab('manager-dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'manager-dashboard'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Reports & Diagrams
                </button>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'feedback'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  Student Feedback
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'feedback'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquareHeart className="w-3.5 h-3.5" />
                Feedback
              </button>
            )}
          </nav>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center relative w-44 xl:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student, ID, enquiry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Right Action Tools & SSO Account Card */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* SSO / Identity Pill */}
            <button
              onClick={onOpenSSO}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left group cursor-pointer"
              title="Switch user or view SSO claims"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
              />
              <div className="hidden sm:block leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {currentUser.name}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400">• SSO</span>
                </div>
              </div>
              <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors ml-1" />
            </button>

            {/* Explicit Log Out button */}
            {onLogOut && (
              <button
                onClick={onLogOut}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Log Out</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {currentUser.role === 'student' && (
            <button
              onClick={() => setActiveTab('home')}
              className={`py-1 px-2 rounded-md ${activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600'}`}
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setActiveTab('students')}
            className={`py-1 px-2 rounded-md ${activeTab === 'students' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600'}`}
          >
            {currentUser.role === 'student' ? 'Profile' : 'Students'}
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-1 px-2 rounded-md ${activeTab === 'enquiries' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600'}`}
          >
            Enquiries
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-1 px-2 rounded-md ${activeTab === 'appointments' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600'}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-1 px-2 rounded-md ${activeTab === 'feedback' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600'}`}
          >
            Feedback
          </button>
          {currentUser.role === 'manager' && (
            <button
              onClick={() => setActiveTab('manager-dashboard')}
              className={`py-1 px-2 rounded-md ${activeTab === 'manager-dashboard' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-600'}`}
            >
              Analytics
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

