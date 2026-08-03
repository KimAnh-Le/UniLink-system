import React from 'react';
import { Student, Enquiry, Appointment, AuditLog, User } from '../types';
import {
  ShieldCheck,
  Users,
  MessageSquareText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  UserPlus,
  FileText,
  Filter,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  enquiries: Enquiry[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onSelectStudent?: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  enquiries,
  appointments,
  auditLogs,
  currentUser,
  onNavigateTab,
  onSelectStudent
}) => {
  const openEnquiries = enquiries.filter((e) => e.status === 'open' || e.status === 'in_progress');
  const urgentEnquiries = enquiries.filter((e) => (e.priority === 'urgent' || e.priority === 'high') && e.status !== 'resolved');
  const probationStudents = students.filter((s) => s.status === 'probation');
  const scheduledApptsToday = appointments.filter((a) => a.status === 'scheduled');

  // Category breakdown stats
  const departmentVolume = enquiries.reduce((acc, curr) => {
    const dept = curr.assignedStaff || curr.category || 'General Administration';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Administrative Operations Dashboard</h1>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Welcome back, {currentUser.name} • {currentUser.title || 'Administrative Officer'} ({currentUser.ssoProvider})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-medium">
              Academic Term: Spring 2026
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Admin Status: Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Student Directory</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {students.length} Records
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              {probationStudents.length} students on probation watch
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Pending Triage Queue</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {openEnquiries.length} Open Tickets
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
              {urgentEnquiries.length} high priority / urgent cases
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Scheduled Consultations</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {scheduledApptsToday.length} Active Slots
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              100% staff coverage today
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
              Audit
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">System Activity Stream</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {auditLogs.length} Events
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              Logged in real-time via SSO
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Buttons for Admin */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Admin Quick Control Center
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Triage Enquiries</span>
          </button>
          <button
            onClick={() => onNavigateTab('students')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Search Student Records</span>
          </button>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Manage Master Schedule</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Urgent Triage Queue + Academic Standing Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Urgent Enquiries for Administrative Action */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Urgent Enquiries & Action Required ({urgentEnquiries.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {urgentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No urgent administrative enquiries pending triage. All clear!
              </div>
            ) : (
              urgentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => onNavigateTab('enquiries')}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {enq.id}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        enq.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {enq.priority}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                        {enq.fullName || enq.studentName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium">
                      {enq.subject}
                    </p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>Assigned: {enq.assignedStaff || 'Unassigned'}</span>
                      <span>•</span>
                      <span>Category: {enq.category}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold shrink-0">
                    Process
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Standing & Probation Watchlist */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Students Requiring Administrative Attention ({probationStudents.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Student Directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {students.slice(0, 5).map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  if (onSelectStudent) onSelectStudent(s);
                  onNavigateTab('students');
                }}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                    {(s.fullName || s.name || 'S').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {s.fullName || s.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {s.id} • {s.major}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                    s.status === 'probation'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {s.status ? s.status.replace('_', ' ') : 'active'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                    GPA {s.gpa || '3.2'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* System Audit Feed Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Real-time Administrative Audit Logs
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            System Monitoring Active
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white mr-2">
                    {log.actorName} ({log.actorRole.toUpperCase()})
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {log.details}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
