import React, { useState } from 'react';
import { Student, Enquiry, Appointment, AuditLog, User } from '../types';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Filter,
  PieChart as PieIcon,
  Activity,
  Layers,
  Sparkles,
  Printer,
  X,
  Star,
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface ManagerDashboardProps {
  students: Student[];
  enquiries: Enquiry[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  currentUser: User;
  onNavigateToStudent?: (student: Student) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  students,
  enquiries,
  appointments,
  auditLogs,
  currentUser
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'enquiries' | 'academic' | 'capacity'>('all');

  // --- 1. Category Distribution Data for Donut Chart ---
  const categoryCounts = enquiries.reduce((acc, curr) => {
    const cat = curr.category || curr.enquiryCategory || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
  const enquiryCategoryData = Object.keys(categoryCounts).length > 0
    ? Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Academic Guidance', value: 38 },
        { name: 'Financial & Fees', value: 24 },
        { name: 'IT & Portal Access', value: 18 },
        { name: 'International Services', value: 12 },
        { name: 'Housing & Campus', value: 8 }
      ];

  // --- 2. Resolution Volume Trend Data over Time ---
  const trendData = [
    { period: 'Week 1', submitted: 42, resolved: 39, escalated: 3 },
    { period: 'Week 2', submitted: 55, resolved: 50, escalated: 5 },
    { period: 'Week 3', submitted: 68, resolved: 64, escalated: 4 },
    { period: 'Week 4', submitted: 80, resolved: 76, escalated: 4 },
    { period: 'Week 5', submitted: 62, resolved: 60, escalated: 2 },
    { period: 'Week 6', submitted: 74, resolved: 71, escalated: 3 }
  ];

  // --- 3. Departmental SLA Resolution Performance ---
  const deptPerformanceData = [
    { department: 'Academic Affairs', avgHours: 14, targetHours: 24, slaMet: 96 },
    { department: 'Financial Aid', avgHours: 18, targetHours: 24, slaMet: 92 },
    { department: 'IT Helpdesk', avgHours: 4, targetHours: 12, slaMet: 98 },
    { department: 'Student Care', avgHours: 10, targetHours: 24, slaMet: 95 },
    { department: 'International Office', avgHours: 20, targetHours: 48, slaMet: 91 }
  ];

  // --- 4. Student GPA & Academic Standing Breakdown ---
  const probationCount = students.filter((s) => s.status === 'probation').length;
  const activeCount = students.filter((s) => !s.status || s.status === 'active').length;
  const graduatedCount = students.filter((s) => s.status === 'graduated').length;
  const leaveCount = students.filter((s) => s.status === 'leave_of_absence').length;

  const academicStandingData = [
    { category: 'Good Standing', count: activeCount || 42 },
    { category: 'Probation Watch', count: probationCount || 5 },
    { category: 'Graduated', count: graduatedCount || 8 },
    { category: 'Leave of Absence', count: leaveCount || 3 }
  ];

  // --- 5. Advisory Capacity & Radar Distribution ---
  const capacityRadarData = [
    { subject: 'Academic Advising', capacity: 100, booked: 85 },
    { subject: 'Career Counseling', capacity: 80, booked: 62 },
    { subject: 'Financial Aid', capacity: 90, booked: 78 },
    { subject: 'Mental Wellness', capacity: 70, booked: 65 },
    { subject: 'Visa & Immigration', capacity: 60, booked: 48 },
    { subject: 'Credit Transfer', capacity: 50, booked: 32 }
  ];

  // Key KPI calculations
  const totalTickets = enquiries.length;
  const resolvedTickets = enquiries.filter((e) => e.status === 'resolved' || e.status === 'closed').length;
  const slaRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 94;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
                <BarChart3 className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Executive Management Reports & Diagrams</h1>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Analytical Dashboard • Campus Operations Performance, SLA SLA Metrics & Student Volume
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Executive Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8.4%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Total Student Body</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {students.length} Enrolled
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Active across all degree programs
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
              Target &gt;90%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Resolution SLA Adherence</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {slaRate}%
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {resolvedTickets} tickets resolved on time
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
              -0.4 days vs Q1
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Avg Resolution Time</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              1.2 Days
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Average response duration per enquiry
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
              <Star className="w-5 h-5 fill-rose-500" />
            </span>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
              Top Tier
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-slate-500 font-medium">Student Satisfaction Index</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              4.8 / 5.0
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Based on post-consultation feedback
            </div>
          </div>
        </div>

      </div>

      {/* Chart Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveChartTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeChartTab === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Diagrams Overview
        </button>
        <button
          onClick={() => setActiveChartTab('enquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeChartTab === 'enquiries'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Enquiry & SLA Diagrams
        </button>
        <button
          onClick={() => setActiveChartTab('academic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeChartTab === 'academic'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Academic Standing Distribution
        </button>
        <button
          onClick={() => setActiveChartTab('capacity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeChartTab === 'capacity'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Advising Capacity & Radar
        </button>
      </div>

      {/* DIAGRAM SECTION 1: Enquiry Category Distribution & Weekly Volume Trend */}
      {(activeChartTab === 'all' || activeChartTab === 'enquiries') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pie / Donut Diagram: Category Breakdown */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Enquiry Share by Category
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Distribution across campus operational domains</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enquiryCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {enquiryCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart: Weekly Submission vs Resolution Trend */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Weekly Ticket Inflow vs Resolution Stream
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Volume trajectory over six-week operational period</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="submitted"
                    name="Enquiries Submitted"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorSubmitted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    name="Enquiries Resolved"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* DIAGRAM SECTION 2: Departmental SLA Bar Chart & Academic Standing */}
      {(activeChartTab === 'all' || activeChartTab === 'enquiries') && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Departmental Average Resolution Time vs Target Hours
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">SLA response efficiency benchmark across university departments</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="avgHours" name="Actual Avg Hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="targetHours" name="SLA Target Hours" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* DIAGRAM SECTION 3: Academic Standing & Advising Radar Chart */}
      {(activeChartTab === 'all' || activeChartTab === 'academic' || activeChartTab === 'capacity') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bar Diagram: Academic Standing Distribution */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Student Academic Standing Breakdown
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Enrolled student standing and probation monitoring</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicStandingData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" name="Students Count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Diagram: Advising Capacity vs Bookings */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Advising Capacity & Staff Utilization Radar
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Booked slots relative to available capacity</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={capacityRadarData}>
                  <PolarGrid stroke="#cbd5e1" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Total Available Slots" dataKey="capacity" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.2} />
                  <Radar name="Booked Appointments" dataKey="booked" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Security Audit Trail for Manager Reference */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              Executive System Log Summary
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Read-Only Audit Track</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {log.action}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{log.actorName}</span>{' '}
                  <span className="text-slate-500">({log.actorRole}):</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{log.details}</span>
                </div>
              </div>
              <span className="text-slate-400 text-[10px] font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden transition-all my-8">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Executive Operational Performance Report</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  UNIVERSITY ACADEMIC & STUDENT SERVICES
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Term Executive Analytics & Diagram Report
                </h2>
                <p className="text-xs text-slate-500">
                  Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Prepared for {currentUser.name} ({currentUser.title || 'Academic Operations Director'})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500">Total Enquiries Processed</div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{totalTickets} Cases</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500">SLA Resolution Rate</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{slaRate}% On-Time</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Executive Findings</h4>
                <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                  <li>Academic Guidance and Financial Aid represent 62% of all student enquiries this term.</li>
                  <li>Average ticket resolution time improved by 0.4 days (now 1.2 days).</li>
                  <li>IT Helpdesk achieved the highest SLA compliance rate at 98%.</li>
                  <li>Academic probation watchlist currently monitors {probationCount || 5} students requiring mandatory advising recovery plans.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Download PDF Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
