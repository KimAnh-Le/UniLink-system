import React from 'react';
import { Student, Enquiry, Appointment, User } from '../types';
import {
  UserCheck,
  MessageSquareText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  HeartHandshake,
  GraduationCap,
  FileSpreadsheet,
  Plus,
  Video
} from 'lucide-react';

interface SSODashboardProps {
  students: Student[];
  enquiries: Enquiry[];
  appointments: Appointment[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onSelectEnquiry?: (enquiryId: string) => void;
  onSelectAppointment?: (apptId: string) => void;
}

export const SSODashboard: React.FC<SSODashboardProps> = ({
  students,
  enquiries,
  appointments,
  currentUser,
  onNavigateTab,
  onSelectEnquiry,
  onSelectAppointment
}) => {
  // Support Officer specific filters
  const myAssignedEnquiries = enquiries.filter(
    (e) =>
      (e.status === 'open' || e.status === 'in_progress') &&
      (e.assignedStaff?.toLowerCase().includes('officer') ||
        e.assignedStaff?.toLowerCase().includes('support') ||
        e.assignedStaff?.toLowerCase().includes('services') ||
        e.assignedTo?.toLowerCase().includes('officer') ||
        !e.assignedStaff)
  );

  const urgentSupportCases = enquiries.filter(
    (e) => (e.priority === 'urgent' || e.priority === 'high') && e.status !== 'resolved'
  );

  const myAppointmentsToday = appointments.filter((a) => a.status === 'scheduled');

  const resolvedCount = enquiries.filter((e) => e.status === 'resolved').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
                <UserCheck className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Student Support Officer (SSO) Portal</h1>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Welcome back, {currentUser.name} • {currentUser.title || 'Student Support Specialist'} ({currentUser.ssoProvider})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-medium">
              Duty Shift: Morning Consultation
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              SSO Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Assigned Support Cases</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {myAssignedEnquiries.length} Active Tickets
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Direct student enquiries
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
            <div className="text-xs text-slate-500 font-medium">Consultations Scheduled</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {myAppointmentsToday.length} Sessions
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Virtual & In-person advising
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">High Priority Flags</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {urgentSupportCases.length} Critical
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
              Requires response within 2 hrs
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
              SLA 98%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Resolved Cases</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {resolvedCount} Closed
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              Avg student rating: <strong>4.9/5</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            SSO Officer Quick Workspace
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Consultation Slot</span>
          </button>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Support Enquiries Queue</span>
          </button>
          <button
            onClick={() => onNavigateTab('students')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Search Student Directory</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Today's Consultation Schedule + Assigned Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Advising Schedule */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Today's Scheduled Consultations ({myAppointmentsToday.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {myAppointmentsToday.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No consultations scheduled for today.
              </div>
            ) : (
              myAppointmentsToday.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => {
                    if (onSelectAppointment) onSelectAppointment(appt.id);
                    onNavigateTab('appointments');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {appt.scheduledTime || appt.time || '09:30 AM'}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                        {appt.fullName || appt.studentName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {appt.category || appt.type || 'Academic Advising Session'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Advisor: {appt.advisorName || appt.assignedStaff || 'Support Officer'} • {appt.location || 'Virtual Office'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (appt.meetingUrl) window.open(appt.meetingUrl, '_blank');
                      else {
                        if (onSelectAppointment) onSelectAppointment(appt.id);
                        onNavigateTab('appointments');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Support Tickets Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Support Enquiries Queue ({myAssignedEnquiries.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Enquiry Manager</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {myAssignedEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                All assigned support enquiries have been resolved!
              </div>
            ) : (
              myAssignedEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => {
                    if (onSelectEnquiry) onSelectEnquiry(enq.id);
                    onNavigateTab('enquiries');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {enq.id}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {enq.fullName || enq.studentName}
                      </span>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      enq.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : enq.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {enq.priority || 'medium'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                    {enq.subject}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Category: {enq.category}</span>
                    <span>Received: {enq.createdAt || 'Today'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Support Categories Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Student Support Area Distribution
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>Academic Support</span>
            </div>
            <p className="text-[11px] text-slate-500">Course enrollment, GPA guidance & probation recovery</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Financial Services</span>
            </div>
            <p className="text-[11px] text-slate-500">Tuition fees, scholarship verification & payment holds</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>Student Care</span>
            </div>
            <p className="text-[11px] text-slate-500">Counseling, campus welfare & special accommodations</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
              <span>Graduation & Records</span>
            </div>
            <p className="text-[11px] text-slate-500">Transcript validation, degree audit & diploma release</p>
          </div>
        </div>
      </div>

    </div>
  );
};
