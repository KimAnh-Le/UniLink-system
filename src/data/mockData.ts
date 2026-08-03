import { User, Student, Enquiry, Appointment, AuditLog, Notification, FeedbackEntry } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-STUDENT-01',
    name: 'Alexandra Chen',
    email: 'alexandra.chen@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentId: 'STU2025001',
    department: 'Computer Science',
    title: 'Student (Undergraduate Senior)',
    ssoProvider: 'Campus Azure AD',
    mfaEnabled: true,
    lastLogin: '2026-07-28 08:30 AM',
    groups: ['students-2025', 'cs-undergrads', 'scholarship-recipients']
  },
  {
    id: 'USR-ADMIN-01',
    name: 'David Vance',
    email: 'david.vance@campus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Administrative Services Desk',
    title: 'Administrative Officer',
    ssoProvider: 'Okta Unified SSO',
    mfaEnabled: true,
    lastLogin: '2026-07-28 09:15 AM',
    groups: ['staff-admin', 'enquiry-triage-team']
  },
  {
    id: 'USR-OFFICER-01',
    name: 'Sarah Connor',
    email: 'sarah.connor@campus.edu',
    role: 'officer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Student Support Services',
    title: 'Student Support Officer',
    ssoProvider: 'Campus Azure AD',
    mfaEnabled: true,
    lastLogin: '2026-07-28 08:50 AM',
    groups: ['student-support-team', 'academic-advisors']
  },
  {
    id: 'USR-MANAGER-01',
    name: 'Dr. Eleanor Sterling',
    email: 'e.sterling@campus.edu',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Office of Student Support Services',
    title: 'Manager, Student Support Services',
    ssoProvider: 'Google Workspace Edu',
    mfaEnabled: true,
    lastLogin: '2026-07-28 07:45 AM',
    groups: ['executive-board', 'deans-council', 'system-managers']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU2025001',
    fullName: 'Alexandra Chen',
    name: 'Alexandra Chen',
    dob: '2003-04-12',
    gender: 'Female',
    email: 'alexandra.chen@campus.edu',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Campus Heights',
    major: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    degree: 'Bachelor of Science',
    year: 'Year 4 (Senior)',
    gpa: 3.84,
    status: 'active',
    advisor: {
      name: 'Dr. Alan Turing',
      email: 'a.turing@campus.edu',
      department: 'School of Computing'
    },
    creditsEarned: 104,
    totalCreditsRequired: 120,
    financialStatus: 'scholarship',
    enrollmentDate: '2022-09-01',
    enrolledCourses: [
      { code: 'CS401', title: 'Distributed Systems & Cloud', credits: 4, grade: 'A', term: 'Fall 2025' },
      { code: 'CS450', title: 'Artificial Intelligence', credits: 4, grade: 'A-', term: 'Fall 2025' },
      { code: 'MATH320', title: 'Linear Algebra II', credits: 3, grade: 'B+', term: 'Spring 2025' },
      { code: 'CS499', title: 'Senior Capstone Project', credits: 4, grade: 'In Progress', term: 'Spring 2026' }
    ],
    documents: [
      { id: 'DOC-1', name: 'Official_Transcript_2025.pdf', type: 'PDF Document', uploadDate: '2025-12-15', size: '1.2 MB' },
      { id: 'DOC-2', name: 'Dean_Scholarship_Award.pdf', type: 'PDF Document', uploadDate: '2024-08-20', size: '850 KB' },
      { id: 'DOC-3', name: 'Immunization_Record.pdf', type: 'PDF Document', uploadDate: '2022-08-10', size: '420 KB' }
    ],
    notes: 'Honor student. Applying for graduate research thesis program in AI Systems.'
  },
  {
    id: 'STU2025002',
    fullName: 'Marcus Brody',
    name: 'Marcus Brody',
    dob: '2004-09-25',
    gender: 'Male',
    email: 'marcus.brody@campus.edu',
    phone: '+1 (555) 876-5432',
    address: '1088 Ocean Drive, Suite 2A',
    major: 'Business Administration',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    degree: 'Bachelor of Arts',
    year: 'Year 2 (Sophomore)',
    gpa: 2.35,
    status: 'probation',
    advisor: {
      name: 'Prof. Margaret Hamilton',
      email: 'm.hamilton@campus.edu',
      department: 'School of Business'
    },
    creditsEarned: 42,
    totalCreditsRequired: 120,
    financialStatus: 'pending_payment',
    enrollmentDate: '2024-09-01',
    enrolledCourses: [
      { code: 'BUS201', title: 'Financial Accounting', credits: 3, grade: 'C-', term: 'Fall 2025' },
      { code: 'ECON102', title: 'Macroeconomics', credits: 3, grade: 'D+', term: 'Fall 2025' },
      { code: 'MKT301', title: 'Principles of Marketing', credits: 3, grade: 'B', term: 'Spring 2026' }
    ],
    documents: [
      { id: 'DOC-201', name: 'Academic_Improvement_Plan.pdf', type: 'PDF Document', uploadDate: '2026-01-10', size: '640 KB' },
      { id: 'DOC-202', name: 'Fee_Deferral_Request.pdf', type: 'PDF Document', uploadDate: '2026-02-01', size: '310 KB' }
    ],
    notes: 'Requires mandatory bi-weekly academic check-ins with peer tutor.'
  },
  {
    id: 'STU2025003',
    fullName: 'Sofia Rodriguez',
    name: 'Sofia Rodriguez',
    dob: '2001-11-03',
    gender: 'Female',
    email: 'sofia.rodriguez@campus.edu',
    phone: '+1 (555) 345-6789',
    address: '450 University Ave, Apt 14B',
    major: 'Data Analytics',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    degree: 'Master of Science',
    year: 'Year 1 (Graduate)',
    gpa: 3.92,
    status: 'active',
    advisor: {
      name: 'Dr. Sarah Connor',
      email: 's.connor@campus.edu',
      department: 'Graduate School of Engineering'
    },
    creditsEarned: 18,
    totalCreditsRequired: 36,
    financialStatus: 'clear',
    enrollmentDate: '2025-09-01',
    enrolledCourses: [
      { code: 'DATA601', title: 'Big Data Processing Frameworks', credits: 4, grade: 'A', term: 'Fall 2025' },
      { code: 'DATA620', title: 'Predictive Modeling & ML', credits: 4, grade: 'A', term: 'Fall 2025' }
    ],
    documents: [
      { id: 'DOC-301', name: 'F1_Visa_Verification.pdf', type: 'PDF Document', uploadDate: '2025-07-12', size: '2.1 MB' },
      { id: 'DOC-302', name: 'Grad_Assistantship_Contract.pdf', type: 'PDF Document', uploadDate: '2025-08-25', size: '1.1 MB' }
    ],
    notes: 'International student on F-1 visa. Graduate Teaching Assistant for DATA101.'
  },
  {
    id: 'STU2025004',
    fullName: 'Liam O\'Connor',
    name: 'Liam O\'Connor',
    dob: '2003-01-18',
    gender: 'Male',
    email: 'liam.oconnor@campus.edu',
    phone: '+1 (555) 987-6543',
    address: '88 Engineering Blvd, Dorm Room 302',
    major: 'Mechanical Engineering',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    degree: 'Bachelor of Science',
    year: 'Year 3 (Junior)',
    gpa: 3.45,
    status: 'active',
    advisor: {
      name: 'Dr. Nikola Tesla',
      email: 'n.tesla@campus.edu',
      department: 'Department of Mechanical Engineering'
    },
    creditsEarned: 76,
    totalCreditsRequired: 128,
    financialStatus: 'clear',
    enrollmentDate: '2023-09-01',
    enrolledCourses: [
      { code: 'ME301', title: 'Fluid Dynamics', credits: 4, grade: 'B+', term: 'Fall 2025' },
      { code: 'ME315', title: 'Thermodynamics II', credits: 4, grade: 'A-', term: 'Fall 2025' }
    ],
    documents: [
      { id: 'DOC-401', name: 'Internship_Approval_Form.pdf', type: 'PDF Document', uploadDate: '2026-05-10', size: '900 KB' }
    ],
    notes: 'Active member of Formula Student Racing team.'
  },
  {
    id: 'STU2025005',
    fullName: 'Aisha Patel',
    name: 'Aisha Patel',
    dob: '2002-08-30',
    gender: 'Female',
    email: 'aisha.patel@campus.edu',
    phone: '+1 (555) 456-7890',
    address: '12 International Way, Room 101',
    major: 'International Relations',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    degree: 'Bachelor of Arts',
    year: 'Year 4 (Senior)',
    gpa: 3.78,
    status: 'leave_of_absence',
    advisor: {
      name: 'Prof. Kofi Annan',
      email: 'k.annan@campus.edu',
      department: 'School of Humanities & Global Affairs'
    },
    creditsEarned: 98,
    totalCreditsRequired: 120,
    financialStatus: 'clear',
    enrollmentDate: '2022-09-01',
    enrolledCourses: [
      { code: 'INTL410', title: 'Global Conflict Resolution', credits: 3, grade: 'A', term: 'Spring 2025' }
    ],
    documents: [
      { id: 'DOC-501', name: 'Leave_Of_Absence_Approval.pdf', type: 'PDF Document', uploadDate: '2026-01-15', size: '540 KB' }
    ],
    notes: 'On approved study-abroad internship semester in Geneva until Fall 2026.'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-8901',
    studentId: 'STU2025001',
    fullName: 'Alexandra Chen',
    studentName: 'Alexandra Chen',
    studentEmail: 'alexandra.chen@campus.edu',
    major: 'Computer Science',
    enquiryCategory: 'Academic',
    category: 'Academic',
    enquiryDate: '2026-07-25',
    createdAt: '2026-07-25 10:14 AM',
    enquiryUrgency: 'High',
    priority: 'high',
    enquiryStatus: 'In Progress',
    status: 'in_progress',
    description: 'I need an advisor override to register for CS499 Senior Capstone while completing my remaining linear algebra requirement.',
    assignedStaff: 'David Vance',
    assignedTo: 'David Vance',
    attachmentFile: 'Override_Request_Signed.pdf',
    subject: 'Senior Capstone Advisor Pre-requisite Override',
    updatedAt: '2026-07-26 02:30 PM',
    lastUpdated: '2026-07-26 02:30 PM',
    responses: [
      {
        id: 'RESP-01',
        senderName: 'Alexandra Chen',
        senderRole: 'student',
        message: 'Hello, I submitted my prerequisite override form attached in my student documents folder.',
        timestamp: '2026-07-25 10:14 AM'
      },
      {
        id: 'RESP-02',
        senderName: 'David Vance',
        senderRole: 'admin',
        message: 'Hi Alexandra, I have verified your GPA and course records. I forwarded this request to Dr. Alan Turing for formal faculty approval signature.',
        timestamp: '2026-07-26 02:30 PM'
      }
    ]
  },
  {
    id: 'ENQ-8902',
    studentId: 'STU2025002',
    fullName: 'Marcus Brody',
    studentName: 'Marcus Brody',
    studentEmail: 'marcus.brody@campus.edu',
    major: 'Business Administration',
    enquiryCategory: 'Financial',
    category: 'Financial',
    enquiryDate: '2026-07-27',
    createdAt: '2026-07-27 09:00 AM',
    enquiryUrgency: 'Urgent',
    priority: 'urgent',
    enquiryStatus: 'Open',
    status: 'open',
    description: 'Requesting a 14-day extension on my second semester fee installment due to delayed bank transfer processing.',
    assignedStaff: 'Dr. Eleanor Sterling',
    assignedTo: 'Dr. Eleanor Sterling',
    attachmentFile: 'Bank_Transfer_Proof.pdf',
    subject: 'Tuition Installment Payment Plan Extension Request',
    updatedAt: '2026-07-27 09:00 AM',
    lastUpdated: '2026-07-27 09:00 AM',
    responses: []
  },
  {
    id: 'ENQ-8903',
    studentId: 'STU2025003',
    fullName: 'Sofia Rodriguez',
    studentName: 'Sofia Rodriguez',
    studentEmail: 'sofia.rodriguez@campus.edu',
    major: 'Data Analytics',
    enquiryCategory: 'International Student Services',
    category: 'International Student Services',
    enquiryDate: '2026-07-20',
    createdAt: '2026-07-20 11:45 AM',
    enquiryUrgency: 'Medium',
    priority: 'medium',
    enquiryStatus: 'Resolved',
    status: 'resolved',
    description: 'I would like to request an updated I-20 form with OPT recommendation endorsement for my upcoming summer internship in Seattle.',
    assignedStaff: 'David Vance',
    assignedTo: 'David Vance',
    attachmentFile: 'I20_Recommendation_Form.pdf',
    subject: 'OPT Work Authorization Endorsement Document',
    updatedAt: '2026-07-22 04:10 PM',
    lastUpdated: '2026-07-22 04:10 PM',
    responses: []
  },
  {
    id: 'ENQ-8904',
    studentId: 'STU2025004',
    fullName: 'Liam O\'Connor',
    studentName: 'Liam O\'Connor',
    studentEmail: 'liam.oconnor@campus.edu',
    major: 'Mechanical Engineering',
    enquiryCategory: 'Housing',
    category: 'Housing',
    enquiryDate: '2026-07-27',
    createdAt: '2026-07-27 03:20 PM',
    enquiryUrgency: 'Low',
    priority: 'low',
    enquiryStatus: 'Open',
    status: 'open',
    description: 'Requesting a room swap due to study schedule mismatch with current roommate.',
    assignedStaff: 'Housing Office',
    assignedTo: 'Housing Office',
    attachmentFile: 'Room_Swap_Request.pdf',
    subject: 'Room Change Request - Engineering Residence Hall',
    updatedAt: '2026-07-27 03:20 PM',
    lastUpdated: '2026-07-27 03:20 PM',
    responses: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1042',
    enquiryId: 'ENQ-8901',
    studentId: 'STU2025001',
    fullName: 'Alexandra Chen',
    studentName: 'Alexandra Chen',
    studentEmail: 'alexandra.chen@campus.edu',
    enquiryCategory: 'Academic',
    appointmentDate: '2026-07-29',
    appointmentCategory: 'Online',
    category: 'Online',
    type: 'Academic Advising',
    appointmentStatus: 'Scheduled',
    status: 'scheduled',
    assignedStaff: 'Dr. Alan Turing',
    advisorName: 'Dr. Alan Turing',
    scheduledDate: '2026-07-29',
    scheduledTime: '10:00 AM - 10:30 AM',
    time: '10:00 AM - 10:30 AM',
    description: 'Discussion regarding Senior Thesis proposal and Graduate school recommendations.',
    notes: 'Discussion regarding Senior Thesis proposal and Graduate school recommendations.',
    attachmentFile: 'Thesis_Outline.pdf',
    location: 'Online Meeting (Teams)',
    meetingUrl: 'https://meet.campus.edu/cs-advising-turing',
    createdAt: '2026-07-24'
  },
  {
    id: 'APT-1043',
    enquiryId: 'ENQ-8902',
    studentId: 'STU2025002',
    fullName: 'Marcus Brody',
    studentName: 'Marcus Brody',
    studentEmail: 'marcus.brody@campus.edu',
    enquiryCategory: 'Financial',
    appointmentDate: '2026-07-30',
    appointmentCategory: 'Offline',
    category: 'Offline',
    type: 'Financial Aid Consultation',
    appointmentStatus: 'Scheduled',
    status: 'scheduled',
    assignedStaff: 'Prof. Margaret Hamilton',
    advisorName: 'Prof. Margaret Hamilton',
    scheduledDate: '2026-07-30',
    scheduledTime: '02:30 PM - 03:00 PM',
    time: '02:30 PM - 03:00 PM',
    description: 'Mandatory probation review and fee payment deferral structure for Fall 2026.',
    notes: 'Mandatory probation review and course selection adjustment for Fall 2026.',
    attachmentFile: 'Fee_Deferral_Letter.pdf',
    location: 'Student Success Center - Booth 12',
    createdAt: '2026-07-26'
  },
  {
    id: 'APT-1044',
    enquiryId: 'ENQ-8903',
    studentId: 'STU2025003',
    fullName: 'Sofia Rodriguez',
    studentName: 'Sofia Rodriguez',
    studentEmail: 'sofia.rodriguez@campus.edu',
    enquiryCategory: 'International Student Services',
    appointmentDate: '2026-07-28',
    appointmentCategory: 'Online',
    category: 'Online',
    type: 'Visa & Immigration',
    appointmentStatus: 'Completed',
    status: 'completed',
    assignedStaff: 'Elena Rostova',
    advisorName: 'Elena Rostova',
    scheduledDate: '2026-07-28',
    scheduledTime: '11:00 AM - 11:30 AM',
    time: '11:00 AM - 11:30 AM',
    description: 'STEM OPT Extension checklist guidance provided. Student clear to proceed.',
    notes: 'STEM OPT Extension checklist guidance provided. Student clear to proceed.',
    attachmentFile: 'OPT_Checklist.pdf',
    location: 'Virtual Zoom Meeting',
    meetingUrl: 'https://meet.campus.edu/iss-vantage-3',
    createdAt: '2026-07-21'
  },
  {
    id: 'APT-1045',
    enquiryId: 'ENQ-8904',
    studentId: 'STU2025004',
    fullName: 'Liam O\'Connor',
    studentName: 'Liam O\'Connor',
    studentEmail: 'liam.oconnor@campus.edu',
    enquiryCategory: 'Housing',
    appointmentDate: '2026-08-02',
    appointmentCategory: 'Offline',
    category: 'Offline',
    type: 'Career Counseling',
    appointmentStatus: 'Scheduled',
    status: 'scheduled',
    assignedStaff: 'James Henderson',
    advisorName: 'James Henderson',
    scheduledDate: '2026-08-02',
    scheduledTime: '03:00 PM - 03:30 PM',
    time: '03:00 PM - 03:30 PM',
    description: 'Resume review and mock interview for Automotive Engineering Internship.',
    notes: 'Resume review and mock interview for Automotive Engineering Internship.',
    attachmentFile: 'Engineering_Resume.pdf',
    location: 'Career Center - Office 204',
    createdAt: '2026-07-27'
  },
  {
    id: 'APT-1046',
    enquiryId: 'ENQ-4921',
    studentId: 'STU2025006',
    fullName: 'Nguyen Van A',
    studentName: 'Nguyen Van A',
    studentEmail: 'nguyen.vana@campus.edu',
    enquiryCategory: 'Academic',
    appointmentDate: '2026-08-03',
    appointmentCategory: 'Online',
    category: 'Course Enrollment Guidance',
    type: 'Course Enrollment Guidance',
    appointmentStatus: 'Scheduled',
    status: 'scheduled',
    assignedStaff: 'Dr. Alan Turing',
    advisorName: 'Dr. Alan Turing',
    scheduledDate: '2026-08-03',
    scheduledTime: '09:30 AM',
    time: '09:30 AM',
    description: 'Guidance session on course selection and credit enrollment for Fall 2026.',
    notes: 'Guidance session on course selection and credit enrollment for Fall 2026.',
    attachmentFile: 'Course_Plan.pdf',
    location: 'Online Meeting (MS Teams)',
    meetingUrl: 'https://meet.campus.edu/guidance-nguyen',
    createdAt: '2026-07-28'
  },
  {
    id: 'APT-1047',
    enquiryId: 'ENQ-5002',
    studentId: 'STU2025007',
    fullName: 'Elena Rodriguez',
    studentName: 'Elena Rodriguez',
    studentEmail: 'elena.rodriguez@campus.edu',
    enquiryCategory: 'Academic',
    appointmentDate: '2026-08-03',
    appointmentCategory: 'Online',
    category: 'Special Consideration Query',
    type: 'Special Consideration Query',
    appointmentStatus: 'Pending',
    status: 'pending',
    assignedStaff: 'Dr. Alan Turing',
    advisorName: 'Dr. Alan Turing',
    scheduledDate: '2026-08-03',
    scheduledTime: '11:15 AM',
    time: '11:15 AM',
    description: 'Special consideration application review for mid-semester assessment deferral.',
    notes: 'Special consideration application review for mid-semester assessment deferral.',
    attachmentFile: 'Medical_Cert.pdf',
    location: 'Online Meeting (MS Teams)',
    meetingUrl: 'https://meet.campus.edu/special-elena',
    createdAt: '2026-07-29'
  },
  {
    id: 'APT-1048',
    enquiryId: 'ENQ-4889',
    studentId: 'STU2025008',
    fullName: 'Park Ji-Min',
    studentName: 'Park Ji-Min',
    studentEmail: 'park.jimin@campus.edu',
    enquiryCategory: 'Academic',
    appointmentDate: '2026-08-03',
    appointmentCategory: 'Offline',
    category: 'Academic Credit Transfer',
    type: 'Academic Credit Transfer',
    appointmentStatus: 'Scheduled',
    status: 'scheduled',
    assignedStaff: 'Dr. Alan Turing',
    advisorName: 'Dr. Alan Turing',
    scheduledDate: '2026-08-03',
    scheduledTime: '02:45 PM',
    time: '02:45 PM',
    description: 'Review of credit transfer application from exchange program at Seoul National University.',
    notes: 'Review of credit transfer application from exchange program.',
    attachmentFile: 'Transcript_Transfer.pdf',
    location: 'Student Success Center - Room 302',
    createdAt: '2026-07-30'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-901',
    actorName: 'David Vance',
    actorRole: 'admin',
    action: 'UPDATE_ENQUIRY_STATUS',
    details: 'Changed status of ENQ-8903 (OPT Work Authorization) to Resolved',
    timestamp: '2026-07-26 02:30 PM'
  },
  {
    id: 'LOG-902',
    actorName: 'Dr. Eleanor Sterling',
    actorRole: 'manager',
    action: 'SYSTEM_CONFIG',
    details: 'Updated Advisor Workload Limits & Auto-Assignment rules for Fall 2026',
    timestamp: '2026-07-26 09:12 AM'
  },
  {
    id: 'LOG-903',
    actorName: 'Alexandra Chen',
    actorRole: 'student',
    action: 'CREATE_APPOINTMENT',
    details: 'Booked Academic Advising appointment APT-1042 with Dr. Alan Turing',
    timestamp: '2026-07-24 04:15 PM'
  },
  {
    id: 'LOG-904',
    actorName: 'Marcus Brody',
    actorRole: 'student',
    action: 'CREATE_ENQUIRY',
    details: 'Submitted urgent Financial enquiry ENQ-8902 regarding tuition extension',
    timestamp: '2026-07-27 09:00 AM'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOTIF-01',
    title: 'Enquiry Response',
    message: 'David Vance responded to your enquiry ENQ-8901 (Senior Capstone Override).',
    timestamp: '10 mins ago',
    read: false,
    type: 'enquiry'
  },
  {
    id: 'NOTIF-02',
    title: 'Upcoming Appointment',
    message: 'Your advising meeting with Dr. Alan Turing is scheduled for tomorrow at 10:00 AM.',
    timestamp: '2 hours ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'NOTIF-03',
    title: 'Academic Alert Flag',
    message: '1 student currently requires probation check-in review (Marcus Brody).',
    timestamp: '1 day ago',
    read: true,
    type: 'student'
  }
];

