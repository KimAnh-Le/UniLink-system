import React, { useState } from 'react';
import { Appointment, AppointmentType, AppointmentStatus, User, Student, Enquiry } from '../types';
import { Search, Plus, Edit3, Trash2, Save, ArrowLeft, Calendar, Clock, Paperclip, Upload, Video, MapPin, CheckCircle2, XCircle, Lock, FileText, ChevronLeft, ChevronRight, Globe, ChevronDown, Filter, User as UserIcon, RefreshCw, Check, X, List, LayoutGrid, ExternalLink, Eye, Download, FileCheck } from 'lucide-react';

interface AppointmentSchedulerProps {
  appointments: Appointment[];
  currentUser: User;
  students: Student[];
  enquiries?: Enquiry[];
  onUpdateAppointment: (updated: Appointment) => void;
  onCreateAppointment: (newAppt: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
  initialSelectedAppointmentId?: string | null;
}

const TIME_SLOTS_30_MIN = [
  '08:00 AM - 08:30 AM',
  '08:30 AM - 09:00 AM',
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM'
];

const formatTimeRange = (timeStr: string, durationMins: number = 30) => {
  return formatDynamicTimeRange(timeStr, durationMins);
};

const formatDynamicTimeRange = (timeStr: string, durationMins: number = 30) => {
  if (!timeStr) return durationMins === 15 ? '09:00 AM - 09:15 AM' : '09:00 AM - 09:30 AM';

  let startTimeStr = timeStr;
  if (timeStr.includes('-')) {
    startTimeStr = timeStr.split('-')[0].trim();
  } else {
    startTimeStr = timeStr.trim();
  }

  const match = startTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return timeStr;

  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  let period = match[3] ? match[3].toUpperCase() : '';

  if (!period) {
    period = hour >= 8 && hour <= 11 ? 'AM' : 'PM';
  }

  let hour24 = hour;
  if (period === 'PM' && hour < 12) hour24 += 12;
  if (period === 'AM' && hour === 12) hour24 = 0;

  let startHour12 = hour24 % 12;
  if (startHour12 === 0) startHour12 = 12;
  const startHourStr = startHour12 < 10 ? `0${startHour12}` : `${startHour12}`;
  const startMinStr = min < 10 ? `0${min}` : `${min}`;
  const startTimeFormatted = `${startHourStr}:${startMinStr} ${period}`;

  const dur = durationMins > 0 ? durationMins : 30;
  const endTotalMins = (hour24 * 60 + min + dur) % 1440;
  const endHour24 = Math.floor(endTotalMins / 60);
  const endMin = endTotalMins % 60;
  const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
  let endHour12 = endHour24 % 12;
  if (endHour12 === 0) endHour12 = 12;

  const endHourStr = endHour12 < 10 ? `0${endHour12}` : `${endHour12}`;
  const endMinStr = endMin < 10 ? `0${endMin}` : `${endMin}`;
  const endTimeFormatted = `${endHourStr}:${endMinStr} ${endPeriod}`;

  return `${startTimeFormatted} - ${endTimeFormatted}`;
};

const getShiftedTime = (rawTime: string, diffHours: number): string => {
  if (diffHours === 0 || !rawTime) return rawTime;
  let startTimeStr = rawTime;
  if (rawTime.includes('-')) {
    startTimeStr = rawTime.split('-')[0].trim();
  }
  const match = startTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return rawTime;

  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  let totalMins = hour * 60 + min + diffHours * 60;
  totalMins = (totalMins % 1440 + 1440) % 1440;

  const newHour24 = Math.floor(totalMins / 60);
  const newMin = totalMins % 60;

  const newPeriod = newHour24 >= 12 ? 'PM' : 'AM';
  let newHour12 = newHour24 % 12;
  if (newHour12 === 0) newHour12 = 12;

  const minStr = newMin < 10 ? `0${newMin}` : `${newMin}`;
  return `${newHour12}:${minStr} ${newPeriod}`;
};

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  appointments,
  currentUser,
  students,
  enquiries = [],
  onUpdateAppointment,
  onCreateAppointment,
  onDeleteAppointment,
  initialSelectedAppointmentId = null
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(initialSelectedAppointmentId ? 'detail' : 'list');
  const [selectedApptId, setSelectedApptId] = useState<string | null>(initialSelectedAppointmentId);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Frame 6 (Appointment Detail)
  const [formData, setFormData] = useState<{
    id: string;
    enquiryId: string;
    category: string;
    appointmentDate: string;
    status: AppointmentStatus;
    assignedStaff: string;
    scheduledDate: string;
    scheduledTime: string;
    attachmentFile?: string;
    notes?: string;
  }>({
    id: '',
    enquiryId: 'ENQ-1001',
    category: 'Academic Advising',
    appointmentDate: new Date().toISOString().split('T')[0],
    status: 'scheduled',
    assignedStaff: 'Dr. Alan Turing',
    scheduledDate: '2026-08-05',
    scheduledTime: '11:00 AM',
    attachmentFile: 'Advising_Session_Form.pdf',
    notes: 'Consultation for course overload request.'
  });

  const activeAppt = appointments.find((a) => a.id === selectedApptId);

  const realTodayObj = new Date();
  const realTodayIso = `${realTodayObj.getFullYear()}-${String(realTodayObj.getMonth() + 1).padStart(2, '0')}-${String(realTodayObj.getDate()).padStart(2, '0')}`;

  // Date & Time Picker UI State
  const [pickerMonth, setPickerMonth] = useState<number>(realTodayObj.getMonth());
  const [pickerYear, setPickerYear] = useState<number>(realTodayObj.getFullYear());
  const [slotDuration, setSlotDuration] = useState<15 | 30>(30);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('(UTC+07:00) Bangkok, Hanoi, Jakarta');

