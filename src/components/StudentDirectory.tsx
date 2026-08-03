import React, { useState } from 'react';
import { Student, User, Enquiry, StudentDocument } from '../types';
import { Search, Plus, Edit3, Trash2, Save, X, ArrowLeft, UserCheck, Calendar, Phone, Mail, MapPin, GraduationCap } from 'lucide-react';

interface StudentDirectoryProps {
  students: Student[];
  enquiries?: Enquiry[];
  currentUser: User;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToEnquiry?: (enquiryId: string) => void;
  onNewEnquiryForStudent?: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  enquiries = [],
  currentUser,
  onUpdateStudent,
  onDeleteStudent,
  searchQuery,
  setSearchQuery,
  onNavigateToEnquiry,
  onNewEnquiryForStudent
}) => {
  // Mode: 'list' (Frame 1) vs 'detail' (Frame 2)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Form editing state for Frame 2 (Student Detail)
  const [formData, setFormData] = useState<{
    id: string;
    fullName: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    email: string;
    phone: string;
    address: string;
    major: string;
  }>({
    id: '',
    fullName: '',
    dob: '',
    gender: 'Female',
    email: '',
    phone: '',
    address: '',
    major: ''
  });

  const [subSearchQuery, setSubSearchQuery] = useState('');

  // Selected student object
  const activeStudent = students.find((s) => s.id === selectedStudentId);

  // Automatically open student's own detail profile view directly if logged in as student
  React.useEffect(() => {
    if (currentUser.role === 'student') {
      const selfStudent = students.find((s) =>
        (currentUser.studentId && s.id === currentUser.studentId) ||
        (s.email.toLowerCase() === currentUser.email.toLowerCase())
      ) || students[0];

      if (selfStudent) {
        setSelectedStudentId(selfStudent.id);
        setFormData({
          id: selfStudent.id,
          fullName: selfStudent.fullName || selfStudent.name,
          dob: selfStudent.dob || '2002-05-14',
          gender: selfStudent.gender || 'Female',
          email: selfStudent.email,
          phone: selfStudent.phone || '+1 (555) 234-5678',
          address: selfStudent.address || '123 University Campus Way, Building A',
          major: selfStudent.major
        });
        setViewMode('detail');
      }
    }
  }, [currentUser, students]);

  // Filter students for table view
  const filteredStudents = students.filter((student) => {
    // If logged in as student, ONLY show their own record per RBAC matrix (R*)
    if (currentUser.role === 'student') {
      const isSelf = (currentUser.studentId && student.id === currentUser.studentId) ||
                     (student.email.toLowerCase() === currentUser.email.toLowerCase());
      if (!isSelf) return false;
    }

    const q = searchQuery.toLowerCase();
    const studentName = student.fullName || student.name;
    return (
      student.id.toLowerCase().includes(q) ||
      studentName.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.major.toLowerCase().includes(q) ||
      (student.phone && student.phone.toLowerCase().includes(q))
    );
  });

  // Filter enquiries for the sub-table in Frame 2
  const studentEnquiries = enquiries.filter((e) => {
    if (!selectedStudentId) return false;
    const isMatchingStudent = e.studentId === selectedStudentId || (activeStudent && e.studentEmail === activeStudent.email);
    if (!isMatchingStudent) return false;

    if (!subSearchQuery.trim()) return true;
    const q = subSearchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.status.toLowerCase().includes(q) ||
      e.assignedTo.toLowerCase().includes(q)
    );
  });

  // Action handlers
  const handleOpenDetail = (student: Student) => {
    setSelectedStudentId(student.id);
    setFormData({
      id: student.id,
      fullName: student.fullName || student.name,
      dob: student.dob || '2002-05-14',
      gender: student.gender || 'Female',
      email: student.email,
      phone: student.phone || '+1 (555) 234-5678',
      address: student.address || '123 University Campus Way, Building A',
      major: student.major
    });
    setViewMode('detail');
  };

  const handleCreateNewStudent = () => {
    const newId = `STU202500${students.length + 1}`;
    const newStudentData = {
      id: newId,
      fullName: 'New Student Name',
      dob: '2003-01-01',
      gender: 'Male' as const,
      email: `student${students.length + 1}@uni.edu`,
      phone: '+1 (555) 000-0000',
      address: 'University Dorms Block C',
      major: 'B.Sc. Computer Science'
    };
    setFormData(newStudentData);
    setSelectedStudentId(newId);

    // Save initial stub into state
    const created: Student = {
      id: newId,
      name: newStudentData.fullName,
      fullName: newStudentData.fullName,
      dob: newStudentData.dob,
      gender: newStudentData.gender,
      email: newStudentData.email,
      phone: newStudentData.phone,
      address: newStudentData.address,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      major: newStudentData.major,
      degree: 'Bachelor of Science',
      year: 'Year 1 (Freshman)',
      gpa: 3.80,
      status: 'active',
      advisor: {
        name: 'Dr. Alan Turing',
        email: 'a.turing@campus.edu',
        department: 'School of Computing'
      },
      creditsEarned: 15,
      totalCreditsRequired: 120,
      financialStatus: 'clear',
      enrollmentDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [],
      documents: []
    };
    onUpdateStudent(created);
    setViewMode('detail');
  };

  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    const updated: Student = {
      ...activeStudent,
      name: formData.fullName,
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      major: formData.major
    };
    onUpdateStudent(updated);
    setViewMode('list');
  };

  const handleDelete = () => {
    if (!selectedStudentId) return;
    if (confirm(`Are you sure you want to delete student record ${selectedStudentId}?`)) {
      if (onDeleteStudent) {
        onDeleteStudent(selectedStudentId);
      }
      setViewMode('list');
      setSelectedStudentId(null);
    }
  };

  // ==========================================
  // FRAME 1: STUDENTS TABLE VIEW (For Admin, Support Officers & Managers)
  // ==========================================
  if (viewMode === 'list' && currentUser.role !== 'student') {
    return (
      <div className="space-y-4">
        {/* Page Header Title */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Students
            </h1>
            <p className="text-xs text-slate-500">Student Directory & Personal Details View</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200">
            {filteredStudents.length} Records
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
                placeholder="Search StudentID, Name, Email..."
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
            {currentUser.role !== 'student' && (
              <button
                onClick={handleCreateNewStudent}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            )}
            <button
              disabled={!selectedStudentId}
              onClick={() => {
                if (selectedStudentId) {
                  const st = students.find((s) => s.id === selectedStudentId);
                  if (st) handleOpenDetail(st);
                }
              }}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>

        {/* Main Students Table (Frame 1 Columns: StudentID, FullName, DOB, Gender, Email, Phone, Address, Major) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">StudentID</th>
                  <th className="py-3 px-4">FullName</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Major</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentId === student.id;
                    const displayName = student.fullName || student.name;
                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        onDoubleClick={() => handleOpenDetail(student)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {student.id}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {displayName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {student.dob || '2002-05-14'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {student.gender || 'Female'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {student.email}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {student.phone || '+1 (555) 234-5678'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                          {student.address || '123 University Campus Way'}
                        </td>
                        <td className="py-3 px-4 text-slate-900 dark:text-slate-200 font-medium">
                          {student.major}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(student);
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors"
                          >
                            View Record
                          </button>
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
  // FRAME 2: STUDENT DETAIL FORM & SUB-TABLE
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Back */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentUser.role !== 'student' && (
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentUser.role === 'student' ? 'My Student Profile' : 'Student Record'}
            </h1>
            <p className="text-xs text-slate-500">
              {currentUser.role === 'student' ? 'Personal Details & Official Academic Information' : `Editing Record: ${formData.id}`}
            </p>
          </div>
        </div>

        {currentUser.role !== 'student' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={handleSaveDetail}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Student
            </button>
          </div>
        )}
      </div>

      {/* Frame 2 Upper Section: Student Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Personal Information Details
          </h2>
          {currentUser.role === 'student' && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[11px] font-semibold rounded-full border border-amber-200 dark:border-amber-800">
              Read-Only Access (Student)
            </span>
          )}
        </div>

        <form onSubmit={handleSaveDetail} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Student ID
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
              Full Name
            </label>
            <input
              type="text"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 font-medium ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              DOB (Date of Birth)
            </label>
            <input
              type="date"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              disabled={currentUser.role === 'student'}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Major / Degree Program
            </label>
            <input
              type="text"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Home Address
            </label>
            <input
              type="text"
              required
              readOnly={currentUser.role === 'student'}
              disabled={currentUser.role === 'student'}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                currentUser.role === 'student'
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