export const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: 'FB-1001',
    userId: 'USR-STUDENT-01',
    userName: 'Alexandra Chen',
    userEmail: 'alexandra.chen@campus.edu',
    userRole: 'student',
    rating: 5,
    category: 'Advisory Services',
    subject: 'Excellent Academic Advising Session',
    content: 'Dr. Alan Turing was exceptionally helpful in assisting me with my degree progression and capstone project options. Smooth scheduling interface!',
    isAnonymous: false,
    status: 'Acknowledged',
    createdAt: '2026-07-28',
    responseNote: 'Thank you for your feedback! Glad your advisory session went well.',
    respondedBy: 'Dr. Eleanor Sterling',
    respondedAt: '2026-07-28'
  },
  {
    id: 'FB-1002',
    userId: 'STU2025002',
    userName: 'Marcus Brody',
    userEmail: 'marcus.brody@campus.edu',
    userRole: 'student',
    rating: 4,
    category: 'Portal Usability',
    subject: 'Fast enquiry resolution response time',
    content: 'The triage speed for financial support enquiries has improved greatly. I received a response within 2 hours.',
    isAnonymous: false,
    status: 'Implemented',
    createdAt: '2026-07-27',
    responseNote: 'Appreciate your note! Our triage workflow is now fully optimized.',
    respondedBy: 'David Vance',
    respondedAt: '2026-07-27'
  },
  {
    id: 'FB-1003',
    userId: 'ANON-99',
    userName: 'Anonymous Student',
    userEmail: 'anonymous@campus.edu',
    userRole: 'student',
    rating: 4,
    category: 'Facilities',
    subject: 'Library Quiet Study Zone Request',
    content: 'Would appreciate extended hours for the 3rd floor quiet study area during midterm examination week.',
    isAnonymous: true,
    status: 'Under Review',
    createdAt: '2026-07-29'
  }
];

