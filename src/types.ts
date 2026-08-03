export type UserRole = 'student' | 'admin' | 'officer' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  studentId?: string;
  title?: string;
  ssoProvider: 'Campus Azure AD' | 'Google Workspace Edu' | 'Okta Unified SSO';
  mfaEnabled: boolean;
  lastLogin: string;
  groups: string[];
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  grade?: string;
  term: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export interface Student {
  id: string; // StudentID
  fullName: string;
  name?: string; // alias for compatibility
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  major: string;
  avatar?: string;
  degree?: string;
  year?: string;
  gpa?: number;
  status?: 'active' | 'probation' | 'graduated' | 'leave_of_absence';
  advisor?: {
    name: string;
    email: string;
    department: string;
  };
  creditsEarned?: number;
  totalCreditsRequired?: number;
  financialStatus?: 'clear' | 'pending_payment' | 'scholarship';
  enrolledCourses?: Course[];
  documents?: StudentDocument[];
  enrollmentDate?: string;
  notes?: string;
}

export type EnquiryCategory = 
  | 'Academic'
  | 'Financial'
  | 'Housing'
  | 'International Student Services'
  | 'IT & Portal Support'
  | 'General';

export type EnquiryPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EnquiryStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface ResponseMessage {
  id: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: string[];
}

export interface Enquiry {
  id: string; // EnquiryID
  studentId: string;
  fullName: string;
  studentName?: string; // compatibility
  studentEmail?: string;
  major: string;
  enquiryCategory: string; // or category
  category?: EnquiryCategory;
  enquiryDate: string;
  createdAt?: string;
  lastUpdated?: string;
  enquiryUrgency: string; // Priority: Low, Medium, High, Urgent
  priority?: EnquiryPriority;
  enquiryStatus: string; // Status: Open, In Progress, Resolved, Closed
  status?: EnquiryStatus;
  description: string;
  assignedStaff: string; // Assigned Staff
  assignedTo?: string;
  attachmentFile?: string;
  updatedAt?: string;
  subject?: string;
  responses?: ResponseMessage[];
}

export type AppointmentType =
  | 'Academic Advising'
  | 'Career Counseling'
  | 'Financial Aid Consultation'
  | 'Mental Health & Wellness'
  | 'Visa & Immigration'
  | 'Course Enrollment Guidance'
  | 'Special Consideration Query'
  | 'Academic Credit Transfer';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'pending';

export interface Appointment {
  id: string; // Appointment ID
  enquiryId: string; // Enquiry ID
  studentId: string; // Student ID
  fullName: string;
  studentName?: string;
  studentEmail?: string;
  enquiryCategory?: string;
  appointmentDate?: string;
  date?: string; // date compatibility
  appointmentCategory?: string; // Appointment Category
  category?: string;
  type?: AppointmentType;
  appointmentStatus?: string; // Appointment Status
  status?: AppointmentStatus;
  assignedStaff?: string;
  advisorName?: string;
  scheduledDate: string;
  scheduledTime: string;
  time?: string;
  description?: string;
  notes?: string;
  attachmentFile?: string;
  durationMinutes?: number;
  location?: string;
  meetingUrl?: string;
  createdAt?: string;
  department?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'enquiry' | 'appointment' | 'system' | 'student';
}

export type FeedbackCategory =
  | 'Advisory Services'
  | 'Portal Usability'
  | 'Facilities'
  | 'Academic Support'
  | 'General Suggestion';

export type FeedbackStatus = 'New' | 'Under Review' | 'Acknowledged' | 'Implemented';

export interface FeedbackEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  rating: number; // 1 to 5
  category: FeedbackCategory;
  subject: string;
  content: string;
  isAnonymous: boolean;
  status: FeedbackStatus;
  createdAt: string;
  responseNote?: string;
  respondedBy?: string;
  respondedAt?: string;
}

