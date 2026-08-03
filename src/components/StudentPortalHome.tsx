import React from 'react';
import { User, Student, Enquiry, Appointment } from '../types';
import { Calendar, MessageSquareText, ShieldCheck, Video, ArrowRight, BookOpen } from 'lucide-react';

interface StudentPortalHomeProps {
  currentUser: User;
  students: Student[];
  enquiries: Enquiry[];
  appointments: Appointment[];
  onNavigateTab: (tab: string) => void;
}

export const StudentPortalHome: React.FC<StudentPortalHomeProps> = ({
  currentUser,
  students,
  enquiries,
  appointments,
  onNavigateTab
}) => {
  const activeStudent = students.find((s) => s.email === currentUser.email) || students[0];

  const studentEnquiries = enquiries.filter((e) => e.studentEmail === currentUser.email);
  const studentAppointments = appointments.filter((a) => a.studentEmail === currentUser.email);

  const upcomingAppointment = studentAppointments.find((a) => a.status === 'scheduled');

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-700/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={activeStudent.avatar}
              alt={activeStudent.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Welcome back, {activeStudent.name}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SSO Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                {activeStudent.major} • {activeStudent.year} • ID: {activeStudent.id}
              </p>
              <p className="text-xs text-indigo-300/80 mt-1">
                Advisor: <strong>{activeStudent.advisor.name}</strong> ({activeStudent.advisor.department})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateTab('appointments')}
          className="p-4 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 text-left transition-all group shadow-xs cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-900 dark:text-white text-xs">Book Appointment</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Meet with your advisor</div>
        </button>

        <button
          onClick={() => onNavigateTab('enquiries')}
          className="p-4 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 text-left transition-all group shadow-xs cursor-pointer"
        >
          <MessageSquareText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-900 dark:text-white text-xs">Submit Enquiry</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Course & fee support</div>
        </button>

        <button
          onClick={() => onNavigateTab('students')}
          className="p-4 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 text-left transition-all group shadow-xs cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-slate-900 dark:text-white text-xs">My Records</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Transcripts & files</div>
        </button>
      </div>

      {/* Main Content Area: Upcoming Appointment & Active Enquiries */}
      <div className="space-y-6">
        
        {/* Upcoming Appointment Alert */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Next Upcoming Advisory Meeting
            </h2>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingAppointment ? (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {upcomingAppointment.type}
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold mt-0.5">
                  Advisor: {upcomingAppointment.advisorName} ({upcomingAppointment.department})
                </div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                  <span>📅 {upcomingAppointment.date} at {upcomingAppointment.time}</span>
                  <span>📍 {upcomingAppointment.location}</span>
                </div>
              </div>

              {upcomingAppointment.meetingUrl && (
                <a
                  href={upcomingAppointment.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" /> Join Virtual Meeting
                </a>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
              No upcoming appointments scheduled.
            </div>
          )}
        </div>

        {/* Active Enquiries Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-indigo-600" /> Active Enquiries Tracker
            </h2>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Go to Helpdesk <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {studentEnquiries.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No active enquiries filed.</div>
            ) : (
              studentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{enq.id}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{enq.subject}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Category: {enq.category} • Last updated: {enq.updatedAt}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 uppercase">
                    {enq.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
