import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { ShieldCheck, Key, Lock, UserCheck, CheckCircle2, Copy, Check, Info, LogIn, LogOut } from 'lucide-react';

interface SSOModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onLogOut?: () => void;
  isLoggedIn?: boolean;
}

export const SSOModal: React.FC<SSOModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onLogOut,
  isLoggedIn = true
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'switcher' | 'tokens' | 'saml'>('switcher');

  if (!isOpen) return null;

  const mockJwtToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNhbXB1cy1zc28ta2V5LTEifQ.${btoa(
    JSON.stringify({
      sub: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      department: currentUser.department || 'N/A',
      sso_provider: currentUser.ssoProvider,
      mfa_verified: currentUser.mfaEnabled,
      groups: currentUser.groups,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 28800,
      iss: 'https://sso.campus.edu/oauth2/v2.0'
    })
  )}.fake_signature_hash_xyz890`;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(mockJwtToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full overflow-hidden transition-all my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white p-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-8 h-8 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Campus Single Sign-On (SSO) Portal</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                  isLoggedIn
                    ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
                    : 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {isLoggedIn ? 'Identity Authenticated' : 'Logged Out'}
                </span>
              </div>
              <p className="text-xs text-indigo-100/80 mt-1">
                Central Identity Provider (IdP) • SAML 2.0 / OpenID Connect (OIDC) Simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 flex gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('switcher')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'switcher'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Identity Role Switcher & Login
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'tokens'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Key className="w-4 h-4" />
            OAuth 2.0 / JWT Claims
          </button>
          <button
            onClick={() => setActiveTab('saml')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'saml'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Lock className="w-4 h-4" />
            SAML Metadata & MFA
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'switcher' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex items-start justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Role-Based Access Control (RBAC) Active</p>
                    <p className="mt-0.5 text-indigo-700 dark:text-indigo-300">
                      Select a user identity below to log in or switch portal permissions seamlessly.
                    </p>
                  </div>
                </div>

                {isLoggedIn && onLogOut && (
                  <button
                    onClick={() => {
                      onLogOut();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out Current User
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {INITIAL_USERS.map((user) => {
                  const isSelected = isLoggedIn && user.id === currentUser.id;
                  let roleColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
                  if (user.role === 'admin') roleColor = 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
                  if (user.role === 'officer') roleColor = 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
                  if (user.role === 'manager') roleColor = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';

                  return (
                    <div
                      key={user.id}
                      className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-xs font-bold bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4" /> Logged In
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-xs"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                              {user.name}
                            </h3>
                            <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-md mt-1 capitalize ${roleColor}`}>
                              {user.role}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 mt-2">
                          <p className="truncate"><strong className="text-slate-700 dark:text-slate-300">Email:</strong> {user.email}</p>
                          <p><strong className="text-slate-700 dark:text-slate-300">Title:</strong> {user.title || user.department}</p>
                          <p><strong className="text-slate-700 dark:text-slate-300">Provider:</strong> {user.ssoProvider}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        {isSelected ? (
                          <div className="w-full flex items-center gap-2">
                            <span className="flex-1 py-2 px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-center border border-emerald-200 dark:border-emerald-900/40">
                              Active User
                            </span>
                            {onLogOut && (
                              <button
                                onClick={() => {
                                  onLogOut();
                                  onClose();
                                }}
                                className="py-2 px-3 text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                                title="Log Out"
                              >
                                <LogOut className="w-3.5 h-3.5" /> Log Out
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onSwitchUser(user);
                              onClose();
                            }}
                            className="w-full py-2 px-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <LogIn className="w-3.5 h-3.5" /> Log In as {user.name.split(' ')[0]} ({user.role.toUpperCase()})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Signed JSON Web Token (JWT)
                </span>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken ? 'Copied Token!' : 'Copy JWT Bearer'}
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all select-all leading-relaxed max-h-24 overflow-y-auto border border-slate-800">
                {mockJwtToken}
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Decoded Token Claims
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-800 dark:text-slate-200">
                  <pre className="overflow-x-auto">
                    {JSON.stringify(
                      {
                        sub: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                        role: currentUser.role,
                        sso_provider: currentUser.ssoProvider,
                        mfa_status: currentUser.mfaEnabled ? 'VERIFIED_DUE_PASSKEY' : 'DISABLED',
                        groups: currentUser.groups,
                        department: currentUser.department || 'Student Body',
                        session_ttl_minutes: 480,
                        token_issuer: 'https://sso.campus.edu/oauth2/v2.0'
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saml' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4 text-indigo-600" /> Security Credentials
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex justify-between">
                      <span>MFA Status:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Hardware FIDO2 / TOTP Enabled</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Encryption Protocol:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">TLS 1.3 / AES-256-GCM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Assertion Method:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">SAML2.0 Bearer Response</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Session ID:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">SESS-99042-X</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    Active Directory Groups
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.groups.map((group, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[11px] rounded-md border border-indigo-200 dark:border-indigo-800"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-center text-[11px]">
                Federated Identity Provider URL: <code className="text-slate-700 dark:text-slate-300 font-mono">https://idp.campus.edu/idp/profile/SAML2/Redirect/SSO</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Current user: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.role})
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Done & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