  // Appointment Manager View State for Admin / SSO
  const [adminScheduleView, setAdminScheduleView] = useState<'manager' | 'table'>('manager');
  const [isOnlineToday, setIsOnlineToday] = useState<boolean>(true);
  const [bufferTime, setBufferTime] = useState<string>('ALL SLOTS');
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(realTodayIso);
  const [dateFilterMode, setDateFilterMode] = useState<'selected' | 'all'>('selected');
  const [upcomingPage, setUpcomingPage] = useState<number>(1);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setUpcomingPage(1);
  }, [selectedCalendarDate, dateFilterMode, bufferTime, searchQuery, selectedTimezone]);
  const [fileModalData, setFileModalData] = useState<{
    fileName: string;
    studentName?: string;
    studentId?: string;
    appointmentId?: string;
    category?: string;
    notes?: string;
  } | null>(null);

  const parseSingleTimeToMinutes = (s: string): number | null => {
    if (!s) return null;
    const clean = s.trim().toLowerCase();
    const isPm = clean.includes('pm');
    const isAm = clean.includes('am');
    const match = clean.match(/(\d{1,2})[:h\.]?(\d{2})?/);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (isPm && hours < 12) {
      hours += 12;
    } else if (isAm && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  const parseTimeRangeToMinutes = (rangeStr: string): { start: number; end: number } | null => {
    if (!rangeStr) return null;
    const parts = rangeStr.split(/[-–—]|\bto\b/i);
    if (parts.length >= 2) {
      let startStr = parts[0].trim();
      let endStr = parts[1].trim();
      const endHasAm = endStr.toLowerCase().includes('am');
      const endHasPm = endStr.toLowerCase().includes('pm');
      if (!startStr.toLowerCase().includes('am') && !startStr.toLowerCase().includes('pm')) {
        if (endHasAm) startStr += ' AM';
        else if (endHasPm) startStr += ' PM';
      }
      const start = parseSingleTimeToMinutes(startStr);
      const end = parseSingleTimeToMinutes(endStr);
      if (start !== null && end !== null) {
        return { start, end: end > start ? end : start + 30 };
      }
    }
    const single = parseSingleTimeToMinutes(rangeStr);
    if (single !== null) {
      return { start: single, end: single + 30 };
    }
    return null;
  };

  const isSlotBooked = (
    baseSlot: string,
    timeSlot: string,
    scheduledDate: string,
    staffName: string,
    currentApptId: string
  ): boolean => {
    if (!scheduledDate) return false;
    const candidateRange = parseTimeRangeToMinutes(timeSlot) || parseTimeRangeToMinutes(baseSlot);

    return appointments.some((a) => {
      if (a.id === currentApptId) return false;
      if (a.status === 'cancelled') return false;

      const apptDate = a.scheduledDate || a.appointmentDate || a.date;
      if (apptDate !== scheduledDate) return false;

      const apptStaff = a.assignedStaff || a.advisorName || '';
      if (staffName && apptStaff && staffName.toLowerCase() !== apptStaff.toLowerCase()) {
        return false;
      }

      const apptTime = (a.scheduledTime || a.time || '').trim();
      if (!apptTime) return false;

      if (candidateRange) {
        const apptRange = parseTimeRangeToMinutes(apptTime);
        if (apptRange) {
          const overlap = Math.max(candidateRange.start, apptRange.start) < Math.min(candidateRange.end, apptRange.end);
          if (overlap) return true;
        }
      }

      const apptLower = apptTime.toLowerCase();
      const baseLower = baseSlot.toLowerCase();
      const slotLower = timeSlot.toLowerCase();
      const apptStart = apptLower.split('-')[0].trim();

      return (
        apptLower.includes(baseLower) ||
        apptLower.includes(slotLower) ||
        (apptStart && (baseLower.includes(apptStart) || slotLower.includes(apptStart)))
      );
    });
  };

  // Sync picker view when opening an appointment
  React.useEffect(() => {
    if (formData.scheduledDate) {
      const parts = formData.scheduledDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setPickerYear(y);
          setPickerMonth(m);
        }
      }
    }
  }, [formData.scheduledDate]);

  const getFormattedSelectedTitle = () => {
    if (!formData.scheduledDate) return 'August 03';
    const parts = formData.scheduledDate.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
      const dayStr = String(d).padStart(2, '0');
      return `${monthName} ${dayStr}`;
    }
    return 'August 03';
  };

  const getTimezoneOffsetHours = (tzString: string): number => {
    const match = tzString.match(/\(UTC([+-]\d{2}):\d{2}\)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 7; // Default base is UTC+07:00
  };

  const convertSlotToTimezone = (slotStr: string, diffHours: number): string => {
    if (diffHours === 0) return slotStr;
    const match = slotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return slotStr;

    let hour = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    let totalMins = hour * 60 + min + diffHours * 60;
    totalMins = (totalMins % 1440 + 1440) % 1440;

    const newHour24 = Math.floor(totalMins / 60);
    const newMin = totalMins % 60;

    const newPeriod = newHour24 >= 12 ? 'PM' : 'AM';
    let newHour12 = newHour24 % 12;
    if (newHour12 === 0) newHour12 = 12;

    const minStr = newMin < 10 ? `0${newMin}` : `${newMin}`;
    return `${newHour12}:${minStr} ${newPeriod}`;
  };

const STAFF_LIST = [
  'Dr. Alan Turing',
  'Sarah Jenkins',
  'Prof. Grace Hopper',
  'Dr. Michael Scott',
  'Dr. Robert Oppenheimer'
];

const getStaffAvailability = (
  staffName: string = '',
  dateStr: string = '2026-08-03',
  duration: 15 | 30 = 30
) => {
  if (!dateStr) {
    return { isAvailable: false, slots: [], scheduleBadge: 'No date selected' };
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return {
      isAvailable: true,
      slots: duration === 15
        ? ['11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:30 PM']
        : ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'],
      scheduleBadge: ''
    };
  }

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const dateObj = new Date(y, m, d);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

  const nameLower = staffName.toLowerCase();

  // Sarah Jenkins: Working Tue - Sat (2, 3, 4, 5, 6). Off Mon, Sun, or Aug 8
  if (nameLower.includes('sarah') || nameLower.includes('jenkins')) {
    const isAvailable = (dayOfWeek >= 2 && dayOfWeek <= 6) && d !== 8;
    const scheduleBadge = 'Sarah Jenkins • Tue-Sat (9:00 AM - 12:00 PM)';
    const slots15 = ['09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM'];
    const slots30 = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
    const final15 = (dayOfWeek === 3 || dayOfWeek === 5) ? slots15.filter((_, idx) => idx % 2 === 0 || idx > 6) : slots15;
    const final30 = (dayOfWeek === 3 || dayOfWeek === 5) ? slots30.filter((_, idx) => idx !== 2) : slots30;
    return {
      isAvailable,
      slots: duration === 15 ? final15 : final30,
      scheduleBadge
    };
  }

  // Prof. Grace Hopper: Working Mon, Wed, Fri (1, 3, 5). Off Tue, Thu, Sat, Sun
  if (nameLower.includes('grace') || nameLower.includes('hopper')) {
    const isAvailable = (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && d !== 15;
    const scheduleBadge = 'Prof. Grace Hopper • Mon, Wed, Fri (1:00 PM - 4:00 PM)';
    const slots15 = ['1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM'];
    const slots30 = ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'];
    const final15 = (dayOfWeek === 1) ? slots15.slice(0, 7) : slots15;
    const final30 = (dayOfWeek === 1) ? slots30.slice(0, 4) : slots30;
    return {
      isAvailable,
      slots: duration === 15 ? final15 : final30,
      scheduleBadge
    };
  }

  // Dr. Michael Scott: Working Mon - Thu (1, 2, 3, 4). Off Fri, Sat, Sun
  if (nameLower.includes('michael') || nameLower.includes('scott')) {
    const isAvailable = (dayOfWeek >= 1 && dayOfWeek <= 4);
    const scheduleBadge = 'Dr. Michael Scott • Mon-Thu (10:00 AM - 3:00 PM)';
    const slots15 = ['10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM'];
    const slots30 = ['10:00 AM', '10:30 AM', '11:00 AM', '1:30 PM', '2:00 PM', '2:30 PM'];
    return {
      isAvailable,
      slots: duration === 15 ? slots15 : slots30,
      scheduleBadge
    };
  }

  // Dr. Robert Oppenheimer: Working Tue, Thu, Fri (2, 4, 5)
  if (nameLower.includes('robert') || nameLower.includes('oppenheimer')) {
    const isAvailable = (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 5);
    const scheduleBadge = 'Dr. Robert Oppenheimer • Tue, Thu, Fri (11:00 AM - 2:00 PM)';
    const slots15 = ['11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM'];
    const slots30 = ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'];
    return {
      isAvailable,
      slots: duration === 15 ? slots15 : slots30,
      scheduleBadge
    };
  }

  // Dr. Alan Turing / Default: Working Mon - Fri (1, 2, 3, 4, 5). Off Sat, Sun, or Aug 8
  const isAvailable = (dayOfWeek >= 1 && dayOfWeek <= 5) && d !== 8;
  const scheduleBadge = `${staffName || 'Dr. Alan Turing'} • Mon-Fri (11:00 AM - 2:00 PM)`;

  let slots15 = ['11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:30 PM'];
  let slots30 = ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'];

  if (dayOfWeek === 3) {
    // Wednesday mid-day booked
    slots15 = ['11:00 AM', '11:15 AM', '11:30 AM', '1:00 PM', '1:15 PM', '1:30 PM'];
    slots30 = ['11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM'];
  } else if (dayOfWeek === 5) {
    // Friday afternoon shift
    slots15 = ['11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM'];
    slots30 = ['11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'];
  }

  return {
    isAvailable,
    slots: duration === 15 ? slots15 : slots30,
    scheduleBadge
  };
};

  const renderCalendarMonthGrid = () => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const firstDayObj = new Date(pickerYear, pickerMonth, 1);
    // Monday = 0, Sunday = 6
    const startDayIndex = (firstDayObj.getDay() + 6) % 7;

    const cells = [];
    // Padding before day 1
    for (let i = 0; i < startDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    const parts = (formData.scheduledDate || '2026-08-03').split('-');
    const selYear = parseInt(parts[0], 10);
    const selMonth = parseInt(parts[1], 10) - 1;
    const selDay = parseInt(parts[2], 10);

    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = (selYear === pickerYear && selMonth === pickerMonth && selDay === d);
      const dateString = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const staffAvail = getStaffAvailability(formData.assignedStaff, dateString, slotDuration);
      const isAvailable = staffAvail.isAvailable;

      let buttonStyle = "w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ";

      if (isSelected) {
        if (isAvailable) {
          buttonStyle += "bg-red-600 text-white font-bold shadow-md ring-4 ring-red-100 dark:ring-red-950";
        } else {
          buttonStyle += "border-2 border-dashed border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold";
        }
      } else if (!isAvailable) {
        buttonStyle += "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800";
      } else {
        buttonStyle += "text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-800";
      }

      cells.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              scheduledDate: dateString
            }));
          }}
          className={buttonStyle}
        >
          {d}
        </button>
      );
    }

    return cells;
  };

  // Filter main appointments table (Frame 5)
  const filteredAppointments = appointments.filter((appt) => {
    if (currentUser.role === 'student' && appt.studentEmail !== currentUser.email && appt.studentId !== currentUser.studentId) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      appt.id.toLowerCase().includes(q) ||
      (appt.enquiryId && appt.enquiryId.toLowerCase().includes(q)) ||
      (appt.category && appt.category.toLowerCase().includes(q)) ||
      appt.type.toLowerCase().includes(q) ||
      appt.status.toLowerCase().includes(q) ||
      appt.advisorName.toLowerCase().includes(q)
    );
  });

  const handleOpenDetail = (appt: Appointment) => {
    setIsCreatingNew(false);
    setSelectedApptId(appt.id);
    setErrorMessage(null);
    const rawTime = appt.scheduledTime || appt.time || '10:00 AM - 10:30 AM';

    let apptDur: 15 | 30 = 30;
    if (appt.durationMinutes === 15 || appt.durationMinutes === 30) {
      apptDur = appt.durationMinutes as 15 | 30;
    } else {
      const rangeMins = parseTimeRangeToMinutes(rawTime);
      if (rangeMins && rangeMins.end - rangeMins.start === 15) {
        apptDur = 15;
      }
    }
    setSlotDuration(apptDur);

    const formattedTime = formatTimeRange(rawTime, apptDur);
    const rawCat = appt.category || appt.appointmentCategory || appt.type || 'Online';
    const simpleCategory = rawCat.toLowerCase().includes('offline') ? 'Offline' : 'Online';
    const realTimeDate = appt.appointmentDate || appt.date || appt.createdAt || new Date().toLocaleDateString('en-CA');

    setFormData({
      id: appt.id,
      enquiryId: appt.enquiryId || 'ENQ-1001',
      category: simpleCategory,
      appointmentDate: realTimeDate,
      status: appt.status,
      assignedStaff: appt.advisorName,
      scheduledDate: appt.scheduledDate || appt.date || realTimeDate,
      scheduledTime: formattedTime,
      attachmentFile: appt.attachmentFile || 'Advising_Prep_Notes.pdf',
      notes: appt.notes || ''
    });
    setViewMode('detail');
  };

  const handleCreateNewAppointment = () => {
    if (currentUser.role === 'admin' || currentUser.role === 'officer' || (currentUser.role as string) === 'sso') {
      setErrorMessage('Error: SSO Officers and Administrators cannot create appointments on behalf of students.');
      return;
    }
    setIsCreatingNew(true);
    setSelectedApptId(null);
    setErrorMessage(null);
    const existingApptNums = appointments.map(a => parseInt((a.id || '').replace(/\D/g, '') || '1040')).filter(n => !isNaN(n));
    const maxApptNum = existingApptNums.length > 0 ? Math.max(...existingApptNums) : 1048;
    const newId = `APT-${maxApptNum + 1}`;

    const existingEnqNums = appointments.map(a => parseInt((a.enquiryId || '').replace(/\D/g, '') || '5000')).filter(n => !isNaN(n));
    const maxEnqNum = existingEnqNums.length > 0 ? Math.max(...existingEnqNums) : 5002;
    const newEnquiryId = `ENQ-${maxEnqNum + 1}`;

    const realTimeIsoDate = new Date().toLocaleDateString('en-CA');

    setFormData({
      id: newId,
      enquiryId: newEnquiryId,
      category: '',
      appointmentDate: realTimeIsoDate,
      status: 'scheduled',
      assignedStaff: 'Dr. Alan Turing',
      scheduledDate: realTimeIsoDate,
      scheduledTime: '',
      attachmentFile: '',
      notes: ''
    });
    setViewMode('detail');
  };

  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || formData.category.trim() === '' || formData.category === 'select' || formData.category.startsWith('--')) {
      setErrorMessage('Error: Appointment Category (Online or Offline) is required! Please select a category before booking.');
      return;
    }
    if (!formData.scheduledTime || formData.scheduledTime.trim() === '') {
      setErrorMessage('Error: Time slot is required! Please select an available time slot for your appointment.');
      return;
    }
    if (!formData.notes || formData.notes.trim() === '') {
      setErrorMessage('Error: Description / meeting discussion notes are required! Please fill in the description before booking your appointment.');
      return;
    }
    if (isSlotBooked(formData.scheduledTime, formData.scheduledTime, formData.scheduledDate, formData.assignedStaff, formData.id)) {
      setErrorMessage('Error: The selected time slot overlaps with an existing appointment for this advisor. Please select another time slot or date.');
      return;
    }
    setErrorMessage(null);

    if (isCreatingNew) {
      const studentObj = (currentUser.role === 'student'
        ? students.find(s => s.id === currentUser.studentId || s.email === currentUser.email)
        : null) || students[0] || {
        id: currentUser.studentId || 'STU2025001',
        fullName: currentUser.name,
        name: currentUser.name,
        email: currentUser.email
      };

      const sName = studentObj.fullName || studentObj.name;

      const newAppt: Appointment = {
        id: formData.id,
        enquiryId: formData.enquiryId,
        studentId: studentObj.id,
        fullName: sName,
        studentName: sName,
        studentEmail: studentObj.email,
        assignedStaff: formData.assignedStaff || 'Dr. Alan Turing',
        advisorName: formData.assignedStaff || 'Dr. Alan Turing',
        department: 'School of Computing',
        appointmentCategory: formData.category,
        type: formData.category as AppointmentType,
        category: formData.category,
        date: formData.scheduledDate,
        appointmentDate: formData.scheduledDate,
        scheduledDate: formData.scheduledDate,
        time: formData.scheduledTime,
        scheduledTime: formData.scheduledTime,
        durationMinutes: slotDuration,
        location: formData.category === 'Offline' ? 'Building A, Room 302' : 'Online Meeting (Teams)',
        appointmentStatus: formData.status,
        status: formData.status,
        attachmentFile: formData.attachmentFile || 'Appointment_Agenda.pdf',
        notes: formData.notes,
        createdAt: formData.scheduledDate
      };

      onCreateAppointment(newAppt);
      setIsCreatingNew(false);
      setSelectedApptId(newAppt.id);
      setViewMode('list');
    } else {
      if (!activeAppt) return;
      const updated: Appointment = {
        ...activeAppt,
        enquiryId: formData.enquiryId,
        category: formData.category,
        appointmentCategory: formData.category,
        type: formData.category as AppointmentType,
        status: formData.status,
        advisorName: formData.assignedStaff,
        assignedStaff: formData.assignedStaff,
        date: formData.scheduledDate,
        appointmentDate: formData.appointmentDate,
        scheduledDate: formData.scheduledDate,
        time: formData.scheduledTime,
        scheduledTime: formData.scheduledTime,
        durationMinutes: slotDuration,
        attachmentFile: formData.attachmentFile,
        notes: formData.notes
      };

      onUpdateAppointment(updated);
      setViewMode('list');
    }
  };

  const handleDelete = () => {
    if (!selectedApptId) return;
    if (currentUser.role === 'admin' || currentUser.role === 'officer' || (currentUser.role as string) === 'sso') {
      alert('Administrators and SSO Officers cannot delete student appointments.');
      return;
    }
    if (confirm(`Are you sure you want to delete appointment record ${selectedApptId}?`)) {
      if (onDeleteAppointment) {
        onDeleteAppointment(selectedApptId);
      }
      setViewMode('list');
      setSelectedApptId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setFormData({ ...formData, attachmentFile: fileName });
    }
  };

  const handlePrevCalendar = () => {
    if (calendarViewMode === 'month') {
      if (pickerMonth === 0) {
        setPickerMonth(11);
        setPickerYear(pickerYear - 1);
      } else {
        setPickerMonth(pickerMonth - 1);
      }
    } else if (calendarViewMode === 'week') {
      const parts = selectedCalendarDate.split('-');
      const curr = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      curr.setDate(curr.getDate() - 7);
      const newIso = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      setSelectedCalendarDate(newIso);
      setPickerMonth(curr.getMonth());
      setPickerYear(curr.getFullYear());
    } else if (calendarViewMode === 'day') {
      const parts = selectedCalendarDate.split('-');
      const curr = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      curr.setDate(curr.getDate() - 1);
      const newIso = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      setSelectedCalendarDate(newIso);
      setPickerMonth(curr.getMonth());
      setPickerYear(curr.getFullYear());
    }
  };

  const handleNextCalendar = () => {
    if (calendarViewMode === 'month') {
      if (pickerMonth === 11) {
        setPickerMonth(0);
        setPickerYear(pickerYear + 1);
      } else {
        setPickerMonth(pickerMonth + 1);
      }
    } else if (calendarViewMode === 'week') {
      const parts = selectedCalendarDate.split('-');
      const curr = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      curr.setDate(curr.getDate() + 7);
      const newIso = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      setSelectedCalendarDate(newIso);
      setPickerMonth(curr.getMonth());
      setPickerYear(curr.getFullYear());
    } else if (calendarViewMode === 'day') {
      const parts = selectedCalendarDate.split('-');
      const curr = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      curr.setDate(curr.getDate() + 1);
      const newIso = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      setSelectedCalendarDate(newIso);
      setPickerMonth(curr.getMonth());
      setPickerYear(curr.getFullYear());
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedCalendarDate(iso);
    setPickerMonth(today.getMonth());
    setPickerYear(today.getFullYear());
  };

  const getWeekDays = (dateStr: string) => {
    const parts = dateStr.split('-');
    let date = new Date();
    if (parts.length === 3) {
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    const day = date.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMon);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      week.push(`${yStr}-${mStr}-${dStr}`);
    }
    return week;
  };

  const getCalendarHeaderTitle = () => {
    if (calendarViewMode === 'month') {
      return new Date(pickerYear, pickerMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    } else if (calendarViewMode === 'week') {
      const weekDays = getWeekDays(selectedCalendarDate);
      const startParts = weekDays[0].split('-');
      const endParts = weekDays[6].split('-');
      const startObj = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, parseInt(startParts[2], 10));
      const endObj = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, parseInt(endParts[2], 10));
      return `${startObj.toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${endObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      const parts = selectedCalendarDate.split('-');
      const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // ==========================================
  // FRAME 5: APPOINTMENTS TABLE & MANAGER VIEW
  // ==========================================
  const renderAdminCalendarGrid = () => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay(); // 0 = Sun
    const startingOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon = 0

    const days = [];
    const prevMonthDays = new Date(pickerYear, pickerMonth, 0).getDate();

    // Previous month filler cells
    for (let i = startingOffset - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="h-16 sm:h-20 p-2 bg-slate-50/40 dark:bg-slate-950/20 rounded-xl text-slate-300 dark:text-slate-700 text-xs font-bold text-left border border-transparent">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month cells
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(pickerMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateString = `${pickerYear}-${monthStr}-${dayStr}`;

      const isSelected = selectedCalendarDate === dateString;
      const isToday = realTodayIso === dateString;

      // Check if there are appointments on this date
      const dayAppts = appointments.filter(a => {
        const sDate = a.scheduledDate || a.date || a.appointmentDate;
        return sDate === dateString;
      });

      const hasAppts = dayAppts.length > 0;

      days.push(
        <button
          key={`day-${d}`}
          type="button"
          onClick={() => {
            setSelectedCalendarDate(dateString);
            setDateFilterMode('selected');
          }}
          className={`h-16 sm:h-20 p-2 sm:p-2.5 rounded-xl text-xs transition-all cursor-pointer flex flex-col justify-between text-left relative ${
            isSelected
              ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 font-black shadow-xs ring-1 ring-indigo-500/20'
              : 'border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`font-black text-sm ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
              {d}
            </span>
            {isToday && (
              <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight bg-indigo-100 dark:bg-indigo-950/80 px-1 py-0.2 rounded">
                Today
              </span>
            )}
          </div>

          {hasAppts && (
            <div className="flex items-center gap-1 justify-center w-full pb-0.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block shadow-2xs"></span>
              {dayAppts.length > 1 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-2xs"></span>
              )}
              {dayAppts.length > 2 && (
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 leading-none select-none bg-indigo-100 dark:bg-indigo-950/90 px-1 py-0.2 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                  +
                </span>
              )}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const renderWeekGrid = () => {
    const weekDays = getWeekDays(selectedCalendarDate);
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {weekDays.map((dateStr, idx) => {
          const parts = dateStr.split('-');
          const dayNum = parseInt(parts[2], 10);
          const isSelected = selectedCalendarDate === dateStr;
          const isToday = realTodayIso === dateStr;

          const dayAppts = appointments.filter(a => {
            const sDate = a.scheduledDate || a.date || a.appointmentDate;
            return sDate === dateStr;
          });

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => {
                setSelectedCalendarDate(dateStr);
                setDateFilterMode('selected');
              }}
              className={`min-h-[110px] sm:min-h-[130px] p-2.5 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer border ${
                isSelected
                  ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-2xs ring-1 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {dayNames[idx]}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {dayNum}
                </div>
              </div>

              <div className="space-y-1 mt-2">
                {dayAppts.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">No slots</span>
                ) : (
                  dayAppts.map((appt) => (
                    <div key={appt.id} className="text-[10px] font-bold p-1 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 truncate">
                      {appt.scheduledTime || appt.time || '09:30 AM'} - {appt.fullName || appt.studentName}
                    </div>
                  ))
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderDayGrid = () => {
    const hours = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
      '04:00 PM', '05:00 PM'
    ];

    const dayAppts = appointments.filter(a => {
      const sDate = a.scheduledDate || a.date || a.appointmentDate;
      return sDate === selectedCalendarDate;
    });

    const parts = selectedCalendarDate.split('-');
    let dateObj = new Date();
    if (parts.length === 3) {
      dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }

    return (
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>Schedule for {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            {dayAppts.length} Appointments Scheduled
          </span>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {hours.map((hour) => {
            const hourPrefix = hour.split(':')[0];
            const period = hour.slice(-2);

            const apptsInHour = dayAppts.filter(a => {
              const timeStr = a.scheduledTime || a.time || '';
              if (!timeStr) return false;
              return timeStr.includes(hourPrefix) && timeStr.toUpperCase().includes(period);
            });

            return (
              <div key={hour} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                <span className="w-16 shrink-0 font-mono font-bold text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
                  {hour}
                </span>
                <div className="flex-1 space-y-1">
                  {apptsInHour.length === 0 ? (
                    currentUser.role !== 'admin' && currentUser.role !== 'officer' && (currentUser.role as string) !== 'sso' ? (
                      <button
                        type="button"
                        onClick={handleCreateNewAppointment}
                        className="w-full py-1.5 px-3 border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>+ Open Slot Available</span>
                        <span className="text-[10px] text-slate-400 font-mono">Click to book</span>
                      </button>
                    ) : (
                      <div className="py-1 px-3 text-[11px] text-slate-400 font-medium italic">
                        No booked consultations
                      </div>
                    )
                  ) : (
                    apptsInHour.map((appt) => (
                      <div
                        key={appt.id}
                        onClick={() => handleOpenDetail(appt)}
                        className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {appt.fullName || appt.studentName}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                            {appt.category || appt.type || 'Academic Advising'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 font-bold px-2 py-0.5 rounded">
                            {appt.id}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getApptDurationMins = (a: Appointment): number => {
    if (a.durationMinutes && a.durationMinutes > 0) return a.durationMinutes;
    const timeStr = a.scheduledTime || a.time || '';
    if (!timeStr) return 30;
    if (timeStr.includes('-')) {
      const parts = timeStr.split('-');
      const parseMins = (str: string) => {
        const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) return null;
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const p = match[3] ? match[3].toUpperCase() : '';
        if (p === 'PM' && h < 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      const sM = parseMins(parts[0]);
      const eM = parseMins(parts[1]);
      if (sM !== null && eM !== null && eM > sM) return eM - sM;
    }
    return 30;
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateStr;
  };

  const getUpcomingDisplayAppointments = () => {
    let list = appointments;

    // Date Filtering
    if (dateFilterMode === 'selected' && selectedCalendarDate) {
      list = list.filter(a => {
        const sDate = a.scheduledDate || a.date || a.appointmentDate;
        return sDate === selectedCalendarDate;
      });
    }

    // Buffer Time / Duration Filtering
    if (bufferTime === '15 MINS') {
      list = list.filter(a => getApptDurationMins(a) === 15);
    } else if (bufferTime === '30 MINS') {
      list = list.filter(a => getApptDurationMins(a) === 30);
    } else if (bufferTime === '45 MINS') {
      list = list.filter(a => getApptDurationMins(a) === 45);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.id.toLowerCase().includes(q) ||
        (a.enquiryId && a.enquiryId.toLowerCase().includes(q)) ||
        (a.fullName && a.fullName.toLowerCase().includes(q)) ||
        (a.studentName && a.studentName.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q))
      );
    }

    return list;
  };

  if (viewMode === 'list') {
    const displayAppts = getUpcomingDisplayAppointments();
    const itemsPerPage = 4;
    const totalUpcomingPages = Math.max(1, Math.ceil(displayAppts.length / itemsPerPage));
    const validUpcomingPage = Math.min(upcomingPage, totalUpcomingPages);
    const paginatedAppts = displayAppts.slice(
      (validUpcomingPage - 1) * itemsPerPage,
      validUpcomingPage * itemsPerPage
    );

    // Check if showing Appointment Manager view for SSO / Manager
    if ((currentUser.role === 'officer' || currentUser.role === 'manager') && adminScheduleView === 'manager') {
      return (
        <div className="space-y-6">
          {/* Top Breadcrumb & Header Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest">
              <span className="text-slate-400">APPOINTMENTS</span>
              <span className="text-slate-300 dark:text-slate-600">›</span>
              <span className="text-indigo-600 dark:text-indigo-500 font-black">MY SCHEDULE</span>
            </div>

            <div className="flex flex-wrap justify-between items-end gap-4 pt-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Appointment Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Manage your academic guidance sessions and availability for 2026 student requests and sync your professional calendar.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdminScheduleView('table')}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter View</span>
                </button>

                {currentUser.role !== 'admin' && currentUser.role !== 'officer' && (currentUser.role as string) !== 'sso' && (
                  <button
                    type="button"
                    onClick={handleCreateNewAppointment}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>+ New Slot</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Role Access Banners if needed */}
          {currentUser.role === 'admin' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
              <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span><strong>Notice for Administrative Officers (-):</strong> Administrative Officers do not have an active appointment management role. Advising and counseling appointments are scheduled and managed directly by Student Support Officers.</span>
            </div>
          )}

          {currentUser.role === 'manager' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-medium">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span><strong>Manager Access (R):</strong> Appointment data is accessible in Read-Only mode for monthly service reporting and team workload analytics.</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold text-[10px] uppercase">Service Reports Mode</span>
            </div>
          )}

          {/* Main Grid: Left Calendar (7 cols), Right Upcoming Appointments (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Calendar Grid */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Month Navigation */}
                <div className="flex items-center gap-3 font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  <span>{getCalendarHeaderTitle()}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevCalendar}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                      title="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleJumpToToday}
                      className="px-2 py-0.5 text-[10px] uppercase font-black tracking-wider bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCalendar}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                      title="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* View Mode Pill Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('month')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      calendarViewMode === 'month'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-extrabold'
                        : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('week')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      calendarViewMode === 'week'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-extrabold'
                        : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('day')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      calendarViewMode === 'day'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-extrabold'
                        : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>

              {calendarViewMode === 'month' && (
                <>
                  {/* Calendar Weekday Labels */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {renderAdminCalendarGrid()}
                  </div>
                </>
              )}

              {calendarViewMode === 'week' && renderWeekGrid()}

              {calendarViewMode === 'day' && renderDayGrid()}
            </div>

            {/* Right Column: Upcoming Appointments */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  UPCOMING APPOINTMENTS
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-indigo-200/80 dark:border-indigo-800">
                    4 per page
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold">
                    {displayAppts.length} TOTAL
                  </span>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="space-y-2 bg-slate-100/90 dark:bg-slate-800/90 p-2 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-slate-700/60">
                {/* Date Scope Filter */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-1">
                    Date Scope:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDateFilterMode('selected')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                        dateFilterMode === 'selected'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      Selected ({formatShortDate(selectedCalendarDate)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateFilterMode('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                        dateFilterMode === 'all'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      All Dates
                    </button>
                  </div>
                </div>

                {/* Slot Duration Filter */}
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-1">
                    Filter Slots:
                  </span>
                  <div className="flex items-center gap-1">
                    {(['ALL SLOTS', '15 MINS', '30 MINS'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setBufferTime(mode)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                          bufferTime === mode
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3.5 min-h-[380px]">
                {displayAppts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No appointments scheduled for this date.
                  </div>
                ) : (
                  paginatedAppts.map((appt) => {
                    const studentObj = students.find(s => s.id === appt.studentId) || students.find(s => s.name === appt.studentName || s.fullName === appt.fullName);
                    const displayName = appt.fullName || appt.studentName || studentObj?.name || 'Nguyen Van A';
                    const displayCategory = appt.category || appt.appointmentCategory || appt.type || 'Course Enrollment Guidance';
                    const isPending = appt.status === 'pending';
                    const isConfirmed = appt.status === 'scheduled' || appt.status === 'completed';

                    const baseTzHours = 7;
                    const currentTzHours = getTimezoneOffsetHours(selectedTimezone);
                    const tzOffsetDiff = currentTzHours - baseTzHours;

                    const individualApptMins = getApptDurationMins(appt);
                    const effectiveDurationMins = bufferTime === '15 MINS' ? 15 : bufferTime === '30 MINS' ? 30 : individualApptMins;
                    const rawTime = appt.scheduledTime || appt.time || '09:30 AM';
                    const shiftedTime = getShiftedTime(rawTime, tzOffsetDiff);
                    const clearTimeRange = formatDynamicTimeRange(shiftedTime, effectiveDurationMins);

                    return (
                      <div
                        key={appt.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3 relative overflow-hidden border-l-4 border-l-indigo-600 dark:border-l-indigo-500"
                      >
                        {/* Top Row: Avatar, Info, Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700">
                              {studentObj?.avatar ? (
                                <img src={studentObj.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <UserIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                {displayName}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold">
                                Student ID: {studentObj?.id || appt.studentId || 'STU202601'}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`shrink-0 px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase border ${
                            isPending
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : isConfirmed
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}>
                            {isPending ? 'PENDING' : isConfirmed ? 'CONFIRMED' : appt.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Category & Unique Reference IDs */}
                        <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5 text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">CATEGORY:</span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-200/80 dark:border-indigo-800/80 truncate">
                              {displayCategory}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                              Appt: {appt.id}
                            </span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                              Enquiry: {appt.enquiryId || 'ENQ-5001'}
                            </span>
                          </div>
                        </div>

                        {/* Clear A to B Time Row */}
                        <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-500 shrink-0" />
                            <span className="font-mono text-xs font-extrabold tracking-tight">
                              {clearTimeRange}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs">
                            {effectiveDurationMins} MINS SLOT
                          </span>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-2 pt-1">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateAppointment({ ...appt, status: 'scheduled' });
                                }}
                                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateAppointment({ ...appt, status: 'cancelled' });
                                }}
                                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (appt.meetingUrl) window.open(appt.meetingUrl, '_blank');
                                  else handleOpenDetail(appt);
                                }}
                                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer text-center"
                              >
                                Join
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(appt)}
                                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls Bar */}
              {displayAppts.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Page <strong className="text-slate-900 dark:text-white">{validUpcomingPage}</strong> of <strong className="text-slate-900 dark:text-white">{totalUpcomingPages}</strong> ({displayAppts.length} total slots)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={validUpcomingPage <= 1}
                      onClick={() => setUpcomingPage(prev => Math.max(1, prev - 1))}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    {Array.from({ length: totalUpcomingPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setUpcomingPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          validUpcomingPage === p
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={validUpcomingPage >= totalUpcomingPages}
                      onClick={() => setUpcomingPage(prev => Math.min(totalUpcomingPages, prev + 1))}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Button: View All Appointments */}
              <button
                type="button"
                onClick={() => setAdminScheduleView('table')}
                className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all text-center cursor-pointer shadow-2xs mt-2"
              >
                View All Appointments
              </button>
            </div>
          </div>

          {/* Bottom Bar Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            {/* Online Today Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOnlineToday(!isOnlineToday)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${
                  isOnlineToday ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOnlineToday ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Online Today
              </span>
            </div>

            {/* Sync Outlook Button */}
            <button
              type="button"
              onClick={() => alert('Synced with Outlook Calendar!')}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Sync Outlook</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Top Toggle back to Appointment Manager view if SSO/Manager */}
        {(currentUser.role === 'officer' || currentUser.role === 'manager') && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setAdminScheduleView('manager')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Switch to Appointment Manager View</span>
            </button>
          </div>
        )}

        {/* Role Access Banners */}
        {currentUser.role === 'admin' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
            <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span><strong>Notice for Administrative Officers (-):</strong> Administrative Officers do not have an active appointment management role. Advising and counseling appointments are scheduled and managed directly by Student Support Officers.</span>
          </div>
        )}

        {currentUser.role === 'manager' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-medium">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span><strong>Manager Access (R):</strong> Appointment data is accessible in Read-Only mode for monthly service reporting and team workload analytics.</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold text-[10px] uppercase">Service Reports Mode</span>
          </div>
        )}

        {/* Page Header Title */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Appointments
            </h1>
            <p className="text-xs text-slate-500">Scheduled 1-on-1 Advising & Counseling Sessions View</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200">
            {filteredAppointments.length} Appointments
          </div>
        </div>

        {/* Search & Action Bar (Matching Wireframe: Search: [Input] Buttons: Search, New, Edit) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
              Search:
            </label>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Appointment ID, Enquiry ID, Staff, Category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
            {currentUser.role !== 'admin' && currentUser.role !== 'officer' && (currentUser.role as string) !== 'sso' && (
              <button
                onClick={handleCreateNewAppointment}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            )}
            <button
              disabled={!selectedApptId}
              onClick={() => {
                if (selectedApptId) {
                  const appt = appointments.find((a) => a.id === selectedApptId);
                  if (appt) handleOpenDetail(appt);
                }
              }}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>

        {/* Main Appointments Table (Frame 5 Columns: Appointment ID, Enquiry ID, AppointmentCategory, AppointmentDate, AppointmentStatus, Assigned Staff, Scheduled Date, Scheduled Time) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Enquiry ID</th>
                  <th className="py-3 px-4">AppointmentCategory</th>
                  <th className="py-3 px-4">AppointmentDate</th>
                  <th className="py-3 px-4">AppointmentStatus</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No appointments match current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => {
                    const isSelected = selectedApptId === appt.id;
                    const rawCat = appt.category || appt.appointmentCategory || appt.type || 'Online';
                    const catName = rawCat.toLowerCase().includes('offline') ? 'Offline' : 'Online';
                    const logDate = appt.date || appt.createdAt;
                    const sDate = appt.scheduledDate || appt.date;
                    const sTime = appt.scheduledTime || appt.time;
                    return (
                      <tr
                        key={appt.id}
                        onClick={() => setSelectedApptId(appt.id)}
                        onDoubleClick={() => handleOpenDetail(appt)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {appt.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                          {appt.enquiryId || 'ENQ-1001'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {catName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {logDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            appt.status === 'scheduled'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : appt.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {appt.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {appt.advisorName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {sDate}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                          {formatTimeRange(sTime, appt.durationMinutes || 30)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {appt.attachmentFile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFileModalData({
                                    fileName: appt.attachmentFile || 'Appointment_Document.pdf',
                                    studentName: appt.fullName || appt.studentName,
                                    studentId: appt.studentId,
                                    appointmentId: appt.id,
                                    category: appt.category || appt.appointmentCategory || appt.type,
                                    notes: appt.notes
                                  });
                                }}
                                title="View uploaded attachment file"
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span>File</span>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(appt);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                            >
                              View Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FRAME 6: APPOINTMENT DETAIL FORM
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Back */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsCreatingNew(false);
              setErrorMessage(null);
              setViewMode('list');
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isCreatingNew ? 'Book Advisory Appointment' : 'Appointment Detail'}
            </h1>
            <p className="text-xs text-slate-500">
              {isCreatingNew ? 'New Reference ID: ' : 'Editing Record: '}<strong className="text-indigo-600 font-mono">{formData.id}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCreatingNew(false);
              setErrorMessage(null);
              setViewMode('list');
            }}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
          >
            {(currentUser.role === 'admin' || currentUser.role === 'manager') ? 'Back' : 'Cancel'}
          </button>
          {!isCreatingNew && currentUser.role !== 'admin' && currentUser.role !== 'officer' && (currentUser.role as string) !== 'sso' && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          {currentUser.role !== 'admin' && currentUser.role !== 'manager' && (
            <button
              onClick={handleSaveDetail}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> {isCreatingNew ? 'Book Appointment' : 'Save Appointment'}
            </button>
          )}
        </div>
      </div>

      {/* Frame 6 Form: Appointment Details */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Appointment Schedule Record
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {currentUser.role === 'admin' && 'Admin Officer: No Appointment Role (-)'}
            {currentUser.role === 'officer' && 'Support Officer: Managing Advising Session (CRU)'}
            {currentUser.role === 'manager' && 'Manager: Service Report Access Only (R)'}
            {currentUser.role === 'student' && 'Student Portal: Advising Appointment (CR*U*)'}
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/70 border-2 border-red-500 rounded-xl flex items-center justify-between text-red-700 dark:text-red-300 font-bold text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 dark:hover:text-red-200 text-sm font-extrabold px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSaveDetail} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Appointment ID
            </label>
            <input
              type="text"
              readOnly
              value={formData.id}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 font-mono font-bold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enquiry ID
            </label>
            <input
              type="text"
              readOnly={currentUser.role === 'admin' || currentUser.role === 'manager' || currentUser.role === 'student'}
              value={formData.enquiryId}
              onChange={(e) => setFormData({ ...formData, enquiryId: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold ${
                currentUser.role === 'admin' || currentUser.role === 'manager' || currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              AppointmentCategory <span className="text-red-500 font-extrabold ml-0.5">*</span>
            </label>
            <select
              disabled={currentUser.role === 'admin' || currentUser.role === 'manager'}
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errorMessage) setErrorMessage(null);
              }}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium ${
                currentUser.role === 'admin' || currentUser.role === 'manager'
                  ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <option value="">-- Select Online / Offline --</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              AppointmentDate (Created Date)
            </label>
            <input
              type="date"
              readOnly
              disabled
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              AppointmentStatus
            </label>
            <select
              disabled={currentUser.role === 'student'}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Staff
            </label>
            <select
              disabled={currentUser.role === 'student'}
              value={formData.assignedStaff}
              onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              {STAFF_LIST.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
              {!STAFF_LIST.includes(formData.assignedStaff) && formData.assignedStaff && (
                <option value={formData.assignedStaff}>{formData.assignedStaff}</option>
              )}
            </select>
          </div>

          {/* Interactive Date & Time Picker Section matching design screenshots */}
          <div className="sm:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm my-2">
            {/* Header Title: e.g., "August 03" */}
            <div className="text-center font-bold text-slate-800 dark:text-slate-100 text-base mb-2 tracking-tight">
              {getFormattedSelectedTitle()}
            </div>

            {(() => {
              const currentAvail = getStaffAvailability(formData.assignedStaff, formData.scheduledDate, slotDuration);
              const targetOffset = getTimezoneOffsetHours(selectedTimezone);
              const tzOffsetDiff = targetOffset - 7;

              return (
                <>
                  {currentAvail.scheduleBadge && (
                    <div className="mb-6 py-1.5 px-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                      <span className="truncate">Staff Schedule: {currentAvail.scheduleBadge}</span>
                      <span className="text-[10px] font-extrabold tracking-wider bg-indigo-100 dark:bg-indigo-900/80 px-2 py-0.5 rounded text-indigo-800 dark:text-indigo-200 shrink-0">
                        {tzOffsetDiff === 0 ? 'Flexible Availability' : `Adjusted to UTC${targetOffset >= 0 ? '+' : ''}${targetOffset}:00`}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: DATE */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-500 text-xs tracking-wider uppercase">
                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
                        <span>DATE</span>
                      </div>

                      {/* Month Selector: < > August 2026 */}
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-200 pl-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (pickerMonth === 0) {
                              setPickerMonth(11);
                              setPickerYear(pickerYear - 1);
                            } else {
                              setPickerMonth(pickerMonth - 1);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (pickerMonth === 11) {
                              setPickerMonth(0);
                              setPickerYear(pickerYear + 1);
                            } else {
                              setPickerMonth(pickerMonth + 1);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <span>
                          {new Date(pickerYear, pickerMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                        <span>S</span>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {renderCalendarMonthGrid()}
                      </div>
                    </div>

                    {/* Right Column: TIME */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-500 text-xs tracking-wider uppercase">
                          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
                          <span>TIME SLOT</span>
                          <span className="text-red-500 font-extrabold ml-0.5">*</span>
                        </div>

                        {/* Duration selector: 15 mins or 30 mins */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setSlotDuration(15);
                              if (formData.scheduledTime) {
                                const startTime = formData.scheduledTime.split('-')[0].trim();
                                const newRange = formatDynamicTimeRange(startTime, 15);
                                setFormData(prev => ({ ...prev, scheduledTime: newRange }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              slotDuration === 15
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            15 min
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSlotDuration(30);
                              if (formData.scheduledTime) {
                                const startTime = formData.scheduledTime.split('-')[0].trim();
                                const newRange = formatDynamicTimeRange(startTime, 30);
                                setFormData(prev => ({ ...prev, scheduledTime: newRange }));
                              }
                            }}
                            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              slotDuration === 30
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            30 min
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const availableSlots = currentAvail.slots.filter((baseSlot) => {
                          const timeSlot = convertSlotToTimezone(baseSlot, tzOffsetDiff);
                          return !isSlotBooked(baseSlot, timeSlot, formData.scheduledDate, formData.assignedStaff, formData.id);
                        });

                        if (!currentAvail.isAvailable) {
                          return (
                            <div className="bg-slate-100 dark:bg-slate-800/70 rounded-xl p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed my-auto border border-slate-200/60 dark:border-slate-700/50">
                              There is no advisor availability on this date. Please choose another date or staff member.
                            </div>
                          );
                        }

                        if (availableSlots.length === 0) {
                          return (
                            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-6 text-center text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed border border-amber-200 dark:border-amber-800/60 my-auto shadow-2xs">
                              <Clock className="w-5 h-5 mx-auto mb-1.5 text-amber-600 dark:text-amber-400" />
                              All time slots on this date ({getFormattedSelectedTitle()}) are booked. Please select another date.
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-3 gap-2.5">
                            {availableSlots.map((baseSlot) => {
                              const timeSlot = convertSlotToTimezone(baseSlot, tzOffsetDiff);
                              const fullRangeSlot = formatDynamicTimeRange(timeSlot, slotDuration);
                              const isSelected = formData.scheduledTime === fullRangeSlot || formData.scheduledTime === timeSlot || formData.scheduledTime?.startsWith(timeSlot);
                              return (
                                <button
                                  key={baseSlot}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, scheduledTime: fullRangeSlot }));
                                    if (errorMessage) setErrorMessage(null);
                                  }}
                                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
                                    isSelected
                                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-indigo-400 shadow-2xs font-bold ring-2 ring-indigo-500/30'
                                      : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400'
                                  }`}
                                >
                                  {timeSlot}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Footer Timezone Banner */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-8 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>All times are in</span>
              <div className="relative inline-flex items-center">
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-bold pr-5 pl-1 py-0.5 text-[11px] border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="(UTC+07:00) Bangkok, Hanoi, Jakarta">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                  <option value="(UTC+10:00) Canberra, Melbourne, Sydney">(UTC+10:00) Canberra, Melbourne, Sydney</option>
                  <option value="(UTC+08:00) Singapore, Perth, Beijing">(UTC+08:00) Singapore, Perth, Beijing</option>
                  <option value="(UTC+00:00) London, Dublin">(UTC+00:00) London, Dublin</option>
                  <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-0" />
              </div>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              AttachmentFile
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                  <Paperclip className="w-4 h-4 shrink-0" />
                  <span className="truncate">{formData.attachmentFile || 'No file attached'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase shrink-0 ml-2">Document</span>
              </div>

              {formData.attachmentFile && (
                <button
                  type="button"
                  onClick={() => setFileModalData({
                    fileName: formData.attachmentFile || 'Appointment_Document.pdf',
                    studentName: activeAppt?.fullName || activeAppt?.studentName || formData.assignedStaff,
                    studentId: activeAppt?.studentId || 'STU2025001',
                    appointmentId: formData.id,
                    category: formData.category,
                    notes: formData.notes
                  })}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View File</span>
                </button>
              )}

              <label className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg border border-indigo-200 dark:border-indigo-800 font-semibold cursor-pointer shrink-0">
                <Upload className="w-4 h-4 inline mr-1" /> Browse
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Meeting Discussion Notes / Description <span className="text-red-500 font-extrabold ml-0.5">*</span>
            </label>
            <textarea
              rows={3}
              readOnly={currentUser.role === 'admin' || currentUser.role === 'manager'}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white ${
                currentUser.role === 'admin' || currentUser.role === 'manager'
                  ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>
        </form>
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {fileModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>{fileModalData.fileName}</span>
                    <span className="text-[10px] font-mono font-normal bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded">PDF DOCUMENT</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Appointment Attachment • {fileModalData.appointmentId || 'APT'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Downloading copy of ${fileModalData.fileName}`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFileModalData(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body / Reader Simulation */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950 flex-1">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6 text-slate-900 dark:text-slate-100 max-w-2xl mx-auto font-sans">
                {/* Official Header */}
                <div className="border-b-2 border-indigo-600 pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-black text-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                      Westfield State University
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      Student Support Services & Academic Advisory
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                      <FileCheck className="w-3 h-3" /> VERIFIED ATTACHMENT
                    </span>
                  </div>
                </div>

                {/* Document Information Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Student / Attendee</span>
                    <span className="font-bold text-slate-900 dark:text-white">{fileModalData.studentName || 'Student Name'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Student ID</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{fileModalData.studentId || 'STU2025001'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Appointment Category</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{fileModalData.category || 'Academic Advising'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Upload Date</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">2026-07-30</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
                    Meeting Preparation Document Notes
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <p className="font-medium">
                      Official document attached for student appointment session preparation:
                    </p>
                    <p className="italic text-slate-600 dark:text-slate-400">
                      "{fileModalData.notes || 'Degree audit worksheet, prerequisite course planning, and advisor consultation notes.'}"
                    </p>
                    <div className="pt-3 font-mono text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between">
                      <span>Checksum SHA-256: 7d4a12...f809</span>
                      <span>1.18 MB</span>
                    </div>
                  </div>
                </div>

                {/* Digital Stamp Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-indigo-500" />
                    <span>FERPA Confidential Advising Attachment</span>
                  </div>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Authorized Access for Student Support Officers (SSO)
              </span>
              <button
                type="button"
                onClick={() => setFileModalData(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
