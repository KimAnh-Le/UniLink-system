import React, { useState } from 'react';
import { FeedbackEntry, FeedbackCategory, FeedbackStatus, User } from '../types';
import { MessageSquareHeart, Star, Plus, CheckCircle2, UserCheck, ShieldAlert, Send, Filter, Clock, MessageSquare, Trash2 } from 'lucide-react';

interface FeedbackViewProps {
  feedbackList: FeedbackEntry[];
  currentUser: User;
  onCreateFeedback: (entry: FeedbackEntry) => void;
  onUpdateFeedback: (entry: FeedbackEntry) => void;
  onDeleteFeedback?: (feedbackId: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedbackList,
  currentUser,
  onCreateFeedback,
  onUpdateFeedback,
  onDeleteFeedback
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [onlyMine, setOnlyMine] = useState(false);

  // New feedback form state
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<FeedbackCategory>('Advisory Services');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Response form state for admin/staff
  const [activeRespondingId, setActiveRespondingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<FeedbackStatus>('Acknowledged');

  // Metrics
  const totalCount = feedbackList.length;
  const avgRating = totalCount > 0
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1)
    : '5.0';
  const acknowledgedCount = feedbackList.filter((f) => f.status === 'Acknowledged' || f.status === 'Implemented').length;

  // Filtered feedback
  const filteredFeedback = feedbackList.filter((f) => {
    if (onlyMine && f.userId !== currentUser.id && f.userEmail !== currentUser.email) return false;
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    const newEntry: FeedbackEntry = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: isAnonymous ? 'ANON' : currentUser.id,
      userName: isAnonymous ? 'Anonymous Student' : currentUser.name,
      userEmail: isAnonymous ? 'anonymous@campus.edu' : currentUser.email,
      userRole: currentUser.role,
      rating,
      category,
      subject: subject.trim(),
      content: content.trim(),
      isAnonymous,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateFeedback(newEntry);
    setIsSubmitModalOpen(false);
    setSubject('');
    setContent('');
    setRating(5);
    setIsAnonymous(false);
  };

  const handleSaveResponse = (entry: FeedbackEntry) => {
    const updated: FeedbackEntry = {
      ...entry,
      status: responseStatus,
      responseNote: responseText.trim() || entry.responseNote,
      respondedBy: currentUser.name,
      respondedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateFeedback(updated);
    setActiveRespondingId(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-indigo-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <MessageSquareHeart className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Student & Staff Feedback Hub</h1>
              <p className="text-xs text-indigo-200 mt-0.5">
                Share your experiences, rate advisory services, and help us enhance campus support workflows.
              </p>
            </div>
          </div>
        </div>

        {currentUser.role === 'student' && (
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Submit Feedback
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{avgRating} / 5.0</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Overall Satisfaction Score</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Total Feedback Submissions</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{acknowledgedCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Acknowledged & Actioned</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-4 h-4" /> Filters:
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Advisory Services">Advisory Services</option>
            <option value="Portal Usability">Portal Usability</option>
            <option value="Facilities">Facilities</option>
            <option value="Academic Support">Academic Support</option>
            <option value="General Suggestion">General Suggestion</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Implemented">Implemented</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold ml-2">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            My Feedback Only
          </label>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredFeedback.length}</span> entries
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <div className="font-bold text-slate-700 dark:text-slate-300">No feedback entries found</div>
            <p className="text-xs">
              {currentUser.role === 'student'
                ? 'Adjust your filter options or click "Submit Feedback" to add a new review.'
                : 'Adjust your filter options to view student feedback submissions.'}
            </p>
          </div>
        ) : (
          filteredFeedback.map((fb) => {
            let statusBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            if (fb.status === 'Under Review') statusBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            if (fb.status === 'Acknowledged') statusBadgeClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
            if (fb.status === 'Implemented') statusBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

            const isResponding = activeRespondingId === fb.id;

            return (
              <div
                key={fb.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= fb.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {fb.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {fb.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${statusBadgeClass}`}>
                      {fb.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {fb.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      Submitted by: <strong className="text-slate-700 dark:text-slate-300">{fb.userName}</strong> ({fb.userRole.toUpperCase()})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {fb.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(currentUser.role === 'admin' || currentUser.role === 'officer' || currentUser.role === 'manager') && (
                      <button
                        onClick={() => {
                          setActiveRespondingId(isResponding ? null : fb.id);
                          setResponseStatus(fb.status);
                          setResponseText(fb.responseNote || '');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isResponding ? 'Cancel' : 'Update Status / Response'}
                      </button>
                    )}

                    {(currentUser.role === 'admin' || currentUser.role === 'manager') && onDeleteFeedback && (
                      <button
                        onClick={() => onDeleteFeedback(fb.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 p-1 rounded-md cursor-pointer ml-2"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Response Note Card */}
                {fb.responseNote && !isResponding && (
                  <div className="mt-3 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Official Response by {fb.respondedBy || 'Staff'} ({fb.respondedAt})
                    </div>
                    <p className="text-indigo-800 dark:text-indigo-300">{fb.responseNote}</p>
                  </div>
                )}

                {/* Inline Staff Response Edit Form */}
                {isResponding && (
                  <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Staff Status & Response Controls
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Update Status
                        </label>
                        <select
                          value={responseStatus}
                          onChange={(e) => setResponseStatus(e.target.value as FeedbackStatus)}
                          className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Acknowledged">Acknowledged</option>
                          <option value="Implemented">Implemented</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Response Note / Action Taken
                      </label>
                      <textarea
                        rows={2}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Provide an official staff response note..."
                        className="w-full p-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveRespondingId(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveResponse(fb)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                      >
                        Save Response
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submit Feedback Modal */}
      {isSubmitModalOpen && currentUser.role === 'student' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all my-8">
            <div className="bg-indigo-600 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-base">
                <MessageSquareHeart className="w-5 h-5 text-indigo-200" />
                Submit Feedback / Service Review
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                    {rating === 5 && 'Excellent'}
                    {rating === 4 && 'Very Good'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Fair'}
                    {rating === 1 && 'Poor'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full p-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Advisory Services">Advisory Services</option>
                  <option value="Portal Usability">Portal Usability</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Academic Support">Academic Support</option>
                  <option value="General Suggestion">General Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Great experience with career advisory desk"
                  className="w-full p-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Feedback Comments
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details about your experience, what went well, or what could be improved..."
                  className="w-full p-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  Submit Anonymously (Hide my name and email)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
