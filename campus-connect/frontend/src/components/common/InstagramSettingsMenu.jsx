import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  KeyRound,
  UserPlus,
  Users,
  LogOut,
  LogIn,
  Sun,
  Moon,
  ChevronRight,
  Check,
  X,
  ShieldCheck,
  Edit3,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../js/utils/helpers';
import '../../css/settings-menu.css';

export const InstagramSettingsMenu = ({ minimal = false }) => {
  const {
    user,
    accounts,
    logout,
    renameUser,
    changePassword,
    switchAccount,
    addAccount
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Menu state
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'rename' | 'password' | 'accounts' | null

  // Rename form state
  const [renameForm, setRenameForm] = useState({
    name: '',
    university: '',
    major: '',
    bio: ''
  });

  // Change password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add account form state
  const [addAccountTab, setAddAccountTab] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    full_name: '',
    email: '',
    university: '',
    major: '',
    role: 'Student'
  });

  // Sync rename form when user changes or modal opens
  useEffect(() => {
    if (user) {
      setRenameForm({
        name: user.full_name || '',
        university: user.university || '',
        major: user.major || '',
        bio: user.bio || ''
      });
    }
  }, [user, activeModal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleOpenModal = (modalName) => {
    setIsOpen(false);
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setAddAccountTab(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Handle Rename Save
  const handleSaveRename = (e) => {
    e.preventDefault();
    if (!renameForm.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    renameUser(renameForm.name, renameForm.university, renameForm.major, renameForm.bio);
    showToast('Profile name & details updated successfully!', 'success');
    handleCloseModal();
  };

  // Handle Change Password Save
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showToast('Password changed successfully!', 'success');
      handleCloseModal();
    } catch (err) {
      showToast(err.message || 'Failed to update password', 'error');
    }
  };

  // Handle Switch Account
  const handleSelectAccount = (targetAccount) => {
    switchAccount(targetAccount);
    showToast(`Switched account to ${targetAccount.full_name}`, 'success');
    handleCloseModal();
  };

  // Handle Add Account
  const handleSaveNewAccount = (e) => {
    e.preventDefault();
    if (!newAccountForm.full_name || !newAccountForm.email) {
      showToast('Name and university email are required', 'error');
      return;
    }
    const created = addAccount(newAccountForm);
    showToast(`Account added! Switched to ${created.full_name}`, 'success');
    setNewAccountForm({ full_name: '', email: '', university: '', major: '', role: 'Student' });
    handleCloseModal();
  };

  // Handle Logout
  const handleLogout = () => {
    setIsOpen(false);
    logout();
    showToast('Logged out. Please log in to enter Campus Connect.', 'info');
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Trigger Button: Instagram Style */}
      <button
        onClick={handleToggleMenu}
        className="ig-settings-trigger"
        aria-label="Account Settings & Options"
        title="Settings & Account"
      >
        {user ? (
          <>
            <span className="ig-avatar-ring">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="ig-avatar-inner" />
              ) : (
                <div className="ig-avatar-inner">
                  {getInitials(user.full_name || 'User')}
                </div>
              )}
            </span>
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.full_name?.split(' ')[0]}
            </span>
            <span className="ig-gear-icon">
              <Settings size={16} />
            </span>
          </>
        ) : (
          <>
            <span className="ig-gear-icon">
              <Settings size={18} />
            </span>
            <span>Settings</span>
          </>
        )}
      </button>

      {/* Instagram Settings Dropdown Menu */}
      {isOpen && (
        <div className="ig-settings-menu">
          {/* Header Card */}
          <div className="ig-menu-header">
            {user ? (
              <>
                <span className="ig-avatar-ring ig-avatar-lg">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="ig-avatar-inner" />
                  ) : (
                    <div className="ig-avatar-inner">
                      {getInitials(user.full_name || 'User')}
                    </div>
                  )}
                </span>
                <div className="ig-menu-user-info">
                  <div className="ig-menu-user-name">
                    <span>{user.full_name}</span>
                    <ShieldCheck size={14} color="var(--color-accent)" />
                  </div>
                  <div className="ig-menu-user-sub">{user.email}</div>
                  <div className="ig-menu-badge">
                    {user.role || user.university || 'Active Student'}
                  </div>
                </div>
              </>
            ) : (
              <div className="ig-menu-user-info" style={{ textAlign: 'center', padding: '0.25rem 0' }}>
                <div className="ig-menu-user-name" style={{ justifyContent: 'center' }}>
                  Guest Visitor
                </div>
                <div className="ig-menu-user-sub">Login required to access platform</div>
              </div>
            )}
          </div>

          {/* Menu Options */}
          <div className="ig-menu-list">
            {user ? (
              <>
                {/* Rename / Edit Name */}
                <button
                  className="ig-menu-item"
                  onClick={() => handleOpenModal('rename')}
                >
                  <div className="ig-menu-item-left">
                    <span className="ig-menu-item-icon">
                      <Edit3 size={16} />
                    </span>
                    <div className="ig-menu-item-text">
                      <span className="ig-menu-item-title">Rename / Edit Profile</span>
                      <span className="ig-menu-item-desc">Change full name & university</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </button>

                {/* Change Password */}
                <button
                  className="ig-menu-item"
                  onClick={() => handleOpenModal('password')}
                >
                  <div className="ig-menu-item-left">
                    <span className="ig-menu-item-icon">
                      <KeyRound size={16} />
                    </span>
                    <div className="ig-menu-item-text">
                      <span className="ig-menu-item-title">Change Password</span>
                      <span className="ig-menu-item-desc">Update security credentials</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </button>

                {/* Add / Switch Account */}
                <button
                  className="ig-menu-item"
                  onClick={() => handleOpenModal('accounts')}
                >
                  <div className="ig-menu-item-left">
                    <span className="ig-menu-item-icon">
                      <Users size={16} />
                    </span>
                    <div className="ig-menu-item-text">
                      <span className="ig-menu-item-title">Add / Switch Account</span>
                      <span className="ig-menu-item-desc">
                        {accounts?.length || 1} accounts available
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </button>
              </>
            ) : (
              <>
                {/* Log In for guest */}
                <button
                  className="ig-menu-item"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  style={{ color: 'var(--color-accent)' }}
                >
                  <div className="ig-menu-item-left">
                    <span className="ig-menu-item-icon" style={{ color: 'var(--color-accent)' }}>
                      <LogIn size={16} />
                    </span>
                    <div className="ig-menu-item-text">
                      <span className="ig-menu-item-title">Log In to Campus</span>
                      <span className="ig-menu-item-desc">Enter your credentials</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </button>

                {/* Add Account for guest */}
                <button
                  className="ig-menu-item"
                  onClick={() => handleOpenModal('accounts')}
                >
                  <div className="ig-menu-item-left">
                    <span className="ig-menu-item-icon">
                      <UserPlus size={16} />
                    </span>
                    <div className="ig-menu-item-text">
                      <span className="ig-menu-item-title">Add / Switch Account</span>
                      <span className="ig-menu-item-desc">Use pre-configured profiles</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </button>
              </>
            )}

            {/* Theme Toggle */}
            <button
              className="ig-menu-item"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="ig-menu-item-left">
                <span className="ig-menu-item-icon">
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </span>
                <div className="ig-menu-item-text">
                  <span className="ig-menu-item-title">
                    {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
                  </span>
                  <span className="ig-menu-item-desc">Toggle color scheme</span>
                </div>
              </div>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </button>

            <div className="ig-menu-divider" />

            {/* Logout / Login button */}
            {user ? (
              <button
                className="ig-menu-item ig-menu-item-danger"
                onClick={handleLogout}
              >
                <div className="ig-menu-item-left">
                  <span className="ig-menu-item-icon">
                    <LogOut size={16} />
                  </span>
                  <div className="ig-menu-item-text">
                    <span className="ig-menu-item-title">Log Out</span>
                    <span className="ig-menu-item-desc">Lock & exit session</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#dc2626" />
              </button>
            ) : (
              <button
                className="ig-menu-item"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/register');
                }}
              >
                <div className="ig-menu-item-left">
                  <span className="ig-menu-item-icon">
                    <UserPlus size={16} />
                  </span>
                  <div className="ig-menu-item-text">
                    <span className="ig-menu-item-title">Create Account</span>
                    <span className="ig-menu-item-desc">Join your campus team</span>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-text-muted)" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: Rename / Edit Profile
          ======================================================== */}
      {activeModal === 'rename' && (
        <div className="ig-modal-overlay" onClick={handleCloseModal}>
          <div className="ig-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ig-modal-header">
              <div className="ig-modal-title">
                <Edit3 size={18} color="var(--color-accent)" />
                <span>Rename Account & Profile</span>
              </div>
              <button className="ig-modal-close" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRename}>
              <div className="ig-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <span className="ig-avatar-ring ig-avatar-lg" style={{ display: 'inline-flex' }}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="ig-avatar-inner" />
                    ) : (
                      <div className="ig-avatar-inner">
                        {getInitials(renameForm.name || 'User')}
                      </div>
                    )}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                    Instagram-Style Account Identity
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    Full Name / Display Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={renameForm.name}
                    onChange={(e) => setRenameForm({ ...renameForm, name: e.target.value })}
                    placeholder="Enter your new name"
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    University / College
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={renameForm.university}
                    onChange={(e) => setRenameForm({ ...renameForm, university: e.target.value })}
                    placeholder="e.g. Stanford University"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    Major / Department
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={renameForm.major}
                    onChange={(e) => setRenameForm({ ...renameForm, major: e.target.value })}
                    placeholder="e.g. Computer Science & AI"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    Bio / Headline
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={renameForm.bio}
                    onChange={(e) => setRenameForm({ ...renameForm, bio: e.target.value })}
                    placeholder="Short bio about your skills..."
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="ig-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: Change Password
          ======================================================== */}
      {activeModal === 'password' && (
        <div className="ig-modal-overlay" onClick={handleCloseModal}>
          <div className="ig-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ig-modal-header">
              <div className="ig-modal-title">
                <KeyRound size={18} color="var(--color-accent)" />
                <span>Change Password</span>
              </div>
              <button className="ig-modal-close" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className="ig-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  For security, choose a strong password with at least 6 characters.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    New Password *
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div className="ig-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: Add / Switch Account (Instagram Style)
          ======================================================== */}
      {activeModal === 'accounts' && (
        <div className="ig-modal-overlay" onClick={handleCloseModal}>
          <div className="ig-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ig-modal-header">
              <div className="ig-modal-title">
                <Users size={18} color="var(--color-accent)" />
                <span>Switch or Add Account</span>
              </div>
              <button className="ig-modal-close" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>

            <div className="ig-modal-body">
              {/* Tabs: Switch vs Add */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAddAccountTab(false)}
                  className={`btn btn-sm ${!addAccountTab ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, borderRadius: '8px' }}
                >
                  <Users size={14} /> Saved Accounts ({accounts?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setAddAccountTab(true)}
                  className={`btn btn-sm ${addAccountTab ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, borderRadius: '8px' }}
                >
                  <UserPlus size={14} /> + Add Account
                </button>
              </div>

              {!addAccountTab ? (
                /* List of Accounts */
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {accounts && accounts.map((acc) => {
                    const isActive = user && user.id === acc.id;
                    return (
                      <div
                        key={acc.id}
                        className={`ig-account-card ${isActive ? 'active' : ''}`}
                        onClick={() => !isActive && handleSelectAccount(acc)}
                      >
                        <div className="ig-account-card-left">
                          <span className="ig-avatar-ring">
                            {acc.avatar_url ? (
                              <img src={acc.avatar_url} alt={acc.full_name} className="ig-avatar-inner" />
                            ) : (
                              <div className="ig-avatar-inner">
                                {getInitials(acc.full_name)}
                              </div>
                            )}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                              {acc.full_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {acc.email} • {acc.university || 'Campus'}
                            </div>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="ig-account-active-badge">
                            <Check size={14} /> Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAccount(acc);
                            }}
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Add New Account Form */
                <form onSubmit={handleSaveNewAccount} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      placeholder="e.g. John Doe"
                      value={newAccountForm.full_name}
                      onChange={(e) => setNewAccountForm({ ...newAccountForm, full_name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                      University Email *
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      required
                      placeholder="student@university.edu"
                      value={newAccountForm.email}
                      onChange={(e) => setNewAccountForm({ ...newAccountForm, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                        University
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Stanford"
                        value={newAccountForm.university}
                        onChange={(e) => setNewAccountForm({ ...newAccountForm, university: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>
                        Role
                      </label>
                      <select
                        className="input-field"
                        value={newAccountForm.role}
                        onChange={(e) => setNewAccountForm({ ...newAccountForm, role: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                      >
                        <option value="Student">Student</option>
                        <option value="Faculty Mentor">Faculty Mentor</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Researcher">Researcher</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setAddAccountTab(false)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <UserPlus size={14} /> Add & Switch Account
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="ig-modal-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramSettingsMenu;