// Helper functions for persistent state management
const STORAGE_KEYS = {
  CURRENT_USER: 'campus_connect_user',
  STUDENTS: 'campus_connect_students',
  ENQUIRIES: 'campus_connect_enquiries',
  APPOINTMENTS: 'campus_connect_appointments',
  AUDIT_LOGS: 'campus_connect_audit_logs',
  NOTIFICATIONS: 'campus_connect_notifications',
  FEEDBACK: 'campus_connect_feedback'
};

export function loadData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const StorageManager = {
  getCurrentUser: (): User => loadData(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]),
  setCurrentUser: (user: User) => saveData(STORAGE_KEYS.CURRENT_USER, user),

  getStudents: (): Student[] => loadData(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
  setStudents: (students: Student[]) => saveData(STORAGE_KEYS.STUDENTS, students),

  getEnquiries: (): Enquiry[] => loadData(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES),
  setEnquiries: (enquiries: Enquiry[]) => saveData(STORAGE_KEYS.ENQUIRIES, enquiries),

  getAppointments: (): Appointment[] => loadData(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  setAppointments: (appointments: Appointment[]) => saveData(STORAGE_KEYS.APPOINTMENTS, appointments),

  getAuditLogs: (): AuditLog[] => loadData(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  setAuditLogs: (logs: AuditLog[]) => saveData(STORAGE_KEYS.AUDIT_LOGS, logs),

  getNotifications: (): Notification[] => loadData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (notifs: Notification[]) => saveData(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getFeedback: (): FeedbackEntry[] => loadData(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK),
  setFeedback: (feedback: FeedbackEntry[]) => saveData(STORAGE_KEYS.FEEDBACK, feedback)
};

