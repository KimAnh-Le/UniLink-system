import React, { useState } from 'react';
import { User, Student, Enquiry, Appointment, AuditLog, Notification, FeedbackEntry } from './types';
import { StorageManager, INITIAL_USERS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SSOModal } from './components/SSOModal';
import { StudentDirectory } from './components/StudentDirectory';
import { EnquiryManager } from './components/EnquiryManager';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { ManagerDashboard } from './components/ManagerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SSODashboard } from './components/SSODashboard';
import { StudentPortalHome } from './components/StudentPortalHome';
import { FeedbackView } from './components/FeedbackView';
import { LoginPage } from './components/LoginPage';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AIChatbot } from './components/AIChatbot';
import { CheckCircle2, LogIn, GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageManager.getCurrentUser());
  const [students, setStudents] = useState<Student[]>(() => StorageManager.getStudents());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => StorageManager.getEnquiries());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageManager.getAppointments());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageManager.getAuditLogs());
  const [notifications, setNotifications] = useState<Notification[]>(() => StorageManager.getNotifications());
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => StorageManager.getFeedback());

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const user = StorageManager.getCurrentUser();
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'officer') return 'sso-dashboard';
    if (user.role === 'manager') return 'manager-dashboard';
    if (user.role === 'student') return 'home';
    return 'students';
  });
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cross navigation tracking state
  const [targetedEnquiryId, setTargetedEnquiryId] = useState<string | null>(null);
  const [targetedAppointmentId, setTargetedAppointmentId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch Role / SSO user
  const handleSwitchUser = (newUser: User) => {
    setCurrentUser(newUser);
    StorageManager.setCurrentUser(newUser);
    setIsLoggedIn(true);

    if (newUser.role === 'student') {
      setActiveTab('home');
    } else if (newUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (newUser.role === 'officer') {
      setActiveTab('sso-dashboard');
    } else if (newUser.role === 'manager') {
      setActiveTab('manager-dashboard');
    } else {
      setActiveTab('students');
    }

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'SSO_AUTHENTICATION',
      details: `User authenticated via ${newUser.ssoProvider}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageManager.setAuditLogs(updatedLogs);

    showToast(`SSO Session active as ${newUser.name} (${newUser.role.toUpperCase()})`);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    showToast(`Logged out of session`);
  };

  const handleLogIn = (user: User) => {
    handleSwitchUser(user);
  };

  // Feedback CRUD
  const handleCreateFeedback = (entry: FeedbackEntry) => {
    const next = [entry, ...feedbackList];
    setFeedbackList(next);
    StorageManager.setFeedback(next);

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'SUBMIT_FEEDBACK',
      details: `Submitted feedback entry [${entry.category}] with rating ${entry.rating}/5`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageManager.setAuditLogs(updatedLogs);

    showToast(`Feedback submitted successfully! Thank you.`);
  };

  const handleUpdateFeedback = (updatedEntry: FeedbackEntry) => {
    const next = feedbackList.map((f) => (f.id === updatedEntry.id ? updatedEntry : f));
    setFeedbackList(next);
    StorageManager.setFeedback(next);

    showToast(`Updated feedback status to [${updatedEntry.status.toUpperCase()}]`);
  };

  // Student CRUD
  const handleUpdateStudent = (updatedStudent: Student) => {
    const exists = students.some((s) => s.id === updatedStudent.id);
    const updatedList = exists
      ? students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      : [updatedStudent, ...students];

    setStudents(updatedList);
    StorageManager.setStudents(updatedList);
    showToast(`Student record ${updatedStudent.id} saved.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    StorageManager.setStudents(updatedList);
    showToast(`Student ${studentId} removed from records.`);
  };

  // Enquiry CRUD
  const handleUpdateEnquiry = (updatedEnquiry: Enquiry) => {
    const updatedList = enquiries.map((e) => (e.id === updatedEnquiry.id ? updatedEnquiry : e));
    setEnquiries(updatedList);
    StorageManager.setEnquiries(updatedList);
    showToast(`Enquiry ticket ${updatedEnquiry.id} updated.`);
  };

  const handleCreateEnquiry = (newEnquiry: Enquiry) => {
    const updatedList = [newEnquiry, ...enquiries];
    setEnquiries(updatedList);
    StorageManager.setEnquiries(updatedList);

    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Student Enquiry Ticket',
      message: `${newEnquiry.studentName} logged ticket: ${newEnquiry.category}`,
      timestamp: 'Just now',
      read: false,
      type: 'enquiry'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageManager.setNotifications(updatedNotifs);

    showToast(`Enquiry ${newEnquiry.id} created.`);
  };

  const handleDeleteEnquiry = (enquiryId: string) => {
    const updatedList = enquiries.filter((e) => e.id !== enquiryId);
    setEnquiries(updatedList);
    StorageManager.setEnquiries(updatedList);
    showToast(`Enquiry ticket ${enquiryId} deleted.`);
  };

  // Appointment CRUD
  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    const updatedList = appointments.map((a) => (a.id === updatedAppt.id ? updatedAppt : a));
    setAppointments(updatedList);
    StorageManager.setAppointments(updatedList);
    showToast(`Appointment ${updatedAppt.id} saved.`);
  };

  const handleCreateAppointment = (newAppt: Appointment) => {
    const updatedList = [newAppt, ...appointments];
    setAppointments(updatedList);
    StorageManager.setAppointments(updatedList);

    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Appointment Booked',
      message: `Session with ${newAppt.advisorName} on ${newAppt.date}.`,
      timestamp: 'Just now',
      read: false,
      type: 'appointment'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageManager.setNotifications(updatedNotifs);

    showToast(`Appointment ${newAppt.id} booked.`);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const updatedList = appointments.filter((a) => a.id !== appointmentId);
    setAppointments(updatedList);
    StorageManager.setAppointments(updatedList);
    showToast(`Appointment ${appointmentId} deleted.`);
  };

  const handleMarkAllNotificationsRead = () => {
    const read = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(read);
    StorageManager.setNotifications(read);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f4f5f8] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 dark:border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            {toastMessage}
          </div>
        )}

        <LoginPage
          onLoginSuccess={(user) => {
            handleLogIn(user);
          }}
          onOpenSSOPortal={() => setIsSSOModalOpen(true)}
        />

        {/* SSO Modal */}
        <SSOModal
          isOpen={isSSOModalOpen}
          onClose={() => setIsSSOModalOpen(false)}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onLogOut={handleLogOut}
          isLoggedIn={isLoggedIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onOpenSSO={() => setIsSSOModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogOut={handleLogOut}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setTargetedEnquiryId(null);
              setTargetedAppointmentId(null);
            }}
            currentUser={currentUser}
            onOpenSSO={() => setIsSSOModalOpen(true)}
            onLogOut={handleLogOut}
          />
        </div>

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-x-hidden">
          {activeTab === 'home' && (
                <StudentPortalHome
                  currentUser={currentUser}
                  students={students}
                  enquiries={enquiries}
                  appointments={appointments}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'students' && (
                <StudentDirectory
                  students={students}
                  enquiries={enquiries}
                  currentUser={currentUser}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onNavigateToEnquiry={(enquiryId) => {
                    setTargetedEnquiryId(enquiryId);
                    setActiveTab('enquiries');
                  }}
                  onNewEnquiryForStudent={(student) => {
                    const sName = student.fullName || student.name;
                    const newEnquiry: Enquiry = {
                      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
                      studentId: student.id,
                      fullName: sName,
                      studentName: sName,
                      studentEmail: student.email,
                      major: student.major,
                      enquiryCategory: 'Academic',
                      category: 'Academic',
                      subject: `New Request for ${sName}`,
                      description: 'Enquiry initiated from Student Directory.',
                      enquiryStatus: 'open',
                      status: 'open',
                      priority: 'medium',
                      enquiryUrgency: 'medium',
                      assignedStaff: 'Academic Services',
                      assignedTo: 'Academic Services',
                      attachmentFile: 'Student_Document.pdf',
                      createdAt: new Date().toISOString().split('T')[0],
                      enquiryDate: new Date().toISOString().split('T')[0],
                      updatedAt: 'Just now',
                      responses: []
                    };
                    handleCreateEnquiry(newEnquiry);
                    setTargetedEnquiryId(newEnquiry.id);
                    setActiveTab('enquiries');
                  }}
                />
              )}

              {activeTab === 'enquiries' && (
                <EnquiryManager
                  enquiries={enquiries}
                  appointments={appointments}
                  students={students}
                  currentUser={currentUser}
                  onUpdateEnquiry={handleUpdateEnquiry}
                  onCreateEnquiry={handleCreateEnquiry}
                  onDeleteEnquiry={handleDeleteEnquiry}
                  initialSelectedEnquiryId={targetedEnquiryId}
                  onNavigateToAppointment={(apptId) => {
                    setTargetedAppointmentId(apptId);
                    setActiveTab('appointments');
                  }}
                  onNewAppointmentForEnquiry={(enq) => {
                    const sName = enq.fullName || enq.studentName || 'Student';
                    const staffName = enq.assignedStaff || enq.assignedTo || 'Dr. Alan Turing';
                    const newAppt: Appointment = {
                      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
                      enquiryId: enq.id,
                      studentId: enq.studentId,
                      fullName: sName,
                      studentName: sName,
                      studentEmail: enq.studentEmail,
                      assignedStaff: staffName,
                      advisorName: staffName,
                      department: 'School of Computing',
                      appointmentCategory: 'Academic Advising',
                      category: 'Academic Advising',
                      type: 'Academic Advising',
                      appointmentDate: new Date().toISOString().split('T')[0],
                      date: new Date().toISOString().split('T')[0],
                      scheduledDate: new Date().toISOString().split('T')[0],
                      time: '10:00 AM',
                      scheduledTime: '10:00 AM',
                      durationMinutes: 30,
                      location: 'Virtual Consultation Office',
                      appointmentStatus: 'scheduled',
                      status: 'scheduled',
                      attachmentFile: 'Enquiry_Followup_Agenda.pdf',
                      notes: `Scheduled regarding enquiry ${enq.id}`,
                      createdAt: new Date().toISOString().split('T')[0]
                    };
                    handleCreateAppointment(newAppt);
                    setTargetedAppointmentId(newAppt.id);
                    setActiveTab('appointments');
                  }}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentScheduler
                  appointments={appointments}
                  currentUser={currentUser}
                  students={students}
                  enquiries={enquiries}
                  onUpdateAppointment={handleUpdateAppointment}
                  onCreateAppointment={handleCreateAppointment}
                  onDeleteAppointment={handleDeleteAppointment}
                  initialSelectedAppointmentId={targetedAppointmentId}
                />
              )}

              {activeTab === 'feedback' && (
                <FeedbackView
                  feedbackList={feedbackList}
                  currentUser={currentUser}
                  onCreateFeedback={handleCreateFeedback}
                  onUpdateFeedback={handleUpdateFeedback}
                />
              )}

              {activeTab === 'admin-dashboard' && (
                <AdminDashboard
                  students={students}
                  enquiries={enquiries}
                  appointments={appointments}
                  auditLogs={auditLogs}
                  currentUser={currentUser}
                  onNavigateTab={setActiveTab}
                  onSelectStudent={(s) => {
                    setSearchQuery(s.name || s.fullName);
                  }}
                />
              )}

              {activeTab === 'sso-dashboard' && (
                <SSODashboard
                  students={students}
                  enquiries={enquiries}
                  appointments={appointments}
                  currentUser={currentUser}
                  onNavigateTab={setActiveTab}
                  onSelectEnquiry={(eId) => {
                    setTargetedEnquiryId(eId);
                  }}
                  onSelectAppointment={(aId) => {
                    setTargetedAppointmentId(aId);
                  }}
                />
              )}

              {activeTab === 'manager-dashboard' && (
                <ManagerDashboard
                  students={students}
                  enquiries={enquiries}
                  appointments={appointments}
                  auditLogs={auditLogs}
                  currentUser={currentUser}
                  onNavigateToStudent={(s) => {
                    setSearchQuery(s.name || s.fullName);
                    setActiveTab('students');
                  }}
                />
              )}
        </main>
      </div>

      {/* SSO Modal */}
      <SSOModal
        isOpen={isSSOModalOpen}
        onClose={() => setIsSSOModalOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogOut={handleLogOut}
        isLoggedIn={isLoggedIn}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* AI Assistant Chatbot */}
      <AIChatbot
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        enquiriesCount={enquiries.length}
        appointmentsCount={appointments.length}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <div>
            <strong>UniLink System</strong> • Student, Admin, SSO & Manager Portal
          </div>
          <div>
            Session Status:{' '}
            <span className={isLoggedIn ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
              {isLoggedIn ? `Authenticated as ${currentUser.email} (${currentUser.role.toUpperCase()})` : 'Logged Out'}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
