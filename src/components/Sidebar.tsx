import React from 'react';
import { User } from '../types';
import { Users, MessageSquareText, Calendar, LayoutDashboard, ShieldCheck, Sparkles, GraduationCap, MessageSquareHeart, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onOpenSSO: () => void;
  onLogOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenSSO,
  onLogOut
}) => {
  const getNavItems = () => {
    if (currentUser.role === 'student') {
      return [
        { id: 'home', label: 'Dashboard', icon: Sparkles },
        { id: 'students', label: 'Profile', icon: Users },
        { id: 'enquiries', label: 'My Enquiries', icon: MessageSquareText },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart }
      ];
    }

    if (currentUser.role === 'admin') {
      // Administrative Officer
      return [
        { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students Directory', icon: Users },
        { id: 'enquiries', label: 'Enquiries & Triage', icon: MessageSquareText },
        { id: 'appointments', label: 'Appointments Schedule', icon: Calendar },
        { id: 'feedback', label: 'Feedback Hub', icon: MessageSquareHeart }
      ];
    }

    if (currentUser.role === 'officer') {
      // Student Support Officer
      return [
        { id: 'sso-dashboard', label: 'SSO Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students Directory', icon: Users },
        { id: 'enquiries', label: 'Support Enquiries', icon: MessageSquareText },
        { id: 'appointments', label: 'Advising Appointments', icon: Calendar },
        { id: 'feedback', label: 'Feedback Hub', icon: MessageSquareHeart }
      ];
    }

    // Manager
    return [
      { id: 'manager-dashboard', label: 'Executive Reports & Diagrams', icon: LayoutDashboard },
      { id: 'feedback', label: 'Student Feedback Reports', icon: MessageSquareHeart }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      {/* Sidebar Top / Brand Title */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => {
            if (currentUser.role === 'admin') setActiveTab('admin-dashboard');
            else if (currentUser.role === 'officer') setActiveTab('sso-dashboard');
            else if (currentUser.role === 'manager') setActiveTab('manager-dashboard');
            else if (currentUser.role === 'student') setActiveTab('home');
            else setActiveTab('students');
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              UniLink System
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Student & Staff Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Options */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* SSO User Account Pill at bottom of Sidebar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <button
          onClick={onOpenSSO}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
          title="Switch Account / SSO Settings"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-slate-600"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
              {currentUser.name}
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              {currentUser.role} • SSO
            </div>
          </div>
        </button>

        {onLogOut && (
          <button
            onClick={onLogOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        )}
      </div>
    </aside>
  );
};

