import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { User as UserIcon, Lock, Eye, EyeOff, ArrowRight, Info, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onOpenSSOPortal?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenSSOPortal
}) => {
  const [identifier, setIdentifier] = useState('student@uni.edu.vn');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Translation dictionary
  const t = {
    en: {
      title: 'Log In',
      subtitle: 'Welcome back to the UniLink system',
      identifierLabel: 'STUDENT ID / EMAIL',
      identifierPlaceholder: 'STU123456 or student@uni.edu.vn',
      passwordLabel: 'PASSWORD',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember password',
      forgotPassword: 'Forgot password?',
      loginBtn: 'LOG IN',
      noAccount: "Don't have an account?",
      register: 'Register',
      techSupport: 'Technical support:',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      quickAccounts: 'Quick Demo Test Accounts',
      quickAccountDesc: 'Select a role below to auto-fill credentials and log in:',
      invalidAuth: 'Invalid Student ID/Email or password. Select a demo account below to test.'
    },
    vi: {
      title: 'Đăng nhập',
      subtitle: 'Chào mừng bạn quay lại hệ thống UniLink',
      identifierLabel: 'MÃ SINH VIÊN / EMAIL',
      identifierPlaceholder: 'SV123456 hoặc student@uni.edu.vn',
      passwordLabel: 'MẬT KHẨU',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Nhớ mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      loginBtn: 'ĐĂNG NHẬP',
      noAccount: 'Chưa có tài khoản?',
      register: 'Đăng ký',
      techSupport: 'Hỗ trợ kỹ thuật:',
      privacy: 'Bảo mật',
      terms: 'Điều khoản',
      quickAccounts: 'Tài khoản thử nghiệm nhanh (Demo Personas)',
      quickAccountDesc: 'Chọn vai trò bên dưới để tự động điền thông tin và đăng nhập:',
      invalidAuth: 'Mã sinh viên/Email hoặc mật khẩu không chính xác. Hãy chọn tài khoản thử nghiệm bên dưới.'
    }
  }[language];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(language === 'vi' ? 'Vui lòng nhập Mã sinh viên hoặc Email' : 'Please enter Student ID or Email');
      return;
    }

    const inputLower = identifier.trim().toLowerCase();

    // Match with INITIAL_USERS by email, studentId, or partial role match
    const matchedUser = INITIAL_USERS.find((u) => {
      const emailMatch = u.email.toLowerCase() === inputLower;
      const idMatch = u.studentId?.toLowerCase() === inputLower;
      const roleMatch = inputLower.includes(u.role) || inputLower.includes(u.name.toLowerCase().split(' ')[0]);
      return emailMatch || idMatch || roleMatch;
    });

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      // Default fallback to first student user if input looks like student
      const studentUser = INITIAL_USERS.find((u) => u.role === 'student') || INITIAL_USERS[0];
      onLoginSuccess(studentUser);
    }
  };

  const handleSelectDemoUser = (user: User) => {
    setIdentifier(user.email);
    setPassword('••••••••');
    setErrorMsg('');
    setTimeout(() => {
      onLoginSuccess(user);
    }, 150);
  };

  return (
    <div className="min-h-[92vh] flex flex-col justify-between items-center bg-[#f4f5f8] dark:bg-slate-950 px-4 py-8 relative overflow-hidden transition-colors">
      {/* Background Decorative Polygon Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-200/50 dark:bg-slate-900/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100/40 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Top Header Bar: Language Switcher & SSO option */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
            U
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">
            Uni<span className="text-indigo-600 dark:text-indigo-400">Link</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇬🇧</span> EN
            </button>
            <button
              onClick={() => setLanguage('vi')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'vi'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇻🇳</span> VN
            </button>
          </div>

          {onOpenSSOPortal && (
            <button
              onClick={onOpenSSOPortal}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Campus SSO</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[430px] my-auto z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-2xl p-7 sm:p-9 transition-all">
          
          {/* Card Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 font-medium">
              {t.subtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Field 1: Student ID / Email */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 tracking-wider mb-2 uppercase">
                {t.identifierLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t.identifierPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 tracking-wider mb-2 uppercase">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
                <span>{t.rememberMe}</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition-colors cursor-pointer"
              >
                {t.forgotPassword}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 mt-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold tracking-wider rounded-2xl shadow-md hover:shadow-lg shadow-indigo-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer uppercase"
            >
              <span>{t.loginBtn}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-7 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>{t.noAccount} </span>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="font-bold text-slate-900 dark:text-white underline underline-offset-4 decoration-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {t.register}
            </button>
          </div>
        </div>

        {/* Demo Personas Quick Login Helper Card */}
        <div className="mt-5 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t.quickAccounts}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            {t.quickAccountDesc}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {INITIAL_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectDemoUser(user)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700/60 text-left transition-all group cursor-pointer flex items-center gap-2"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold capitalize truncate">
                    {user.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Footer (technical support & privacy/terms) */}
      <div className="w-full max-w-4xl pt-6 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {t.techSupport} <strong className="text-slate-700 dark:text-slate-300 font-semibold">support@unilink.edu.vn</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
          <button onClick={() => alert('Privacy Policy: UniLink Campus Data Protection Directive 2026.')} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
            {t.privacy}
          </button>
          <span>•</span>
          <button onClick={() => alert('Terms of Service: Acceptable Use Policy for Campus Portal.')} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
            {t.terms}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'vi' ? 'Khôi phục mật khẩu' : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'vi'
                ? 'Nhập mã sinh viên hoặc email trường của bạn để nhận liên kết đặt lại mật khẩu.'
                : 'Enter your student ID or school email to receive a password reset link.'}
            </p>

            {resetEmailSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>
                  {language === 'vi'
                    ? 'Đã gửi hướng dẫn khôi phục mật khẩu tới email trường của bạn!'
                    : 'Password reset instructions have been sent to your email!'}
                </span>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  defaultValue={identifier}
                  placeholder="student@uni.edu.vn"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-medium"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setForgotModalOpen(false);
                  setResetEmailSent(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
              {!resetEmailSent && (
                <button
                  onClick={() => setResetEmailSent(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Gửi yêu cầu' : 'Send Request'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {language === 'vi' ? 'Đăng ký tài khoản UniLink' : 'Register UniLink Account'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'vi'
                ? 'Tài khoản UniLink được cấp tự động theo Mã sinh viên. Chọn tài khoản demo bên dưới để bắt đầu trải nghiệm ngay.'
                : 'UniLink accounts are generated automatically by Student ID. Pick a demo account below to log in instantly.'}
            </p>

            <div className="space-y-2 mb-4">
              {INITIAL_USERS.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setRegisterModalOpen(false);
                    handleSelectDemoUser(user);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</h4>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 capitalize">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
