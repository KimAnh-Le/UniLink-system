import React, { useState } from 'react';
import { Enquiry, EnquiryCategory, EnquiryPriority, EnquiryStatus, User, Appointment, Student } from '../types';
import { Search, Plus, Edit3, Trash2, Save, ArrowLeft, Paperclip, Send, FileText, Upload, Calendar, Clock, CheckCircle2, Lock, Eye, X, Download, Printer, FileCheck } from 'lucide-react';

interface EnquiryManagerProps {
  enquiries: Enquiry[];
  appointments?: Appointment[];
  students?: Student[];
  currentUser: User;
  onUpdateEnquiry: (updated: Enquiry) => void;
  onCreateEnquiry: (newEnquiry: Enquiry) => void;
  onDeleteEnquiry?: (enquiryId: string) => void;
  onNavigateToAppointment?: (appointmentId: string) => void;
  onNewAppointmentForEnquiry?: (enquiry: Enquiry) => void;
  initialSelectedEnquiryId?: string | null;
}

export const EnquiryManager: React.FC<EnquiryManagerProps> = ({
  enquiries,
  appointments = [],
  students = [],
  currentUser,
  onUpdateEnquiry,
  onCreateEnquiry,
  onDeleteEnquiry,
  onNavigateToAppointment,
  onNewAppointmentForEnquiry,
  initialSelectedEnquiryId = null
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(initialSelectedEnquiryId ? 'detail' : 'list');
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(initialSelectedEnquiryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileModalData, setFileModalData] = useState<{
    fileName: string;
    studentName?: string;
    studentId?: string;
    enquiryId?: string;
    category?: string;
    description?: string;
  } | null>(null);

  // Response reply state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Form State for Frame 4 (Enquiry Detail)
  const [formData, setFormData] = useState<{
    id: string;
    studentId: string;
    fullName: string;
    major: string;
    category: EnquiryCategory;
    date: string;
    status: EnquiryStatus;
    assignedTo: string;
    urgency: EnquiryPriority;
    attachmentFile?: string;
    description: string;
    lastUpdated: string;
  }>({
    id: '',
    studentId: '',
    fullName: '',
    major: '',
    category: 'Academic',
    date: new Date().toISOString().split('T')[0],
    status: 'open',
    assignedTo: 'Unassigned',
    urgency: 'medium',
    attachmentFile: 'Course_Prerequisite_Transcript.pdf',
    description: '',
    lastUpdated: ''
  });

  const activeEnquiry = enquiries.find((e) => e.id === selectedEnquiryId);

  // Filter main enquiries table (Frame 3)
  const filteredEnquiries = enquiries.filter((e) => {
    // If student, filter by their own email or ID
    if (currentUser.role === 'student' && e.studentEmail !== currentUser.email && e.studentId !== currentUser.studentId) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.studentId.toLowerCase().includes(q) ||
      (e.studentName || e.fullName || '').toLowerCase().includes(q) ||
      (e.major && e.major.toLowerCase().includes(q)) ||
      (e.category || e.enquiryCategory || '').toLowerCase().includes(q) ||
      (e.status || e.enquiryStatus || '').toLowerCase().includes(q) ||
      (e.assignedTo || e.assignedStaff || '').toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  });

  // Filter sub-appointments table for Frame 4
  const enquiryAppointments = appointments.filter((a) => {
    if (!selectedEnquiryId) return false;
    const matchesEnquiry = a.enquiryId === selectedEnquiryId || (activeEnquiry && a.studentId === activeEnquiry.studentId);
    if (!matchesEnquiry) return false;

    if (!subSearchQuery.trim()) return true;
    const q = subSearchQuery.toLowerCase();
    return (
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.status.toLowerCase().includes(q) ||
      (a.advisorName || '').toLowerCase().includes(q)
    );
  });

  const handleOpenDetail = (enquiry: Enquiry) => {
    setIsCreatingNew(false);
    setSelectedEnquiryId(enquiry.id);
    setErrorMessage(null);
    const sName = enquiry.studentName || enquiry.fullName || '';
    const updatedTime = enquiry.lastUpdated || enquiry.updatedAt || enquiry.enquiryDate || 'Just now';
    setFormData({
      id: enquiry.id,
      studentId: enquiry.studentId,
      fullName: sName,
      major: enquiry.major || 'B.Sc. Computer Science',
      category: (enquiry.category || enquiry.enquiryCategory) as EnquiryCategory,
      date: enquiry.enquiryDate || enquiry.createdAt?.split(' ')[0] || new Date().toISOString().split('T')[0],
      status: (enquiry.status || enquiry.enquiryStatus) as EnquiryStatus,
      assignedTo: enquiry.assignedTo || enquiry.assignedStaff || 'Administrative Services Desk',
      urgency: (enquiry.enquiryUrgency || enquiry.priority || 'medium') as EnquiryPriority,
      attachmentFile: enquiry.attachmentFile || 'Transcript_Document.pdf',
      description: enquiry.description || '',
      lastUpdated: updatedTime
    });
    setViewMode('detail');
  };

  const handleCreateNewEnquiry = () => {
    if (currentUser.role === 'admin' || currentUser.role === 'officer' || (currentUser.role as string) === 'sso') {
      setErrorMessage('Error: SSO Officers and Administrators cannot create enquiries on behalf of students.');
      return;
    }
    setIsCreatingNew(true);
    setSelectedEnquiryId(null);
    setErrorMessage(null);
    const newId = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentObj = (currentUser.role === 'student'
      ? students.find(s => s.id === currentUser.studentId || s.email === currentUser.email)
      : null) || students[0] || {
      id: currentUser.studentId || 'STU2025001',
      fullName: currentUser.name,
      name: currentUser.name,
      email: currentUser.email,
      major: 'Computer Science'
    };

    const sName = studentObj.fullName || studentObj.name;
    const realTimeIsoDate = new Date().toLocaleDateString('en-CA');

    setFormData({
      id: newId,
      studentId: studentObj.id,
      fullName: sName,
      major: studentObj.major || 'Computer Science',
      category: '',
      date: realTimeIsoDate,
      status: 'open',
      assignedTo: 'Administrative Services Desk',
      urgency: 'medium',
      attachmentFile: '',
      description: '',
      lastUpdated: 'Just now'
    });
    setViewMode('detail');
  };

  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || formData.category.trim() === '' || formData.category.startsWith('--')) {
      setErrorMessage('Error: Enquiry Category is required! Please select a category before submitting your enquiry.');
      return;
    }
    if (!formData.description || formData.description.trim() === '') {
      setErrorMessage('Error: Description is required! Please enter details in the enquiry description field before submitting.');
      return;
    }
    setErrorMessage(null);

    const nowFormatted = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isCreatingNew) {
      const studentObj = (currentUser.role === 'student'
        ? students.find(s => s.id === currentUser.studentId || s.email === currentUser.email)
        : null) || students[0] || {
        id: currentUser.studentId || 'STU2025001',
        fullName: currentUser.name,
        name: currentUser.name,
        email: currentUser.email,
        major: 'Computer Science'
      };

      const sName = studentObj.fullName || studentObj.name;

      const newEnquiry: Enquiry = {
        id: formData.id,
        studentId: formData.studentId,
        fullName: formData.fullName || sName,
        studentName: formData.fullName || sName,
        studentEmail: studentObj.email,
        major: formData.major || studentObj.major || 'Computer Science',
        enquiryCategory: formData.category,
        category: formData.category,
        subject: formData.category ? `${formData.category} Assistance Request` : 'New Student Enquiry',
        description: formData.description,
        enquiryStatus: formData.status,
        status: formData.status,
        priority: formData.urgency,
        enquiryUrgency: formData.urgency,
        assignedStaff: formData.assignedTo,
        assignedTo: formData.assignedTo,
        attachmentFile: formData.attachmentFile || 'Document_Attachment.pdf',
        createdAt: formData.date,
        enquiryDate: formData.date,
        updatedAt: nowFormatted,
        lastUpdated: nowFormatted,
        responses: [
          {
            id: `RESP-${Date.now()}`,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            message: 'Initial enquiry ticket opened.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };

      onCreateEnquiry(newEnquiry);
      setIsCreatingNew(false);
      setSelectedEnquiryId(newEnquiry.id);
      setViewMode('list');
    } else {
      if (!activeEnquiry) return;
      const updated: Enquiry = {
        ...activeEnquiry,
        category: formData.category,
        status: formData.status,
        assignedTo: formData.assignedTo,
        priority: formData.urgency,
        enquiryUrgency: formData.urgency,
        attachmentFile: formData.attachmentFile,
        major: formData.major,
        description: formData.description,
        enquiryDate: formData.date,
        lastUpdated: nowFormatted,
        updatedAt: nowFormatted
      };

      onUpdateEnquiry(updated);
      setViewMode('list');
    }
  };

  const handleDelete = () => {
    if (!selectedEnquiryId) return;
    if (currentUser.role === 'admin' || currentUser.role === 'officer' || (currentUser.role as string) === 'sso') {
      alert('Administrators and SSO Officers cannot delete student enquiries.');
      return;
    }
    if (confirm(`Are you sure you want to delete enquiry ticket ${selectedEnquiryId}?`)) {
      if (onDeleteEnquiry) {
        onDeleteEnquiry(selectedEnquiryId);
      }
      setViewMode('list');
      setSelectedEnquiryId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setFormData({ ...formData, attachmentFile: fileName });
    }
  };

  const handleSendResponse = () => {
    if (!activeEnquiry || !replyText.trim()) return;

    const newResp = {
      id: `RESP-${Date.now()}`,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternalNote: isInternalNote
    };

    const updated: Enquiry = {
      ...activeEnquiry,
      responses: [...(activeEnquiry.responses || []), newResp],
      updatedAt: 'Just now'
    };

    onUpdateEnquiry(updated);
    setReplyText('');
    setIsInternalNote(false);
  };

  // ==========================================
  // FRAME 3: ENQUIRIES TABLE VIEW
  // ==========================================
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {/* Page Header Title */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enquiries
            </h1>
            <p className="text-xs text-slate-500">Student Enquiry Tickets & Service Requests View</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200">
            {filteredEnquiries.length} Enquiries
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
                placeholder="Search EnquiryID, StudentID, Staff, Category..."
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
                onClick={handleCreateNewEnquiry}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            )}
            <button
              disabled={!selectedEnquiryId}
              onClick={() => {
                if (selectedEnquiryId) {
                  const enq = enquiries.find((e) => e.id === selectedEnquiryId);
                  if (enq) handleOpenDetail(enq);
                }
              }}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>

        {/* Main Enquiries Table (Frame 3 Columns: EnquiryID, StudentID, FullName, Major, EnquiryCategory, EnquiryDate, EnquiryStatus, Assigned Staff, Last Updated) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">EnquiryID</th>
                  <th className="py-3 px-4">StudentID</th>
                  <th className="py-3 px-4">FullName</th>
                  <th className="py-3 px-4">Major</th>
                  <th className="py-3 px-4">EnquiryCategory</th>
                  <th className="py-3 px-4">EnquiryDate</th>
                  <th className="py-3 px-4">EnquiryStatus</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      No enquiries match current search query.
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => {
                    const isSelected = selectedEnquiryId === enquiry.id;
                    const eDate = enquiry.enquiryDate || enquiry.createdAt?.split(' ')[0] || '';
                    const lastUp = enquiry.lastUpdated || enquiry.updatedAt || eDate;
                    return (
                      <tr
                        key={enquiry.id}
                        onClick={() => setSelectedEnquiryId(enquiry.id)}
                        onDoubleClick={() => handleOpenDetail(enquiry)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {enquiry.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                          {enquiry.studentId}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {enquiry.studentName || enquiry.fullName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {enquiry.major || 'B.Sc. Computer Science'}
                        </td>
                        <td className="py-3 px-4 text-slate-900 dark:text-slate-200 font-medium">
                          {enquiry.category || enquiry.enquiryCategory}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {eDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enquiry.status === 'open'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : enquiry.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {(enquiry.status || 'open').replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {enquiry.assignedTo || enquiry.assignedStaff}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {lastUp}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {enquiry.attachmentFile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFileModalData({
                                    fileName: enquiry.attachmentFile || 'Attachment_Document.pdf',
                                    studentName: enquiry.studentName || enquiry.fullName,
                                    studentId: enquiry.studentId,
                                    enquiryId: enquiry.id,
                                    category: enquiry.category || enquiry.enquiryCategory,
                                    description: enquiry.description
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
                                handleOpenDetail(enquiry);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                            >
                              View Ticket
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
  // FRAME 4: ENQUIRY DETAIL FORM & APPOINTMENTS SUB-TABLE
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
              {isCreatingNew ? 'Submit New Enquiry' : 'Enquiry Detail'}
            </h1>
            <p className="text-xs text-slate-500">
              {isCreatingNew ? 'New Ticket ID: ' : 'Editing Ticket: '}<strong className="text-indigo-600 font-mono">{formData.id}</strong>
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
            Cancel
          </button>
          {!isCreatingNew && currentUser.role !== 'admin' && currentUser.role !== 'officer' && (currentUser.role as string) !== 'sso' && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          <button
            onClick={handleSaveDetail}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> {isCreatingNew ? 'Create Enquiry' : 'Save Enquiry'}
          </button>
        </div>
      </div>

      {/* Frame 4 Upper Section: Enquiry Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Enquiry Detail Record
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {currentUser.role === 'admin' && 'Admin Officer: Triage & General Enquiries Only'}
            {currentUser.role === 'officer' && 'Support Officer: Resolve Complex Assigned Enquiries'}
            {currentUser.role === 'manager' && 'Manager: Escalated Enquiries & Policy Approval'}
            {currentUser.role === 'student' && 'Student Portal: Enquiry Tracking'}
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
              Inquiry ID
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
              StudentID
            </label>
            <input
              type="text"
              readOnly
              value={formData.studentId}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              FullName
            </label>
            <input
              type="text"
              readOnly
              value={formData.fullName}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Major
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              EnquiryCategory <span className="text-red-500 font-extrabold ml-0.5">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value as any });
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="">-- Select Category --</option>
              <option value="Academic">Academic</option>
              <option value="Financial">Financial</option>
              <option value="Housing">Housing</option>
              <option value="International Student Services">International Student Services</option>
              <option value="IT & Portal Support">IT & Portal Support</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              EnquiryDate
            </label>
            <input
              type="date"
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Last Updated
            </label>
            <input
              type="text"
              readOnly
              value={formData.lastUpdated}
              className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              EnquiryStatus
            </label>
            <select
              disabled={currentUser.role === 'student'}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Staff
            </label>
            <input
              type="text"
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              EnquiryUrgency / Priority
            </label>
            <select
              disabled={currentUser.role === 'student'}
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              AttachmentFile
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                  <Paperclip className="w-4 h-4 shrink-0" />
                  <span className="truncate">{formData.attachmentFile || 'No file attached'}</span>
                </span>
                {formData.attachmentFile && (
                  <span className="text-[10px] text-slate-400 font-semibold uppercase shrink-0 ml-2">PDF/Doc</span>
                )}
              </div>

              {formData.attachmentFile && (
                <button
                  type="button"
                  onClick={() => setFileModalData({
                    fileName: formData.attachmentFile || 'Attachment_Document.pdf',
                    studentName: formData.fullName,
                    studentId: formData.studentId,
                    enquiryId: formData.id,
                    category: formData.category,
                    description: formData.description
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

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enquiry Description <span className="text-red-500 font-extrabold ml-0.5">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of student enquiry request..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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
                    Student Record Attachment • {fileModalData.enquiryId || 'ENQ'}
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
                      Office of Academic & Student Support Services
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
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Student Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">{fileModalData.studentName || 'Student Name'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Student ID</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{fileModalData.studentId || 'STU2025001'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Enquiry Category</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{fileModalData.category || 'Academic'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">Upload Date</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">2026-07-30</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
                    Attached Supporting Details
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <p className="font-medium">
                      Official document record attached for ticket enquiry request:
                    </p>
                    <p className="italic text-slate-600 dark:text-slate-400">
                      "{fileModalData.description || 'Prerequisite course waiver request form and academic transcript attached for departmental review.'}"
                    </p>
                    <div className="pt-3 font-mono text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between">
                      <span>Checksum SHA-256: 8f9b4a...e31c</span>
                      <span>1.44 MB</span>
                    </div>
                  </div>
                </div>

                {/* Digital Stamp Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-indigo-500" />
                    <span>FERPA Protected Academic Document</span>
                  </div>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Authorized for Admin & SSO Support Officers
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
