import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, LogOut, Trash2, Upload, RefreshCw, AlertCircle, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import "./MyProfile.css";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [twoStep, setTwoStep] = useState(true);
  const [actionStatus, setActionStatus] = useState({ type: null, message: '' });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Avatar Upload State
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarFailed, setAvatarFailed] = useState(false);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailStep, setEmailStep] = useState('input');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailUpdating, setEmailUpdating] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInitials = () => {
    if (fullName) {
      const names = fullName.trim().split(' ');
      return names.length >= 2 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (pwd) => pwd.length >= 8;
  const clearActionStatus = () => setActionStatus({ type: null, message: '' });

  const resetPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const resetEmailModal = () => {
    setNewEmail('');
    setEmailOtp('');
    setEmailStep('input');
    setEmailError('');
  };

  // ✅ AVATAR HANDLERS
  const handleAvatarClick = () => {
    document.getElementById('avatar-upload-input')?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image must be less than 5MB.');
      return;
    }

    setAvatarError('');
    setAvatarFile(file);
    setAvatarFailed(false);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !currentUser?.email) return;
    
    try {
      setAvatarUploading(true);
      setAvatarError('');
      
      console.log('📤 Uploading avatar for:', currentUser.email);
      
      const formData = new FormData();
      formData.append('email', currentUser.email);
      formData.append('avatar', avatarFile);
      
      const response = await axios.post(
        `${API_BASE}/api/identity/upload-avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Avatar upload response:', response.data);
      
      if (response.data.photoURL) {
        const fullAvatarUrl = `${API_BASE}${response.data.photoURL}?t=${Date.now()}`;
        console.log('✅ Setting avatar URL:', fullAvatarUrl);
        setAvatarPreview(fullAvatarUrl);
        setAvatarFailed(false);
        setCurrentUser(prev => ({
          ...prev,
          avatarUrl: response.data.photoURL
        }));
      }
      
      setActionStatus({ 
        type: 'success', 
        message: 'Profile photo updated successfully!' 
      });
      
      setAvatarFile(null);
      const fileInput = document.getElementById('avatar-upload-input');
      if (fileInput) fileInput.value = '';
      
      setTimeout(clearActionStatus, 3000);
      
    } catch (err) {
      console.error('❌ Avatar upload failed:', err);
      setAvatarError(err.response?.data?.message || 'Failed to upload photo.');
      setActionStatus({ type: 'error', message: 'Upload failed.' });
      setTimeout(clearActionStatus, 5000);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser?.email) return;
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

    try {
      setAvatarUploading(true);
      setAvatarError('');
      console.log('🗑️ Removing avatar for:', currentUser.email);

      await axios.delete(`${API_BASE}/api/identity/delete-avatar`, { 
        data: { email: currentUser.email } 
      });

      setAvatarPreview('');
      setAvatarFailed(true);
      setAvatarFile(null);
      const fileInput = document.getElementById('avatar-upload-input');
      if (fileInput) fileInput.value = '';

      setCurrentUser(prev => ({
        ...prev,
        avatarUrl: null
      }));

      setActionStatus({ type: 'success', message: 'Profile photo removed successfully!' });
      setTimeout(clearActionStatus, 3000);
    } catch (err) {
      console.error('❌ Avatar removal failed:', err);
      setAvatarError(err.response?.data?.message || 'Failed to remove photo.');
      setActionStatus({ type: 'error', message: 'Remove failed.' });
      setTimeout(clearActionStatus, 5000);
    } finally { 
      setAvatarUploading(false); 
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // ✅ EMAIL HANDLERS
  const handleRequestEmailChange = async () => {
    setEmailError('');
    if (!isValidEmail(newEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (newEmail === currentUser?.email) {
      setEmailError('New email must be different from current email.');
      return;
    }

    try {
      if (!currentUser) return;
      setEmailUpdating(true);
      console.log('📤 Requesting email change for:', newEmail);

      const response = await axios.post(`${API_BASE}/api/identity/request-email-change`, {
        email: currentUser.email,
        newEmail: newEmail
      });

      console.log('✅ Backend response:', response.data);
      setEmailStep('otp');
      setActionStatus({ type: 'success', message: `Code sent to ${currentUser.email}` });
      setTimeout(clearActionStatus, 3000);
    } catch (err) {
      console.error('❌ Email change request failed:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to send verification code.';
      setEmailError(msg);
      setActionStatus({ type: 'error', message: msg });
      setTimeout(clearActionStatus, 5000);
    } finally {
      setEmailUpdating(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    setEmailError('');
    if (!emailOtp || emailOtp.length !== 6) {
      setEmailError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      if (!currentUser) return;
      setEmailUpdating(true);

      const response = await axios.post(`${API_BASE}/api/identity/verify-email-change`, {
        email: currentUser.email,
        otp: emailOtp
      });

      console.log('✅ Email verified:', response.data);
      setIsEmailModalOpen(false);
      resetEmailModal();
      setActionStatus({ type: 'success', message: response.data.message || 'Email updated! Please login with your new email.' });
      setTimeout(() => handleSystemLogout(), 2000);
    } catch (err) {
      console.error('❌ Email verification failed:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid verification code.';
      setEmailError(msg);
      setActionStatus({ type: 'error', message: msg });
      setTimeout(clearActionStatus, 5000);
    } finally {
      setEmailUpdating(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setEmailUpdating(true);
      await axios.post(`${API_BASE}/api/identity/request-email-change`, { 
        email: currentUser.email, 
        newEmail 
      });
      setActionStatus({ type: 'success', message: 'New code sent!' });
      setTimeout(clearActionStatus, 3000);
    } catch (err) {
      setEmailError('Failed to resend code.');
    } finally {
      setEmailUpdating(false);
    }
  };

  // ✅ PASSWORD HANDLERS
  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (!isValidPassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    try {
      if (!currentUser?.email) {
        setPasswordError('No user logged in.');
        return;
      }
      
      setPasswordUpdating(true);
      console.log('🔐 Updating password for:', currentUser.email);
      
      const response = await axios.post(`${API_BASE}/api/identity/update-password`, { 
        email: currentUser.email,
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      console.log('✅ Password update response:', response.data);
      
      setIsPasswordModalOpen(false); 
      resetPasswordModal();
      setActionStatus({ 
        type: 'success', 
        message: response.data.message || 'Password updated successfully!' 
      });
      
      setTimeout(() => {
        handleSystemLogout();
      }, 2000);
      
    } catch (err) {
      console.error("❌ Password update failed:", err);
      const backendMsg = err.response?.data?.message;
      if (backendMsg) {
        setPasswordError(backendMsg);
      } else if (err.code === 'ERR_NETWORK') {
        setPasswordError('Cannot connect to server. Please check your connection.');
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
      
      setActionStatus({ type: 'error', message: 'Password update failed.' });
      setTimeout(clearActionStatus, 5000);
    } finally { 
      setPasswordUpdating(false); 
    }
  };

  // ✅ PROFILE FETCH - FIXED TO READ FROM CORRECT LOCALSTORAGE KEYS
  const fetchProfile = async (email) => {
    try {
      console.log('\n📤 Fetching profile for:', email);
      console.log('🔗 API URL:', `${API_BASE}/api/identity/profile?email=${encodeURIComponent(email)}`);
      
      if (!email) {
        console.error('❌ No email provided');
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${API_BASE}/api/identity/profile?email=${encodeURIComponent(email)}`);
      
      console.log('📥 Backend response:', res.data);
      
      if (res.data && res.data.success && res.data.user) {
        const userData = res.data.user;
        
        // Set full name
        if (userData.fullName) {
          console.log('✅ Setting fullName:', userData.fullName);
          setFullName(userData.fullName.trim());
        } else if (userData.firstName || userData.lastName) {
          const combinedName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
          console.log('✅ Setting combined name:', combinedName);
          setFullName(combinedName);
        } else {
          console.log('⚠️ No name found, using email prefix');
          setFullName(email.split('@')[0]);
        }
        
        setTwoStep(userData.twoStep !== false);
        
        const currentUserData = { 
          email: userData.email, 
          avatarUrl: userData.photoURL || userData.avatarUrl,
          fullName: userData.fullName
        };
        console.log('✅ Setting currentUser:', currentUserData);
        setCurrentUser(currentUserData);
        
        if (userData.photoURL || userData.avatarUrl) {
          const avatarUrl = userData.photoURL || userData.avatarUrl;
          const fullUrl = avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}?t=${Date.now()}`;
          console.log('✅ Setting avatar preview:', fullUrl);
          setAvatarPreview(fullUrl);
          setAvatarFailed(false);
        } else {
          console.log('ℹ️ No avatar URL in response');
          setAvatarPreview('');
          setAvatarFailed(true);
        }
        
        setActionStatus({ type: 'success', message: 'Profile loaded successfully' });
        setTimeout(clearActionStatus, 2000);
      } else {
        console.error('❌ Invalid response structure:', res.data);
        setActionStatus({ type: 'error', message: 'Invalid profile data received.' });
      }
    } catch (err) {
      console.error("❌ Profile fetch failed:", err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      
      let errorMsg = 'Could not load profile.';
      if (err.response?.status === 404) errorMsg = 'User not found in database.';
      else if (err.response?.status === 500) errorMsg = 'Server error.';
      else if (err.code === 'ERR_NETWORK') errorMsg = 'Cannot connect to server. Is backend running?';
      
      setActionStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD USER FROM LOCALSTORAGE - FIXED TO CHECK CORRECT KEYS
  useEffect(() => {
    console.log('🔐 Loading user from localStorage...');
    console.log('📍 API_BASE:', API_BASE);
    
    // Check for user data from Google sign-in or regular login
    const storedUser = localStorage.getItem('user');
    const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
    const storedToken = localStorage.getItem('token') || localStorage.getItem('eraX_auth_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    console.log('👤 Stored user:', storedUser);
    console.log('📧 Stored email:', storedEmail);
    console.log('🔑 Stored token:', storedToken ? 'Exists' : 'None');
    console.log('✅ Is authenticated:', isAuthenticated);
    
    let userEmail = null;
    
    // Try to get email from stored user object first
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        userEmail = userData.email;
        console.log('✅ Got email from user object:', userEmail);
      } catch (e) {
        console.error('❌ Failed to parse user data:', e);
      }
    }
    
    // Fallback to stored email
    if (!userEmail && storedEmail) {
      userEmail = storedEmail;
      console.log('✅ Using stored email:', userEmail);
    }
    
    // Check if we have valid authentication
    const hasValidAuth = (storedToken || isAuthenticated) && userEmail;
    
    if (hasValidAuth) {
      console.log('✅ User authenticated, fetching profile...');
      fetchProfile(userEmail);
    } else {
      console.log('❌ No valid authentication found');
      setLoading(false);
      setActionStatus({ type: 'error', message: 'No user found. Please login again.' });
      setTimeout(() => { window.location.href = "/login"; }, 3000);
    }
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        if (isEmailModalOpen) { setIsEmailModalOpen(false); resetEmailModal(); }
        if (isPasswordModalOpen) { setIsPasswordModalOpen(false); resetPasswordModal(); }
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isEmailModalOpen, isPasswordModalOpen]);

  // ✅ PROFILE UPDATE
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setUpdating(true);
    clearActionStatus();
    try {
      console.log('✏️ Updating profile for:', currentUser.email);
      await axios.post(`${API_BASE}/api/identity/update-profile`, { 
        email: currentUser.email, 
        fullName: fullName.trim(), 
        twoStep 
      });
      setActionStatus({ type: 'success', message: 'Profile updated!' });
      setTimeout(clearActionStatus, 4000);
    } catch (err) {
      console.error('❌ Profile update failed:', err);
      setActionStatus({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    } finally { 
      setUpdating(false); 
    }
  };

  // ✅ LOGOUT - FIXED TO CLEAR CORRECT KEYS
  const handleSystemLogout = () => {
    console.log('🚪 Logging out...');
    
    // Clear all possible auth keys
    localStorage.removeItem("token");
    localStorage.removeItem("eraX_auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    
    console.log('✅ Logged out successfully');
    window.location.href = "/login";
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (deleting) return;
    
    const firstConfirm = window.confirm(
      "⚠️ WARNING: This will permanently delete your account, balances, transaction history, and all personal data.\n\nThis action CANNOT be undone.\n\nDo you want to continue?"
    );
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "🔒 FINAL CONFIRMATION: Are you absolutely sure you want to proceed with permanent account deletion?"
    );
    if (!secondConfirm) return;

    try {
      setDeleting(true);
      setActionStatus({ type: null, message: '' });
      
      console.log('🗑️ Initiating account deletion for:', currentUser?.email);
      
      await axios.delete(`${API_BASE}/api/identity/delete`, { 
        data: { email: currentUser.email } 
      });

      // Clear all auth keys
      localStorage.removeItem("token");
      localStorage.removeItem("eraX_auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAuthenticated");
      
      setActionStatus({ 
        type: 'success', 
        message: 'Account permanently deleted. Redirecting...' 
      });
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      console.error('❌ Account deletion failed:', err);
      setActionStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to delete account. Please contact support.' 
      });
    } finally {
      setDeleting(false);
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="profile-loading-fallback">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading profile...</span>
      </div>
    );
  }

  // ✅ NO USER STATE
  if (!currentUser) {
    return (
      <div className="profile-debug-container">
        <div className="debug-card">
          <h2>⚠️ Profile Not Loaded</h2>
          <p>No user data found. Please login again.</p>
          
          <div className="debug-actions">
            <button className="btn btn-primary-submit" onClick={() => window.location.href = "/login"}>
              Go to Login
            </button>
          </div>
          
          {actionStatus.message && (
            <div className={`status-alert ${actionStatus.type}`} style={{ marginTop: '16px' }}>
              {actionStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{actionStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ✅ RENDER PROFILE
  return (
    <>
      <div className="profile-card">
        <h2 className="section-title">My Profile</h2>
        <hr className="title-divider" />

        {actionStatus.message && (
          <div className={`status-alert ${actionStatus.type}`}>
            {actionStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{actionStatus.message}</span>
            <button onClick={clearActionStatus} className="alert-close"><X size={14} /></button>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="profile-form">
          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-placeholder">
                {avatarPreview && !avatarFailed ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="avatar-image"
                    onError={(e) => {
                      console.error('❌ Failed to load avatar:', avatarPreview);
                      setAvatarFailed(true);
                    }}
                    onLoad={() => {
                      console.log('✅ Avatar loaded successfully');
                    }}
                  />
                ) : (
                  <span className="avatar-initials">{getInitials()}</span>
                )}
              </div>
              {avatarUploading && (
                <div className="avatar-upload-overlay">
                  <RefreshCw className="animate-spin" size={24} />
                </div>
              )}
            </div>
            <div className="avatar-actions">
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-input"
                disabled={avatarUploading}
              />
              <button 
                type="button" 
                className="btn btn-outline-gold-small"
                onClick={handleAvatarClick}
                disabled={avatarUploading}
              >
                <Upload size={14} className="btn-icon" /> 
                {avatarUploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              
              {avatarPreview && !avatarUploading && (
                <button 
                  type="button" 
                  className="btn btn-outline-red-small"
                  onClick={handleRemoveAvatar}
                  disabled={avatarUploading}
                >
                  <X size={14} /> Remove
                </button>
              )}
              
              {avatarFile && !avatarUploading && (
                <button 
                  type="button" 
                  className="btn btn-primary-submit"
                  style={{ minWidth: 'auto', padding: '6px 16px', fontSize: '13px' }}
                  onClick={handleAvatarUpload}
                  disabled={avatarUploading}
                >
                  Save Photo
                </button>
              )}
              
              {avatarFailed && avatarPreview && (
                <button 
                  type="button" 
                  className="btn btn-outline-gold-small"
                  onClick={() => {
                    setAvatarFailed(false);
                    const avatarUrl = currentUser.avatarUrl;
                    const fullUrl = avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}?t=${Date.now()}`;
                    setAvatarPreview(fullUrl);
                  }}
                >
                  <RefreshCw size={14} /> Retry
                </button>
              )}
            </div>
            {avatarError && (
              <p className="field-error" style={{ marginTop: '8px', width: '100%', textAlign: 'center' }}>
                <AlertCircle size={14} /> {avatarError}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><User size={16} /></span>
              <input 
                id="fullName" 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Enter your full name" 
                required 
                minLength={2}
                autoCapitalize="words"
              />
            </div>
          </div>

          {/* Email */}
          <div className="security-row">
            <div className="form-group flex-grow">
              <label>Email Address</label>
              <div className="input-wrapper read-only">
                <span className="input-icon"><Mail size={16} /></span>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  readOnly 
                />
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-action-gold align-self-end" 
              onClick={() => { 
                resetEmailModal();
                setIsEmailModalOpen(true);
              }}
            >
              Change Email
            </button>
          </div>

          {/* Password */}
          <div className="security-row">
            <div className="form-group flex-grow">
              <label>Password</label>
              <div className="input-wrapper read-only">
                <span className="input-icon"><Lock size={16} /></span>
                <input type="password" value="••••••••••••••••" readOnly />
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-action-gold align-self-end" 
              onClick={() => {
                resetPasswordModal();
                setIsPasswordModalOpen(true);
              }}
            >
              Change Password
            </button>
          </div>

          {/* Features */}
          <section className="features-list">
            {/* 2FA */}
            <div className="feature-item">
              <div className="feature-icon-wrapper gold-tint"><ShieldCheck size={18} /></div>
              <div className="feature-details">
                <h4>2-Step Verification</h4>
                <p>Add an additional layer of security to your account.</p>
              </div>
              <div className="feature-action toggle-container">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={twoStep} 
                    onChange={() => setTwoStep(!twoStep)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Logout */}
            <div className="feature-item">
              <div className="feature-icon-wrapper gold-tint"><LogOut size={18} /></div>
              <div className="feature-details">
                <h4>Log Out</h4>
                <p>Safely disconnect your session.</p>
              </div>
              <div className="feature-action">
                <button 
                  type="button" 
                  onClick={handleSystemLogout} 
                  className="btn btn-outline-gold-small"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Delete */}
            <div className="feature-item">
              <div className="feature-icon-wrapper red-tint"><Trash2 size={18} /></div>
              <div className="feature-details">
                <h4 className="text-red">Delete Account</h4>
                <p>Permanently remove all your data.</p>
              </div>
              <div className="feature-action">
                <button 
                  type="button" 
                  onClick={handleDeleteAccount} 
                  className="btn btn-outline-red-small"
                  disabled={deleting}
                  aria-label="Delete account permanently"
                >
                  {deleting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={updating} 
            className="btn btn-primary-submit"
          >
            {updating ? <RefreshCw size={16} className="animate-spin" /> : "Update Profile"}
          </button>
        </form>
      </div>

      {/* EMAIL MODAL */}
      {isEmailModalOpen && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setIsEmailModalOpen(false)}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Email</h3>
              <button 
                className="modal-close" 
                onClick={() => { 
                  setIsEmailModalOpen(false); 
                  resetEmailModal(); 
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {emailStep === 'input' ? (
                <>
                  <p className="modal-instruction">
                    Enter your new email. We'll send a verification code to your current email to confirm the change.
                  </p>
                  <div className="form-group">
                    <label>New Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Mail size={16} /></span>
                      <input 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => { 
                          setNewEmail(e.target.value); 
                          if (emailError) setEmailError(''); 
                        }} 
                        placeholder="new.email@example.com" 
                        disabled={emailUpdating} 
                        autoFocus 
                      />
                    </div>
                    {emailError && (
                      <p className="field-error" role="alert">
                        <AlertCircle size={14} /> {emailError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="modal-instruction">
                    Enter the 6-digit code sent to <strong>{currentUser.email}</strong>
                  </p>
                  <div className="form-group">
                    <label>Verification Code</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><ShieldCheck size={16} /></span>
                      <input 
                        type="text" 
                        inputMode="numeric" 
                        maxLength={6} 
                        value={emailOtp} 
                        onChange={(e) => { 
                          setEmailOtp(e.target.value.replace(/\D/g, '')); 
                          if (emailError) setEmailError(''); 
                        }} 
                        placeholder="000000" 
                        disabled={emailUpdating} 
                        autoFocus 
                      />
                    </div>
                    {emailError && (
                      <p className="field-error" role="alert">
                        <AlertCircle size={14} /> {emailError}
                      </p>
                    )}
                    <button 
                      type="button" 
                      className="btn btn-outline-gold-small" 
                      onClick={handleResendOtp} 
                      disabled={emailUpdating} 
                      style={{ marginTop: '8px', fontSize: '12px' }}
                    >
                      Resend Code
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              {emailStep === 'input' ? (
                <>
                  <button 
                    type="button" 
                    className="btn btn-outline-gold" 
                    onClick={() => { 
                      setIsEmailModalOpen(false); 
                      resetEmailModal(); 
                    }} 
                    disabled={emailUpdating}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary-submit" 
                    style={{ width: 'auto', padding: '10px 24px' }} 
                    onClick={handleRequestEmailChange} 
                    disabled={emailUpdating || !newEmail}
                  >
                    {emailUpdating ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-outline-gold" 
                    onClick={() => setEmailStep('input')} 
                    disabled={emailUpdating}
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary-submit" 
                    style={{ width: 'auto', padding: '10px 24px' }} 
                    onClick={handleVerifyEmailChange} 
                    disabled={emailUpdating || emailOtp.length !== 6}
                  >
                    {emailUpdating ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      "Verify & Update"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setIsPasswordModalOpen(false)}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close" 
                onClick={() => { 
                  setIsPasswordModalOpen(false); 
                  resetPasswordModal(); 
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-instruction">
                Enter your current password, then choose a new secure password.
              </p>
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword} 
                    onChange={(e) => { 
                      setCurrentPassword(e.target.value); 
                      if (passwordError) setPasswordError(''); 
                    }} 
                    placeholder="••••••••" 
                    disabled={passwordUpdating} 
                    autoComplete="current-password" 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => { 
                      setNewPassword(e.target.value); 
                      if (passwordError) setPasswordError(''); 
                    }} 
                    placeholder="Min. 8 characters" 
                    disabled={passwordUpdating} 
                    autoComplete="new-password" 
                    minLength={8} 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowNewPassword(!showNewPassword)} 
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => { 
                      setConfirmPassword(e.target.value); 
                      if (passwordError) setPasswordError(''); 
                    }} 
                    placeholder="Re-enter new password" 
                    disabled={passwordUpdating} 
                    autoComplete="new-password" 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="field-error" role="alert">
                    <AlertCircle size={14} /> {passwordError}
                  </p>
                )}
              </div>
              <div className="password-requirements">
                <small>Password must be at least 8 characters long.</small>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline-gold" 
                onClick={() => { 
                  setIsPasswordModalOpen(false); 
                  resetPasswordModal(); 
                }} 
                disabled={passwordUpdating}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary-submit" 
                style={{ width: 'auto', padding: '10px 24px' }} 
                onClick={handlePasswordChange} 
                disabled={passwordUpdating || !currentPassword || !newPassword || !confirmPassword}
              >
                {passwordUpdating ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfile;