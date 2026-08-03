import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import {
  Bot,
  Sparkles,
  X,
  Send,
  MessageSquare,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Calendar,
  FileText,
  UserCheck,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Headphones,
  LifeBuoy,
  BookOpen,
  Home,
  DollarSign,
  Globe,
  HeartPulse,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIChatbotProps {
  currentUser: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
  enquiriesCount?: number;
  appointmentsCount?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionTag?: string; // Optional tab suggestion (e.g., 'appointments', 'enquiries')
  feedbackState?: 'satisfied' | 'needs_staff'; // Satisfaction tracking
}

const SUGGESTED_QUESTIONS = [
  {
    label: '📁 Enquiry Categories Guide',
    prompt: 'Can you explain the different Enquiry categories available on CampusConnect?',
    actionTab: 'enquiries'
  },
  {
    label: '📅 Book 1-on-1 Consultation',
    prompt: 'How do I book an appointment with an advisor or SSO officer?',
    actionTab: 'appointments'
  },
  {
    label: '🎓 Academic & Course FAQs',
    prompt: 'What help is available for course registration, credit transfers, and grade appeals?',
    actionTab: 'enquiries'
  },
  {
    label: '🏠 Housing & Dorm Advice',
    prompt: 'How do I request housing maintenance or dorm allocation assistance?',
    actionTab: 'enquiries'
  },
  {
    label: '💰 Tuition & Financial Aid',
    prompt: 'Where can I find information on scholarships, fee payment extensions, and financial support?',
    actionTab: 'enquiries'
  },
  {
    label: '👨‍💼 Speak with Human Staff',
    prompt: 'I need to talk to a human SSO Officer or Academic Advisor directly.',
    actionTab: 'appointments'
  }
];

export const AIChatbot: React.FC<AIChatbotProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  enquiriesCount = 0,
  appointmentsCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${currentUser.name.split(' ')[0]}! 👋 I am your **CampusConnect AI Assistant**.\n\nI can answer **FAQs**, guide you through **Enquiry Categories** (Academic, Financial, Housing, International, Mental Health), or connect you directly with **human staff**.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    // Build context payload
    const chatHistory = messages
      .filter((m) => m.id !== 'welcome-1')
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          context: {
            userName: currentUser.name,
            userRole: currentUser.role,
            activeTab,
            enquiriesCount,
            appointmentsCount
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || "I'm happy to help you with CampusConnect!";

      // Detect if the answer strongly suggests visiting a tab
      let suggestedTab: string | undefined = undefined;
      const lowerReply = replyContent.toLowerCase();
      if (lowerReply.includes('appointment') && (lowerReply.includes('book') || lowerReply.includes('schedule') || lowerReply.includes('slot'))) {
        suggestedTab = 'appointments';
      } else if (lowerReply.includes('enquiry') || lowerReply.includes('ticket') || lowerReply.includes('inquiry')) {
        suggestedTab = 'enquiries';
      } else if (lowerReply.includes('feedback') || lowerReply.includes('rating')) {
        suggestedTab = 'feedback';
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: suggestedTab
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Failed to communicate with AI server:', error);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `I'm here to guide you! Here is a quick guide to CampusConnect Enquiry Categories:\n\n• **Academic**: Course registration, transcripts, credit transfers.\n• **Financial**: Tuition fees, scholarships, payment extensions.\n• **Housing**: On-campus dorms, maintenance requests.\n• **International**: Visa support, COE, work limits.\n• **Mental Health**: Counseling and student wellbeing.\n\nNeed staff assistance? You can submit an enquiry ticket or book an appointment anytime!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: 'enquiries'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, state: 'satisfied' | 'needs_staff') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedbackState: state } : m))
    );

    if (state === 'needs_staff') {
      // Append a helpful staff escalation assistant message
      const staffMsg: ChatMessage = {
        id: `staff-escalate-${Date.now()}`,
        role: 'assistant',
        content: `I apologize that wasn't fully clear! 👨‍💼 Our **Student Service Officers (SSO)** and Advisors are ready to help you directly:\n\n• **Submit an Enquiry Ticket**: A staff officer will review your request and reply shortly.\n• **Book 1-on-1 Consultation**: Pick an open 15-min or 30-min slot for direct guidance.\n\nWhich staff service would you like to access?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: 'enquiries'
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, staffMsg]);
      }, 300);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history refreshed! How can I assist you with CampusConnect, ${currentUser.name.split(' ')[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          const parts = line.split(/(\*\*.*?\*\*)/g);
          const lineElement = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold font-semibold text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{lineElement.map((p) => typeof p === 'string' ? p.replace(/^[\•\-]\s*/, '') : p)}</span>
              </div>
            );
          }

          return <p key={idx}>{lineElement}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-[92vw] sm:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden mb-4 ${
              isMinimized ? 'h-16' : 'h-[560px] max-h-[82vh]'
            }`}
          >
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="relative p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Bot className="w-5 h-5 text-indigo-200 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-700 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide text-white">CampusConnect AI</h3>
                    <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-semibold text-indigo-100 uppercase tracking-wider">
                      FAQs & Staff Help
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200 truncate max-w-[210px]">
                    Assisting {currentUser.name} ({currentUser.role.toUpperCase()})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white cursor-pointer"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close AI Assistant"
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
                  {/* Context Info Banner */}
                  <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Ask FAQs, explore enquiry categories, or connect with staff!</span>
                    </div>
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[90%]">
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs mb-0.5">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl shadow-xs text-xs sm:text-sm ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                          }`}
                        >
                          {msg.role === 'assistant' ? renderFormattedText(msg.content) : msg.content}

                          {/* Quick Actions & Navigations */}
                          {msg.role === 'assistant' && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-1.5">
                              {/* Direct Tab Navigation */}
                              {msg.actionTag && msg.actionTag !== activeTab && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onNavigate(msg.actionTag!);
                                    setIsOpen(false);
                                  }}
                                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Go to {msg.actionTag.charAt(0).toUpperCase() + msg.actionTag.slice(1)}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}

                              {/* Satisfaction Check Controls */}
                              {msg.id !== 'welcome-1' && !msg.feedbackState && (
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <span className="text-[10px] text-slate-400 font-medium">Was this helpful?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, 'satisfied')}
                                    title="Yes, satisfied"
                                    className="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-400 hover:text-emerald-600 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>Yes</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(msg.id, 'needs_staff')}
                                    title="No, need staff help"
                                    className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                    <span>Need Staff</span>
                                  </button>
                                </div>
                              )}

                              {/* Satisfied Feedback Banner */}
                              {msg.feedbackState === 'satisfied' && (
                                <div className="w-full mt-1.5 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex flex-col gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Glad this helped! What would you like to do next?</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onNavigate('appointments');
                                        setIsOpen(false);
                                      }}
                                      className="px-2 py-0.5 bg-white dark:bg-emerald-900/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-200 rounded text-[10px] font-semibold border border-emerald-200/80 transition-colors cursor-pointer"
                                    >
                                      📅 Book Appointment
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onNavigate('enquiries');
                                        setIsOpen(false);
                                      }}
                                      className="px-2 py-0.5 bg-white dark:bg-emerald-900/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-200 rounded text-[10px] font-semibold border border-emerald-200/80 transition-colors cursor-pointer"
                                    >
                                      ❓ Submit Enquiry
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Needs Staff Escalation Banner */}
                              {msg.feedbackState === 'needs_staff' && (
                                <div className="w-full mt-1.5 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex flex-col gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>Need direct staff support? Connect with our team:</span>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onNavigate('enquiries');
                                        setIsOpen(false);
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      <span>Submit Enquiry Ticket to SSO Officer</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onNavigate('appointments');
                                        setIsOpen(false);
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>Book 1-on-1 Advisor Consultation</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce delay-100">●</span>
                        <span className="animate-bounce delay-200">●</span>
                        <span className="ml-1 text-[11px] font-medium text-slate-400">CampusConnect AI is thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Suggested FAQs & Categories
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q.prompt)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer border border-slate-200/60 dark:border-slate-700/50"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask AI about FAQs, enquiry categories, staff support..."
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-xs cursor-pointer shrink-0 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isMinimized) setIsMinimized(false);
        }}
        className="relative group p-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 flex items-center gap-2.5 cursor-pointer border border-white/20 select-none"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>

        <span className="hidden sm:inline-block font-extrabold text-xs tracking-wide pr-1">
          {isOpen ? 'Close Assistant' : 'AI Assistant & FAQs'}
        </span>

        {/* Pulse Beacon */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
