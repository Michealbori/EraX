import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Globe, 
  Calendar, 
  Clock, 
  Search, 
  Trash2, 
  X, 
  Edit3,
  Plus,
  Coins,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import "./AdminUserData.css";

import { API_ENDPOINTS } from "../../config/api";

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function OperatorNodes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [newUser, setNewUser] = useState({ 
    name: "", 
    email: "", 
    tier: "Level 1 Auth",
    usdtBalance: "0.00",
    btcBalance: "0.0000",
    ltcBalance: "0.00",
    ethBalance: "0.0000"
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch users from database
  useEffect(() => {
    fetchUsers();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUsers(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    
    try {
      console.log("📡 Fetching users from database...");
      
      const response = await adminApi.get('/api/admin/user-management');
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        console.log(`✅ Loaded ${response.data.users?.length || 0} users`);
      }
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser({ 
      ...user,
      usdtBalance: user.balances.usdt,
      btcBalance: user.balances.btc,
      ltcBalance: user.balances.ltc,
      ethBalance: user.balances.eth
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await adminApi.put(`/api/admin/user-management/${selectedUser.id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        tier: selectedUser.tier,
        usdtBalance: selectedUser.usdtBalance,
        btcBalance: selectedUser.btcBalance,
        ltcBalance: selectedUser.ltcBalance,
        ethBalance: selectedUser.ethBalance
      });

      if (response.data.success) {
        showNotification('✅ User updated successfully');
        setShowEditModal(false);
        setSelectedUser(null);
        await fetchUsers(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`⚠️ CRITICAL WARNING: Are you sure you want to completely purge User ${id} from the database? This action cannot be undone!`)) {
      return;
    }

    setActionLoading(true);
    
    try {
      const response = await adminApi.delete(`/api/admin/user-management/${id}`);

      if (response.data.success) {
        showNotification('✅ User deleted successfully');
        await fetchUsers(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert("Name and email are required");
      return;
    }

    setActionLoading(true);
    
    try {
      const response = await adminApi.post('/api/admin/user-management', {
        name: newUser.name,
        email: newUser.email,
        tier: newUser.tier,
        usdtBalance: newUser.usdtBalance || "0.00",
        btcBalance: newUser.btcBalance || "0.0000",
        ltcBalance: newUser.ltcBalance || "0.00",
        ethBalance: newUser.ethBalance || "0.0000"
      });

      if (response.data.success) {
        showNotification('✅ User created successfully');
        setNewUser({ 
          name: "", 
          email: "", 
          tier: "Level 1 Auth",
          usdtBalance: "0.00",
          btcBalance: "0.0000",
          ltcBalance: "0.00",
          ethBalance: "0.0000"
        });
        setShowCreateModal(false);
        await fetchUsers(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="nodes-system-workspace">
        <div className="loading-state">
          <RefreshCw size={24} className="spin" />
          <p>Loading users from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nodes-system-workspace">
      
      {/* Notification */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ===== MASTER MODULE HEADER ===== */}
      <header className="nodes-header">
        <div className="nodes-header-meta">
          <h1>EraX User Management</h1>
          <p>Supervise structural account profiles, wallet balance parameters, tracking metrics, and security authorizations.</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            className="refresh-btn"
            onClick={() => fetchUsers()}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            className="node-provision-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            <span>Provision New User</span>
          </button>
        </div>
      </header>

      {/* ===== ACTIONS MATRIX TRACK STACK ===== */}
      <section className="nodes-control-bar">
        <div className="search-input-housing">
          <Search size={16} className="search-icon-fixed" />
          <input 
            type="text" 
            placeholder="Filter database elements by name, token ID, or network address..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="total-nodes-pill">
          <Users size={14} />
          <span>Active Users Index: {users.length}</span>
        </div>
      </section>

      {/* ===== METADATA DATABASE GRID LIST ===== */}
      <section className="nodes-matrix-wrapper">
        <div className="nodes-responsive-table">
          <table className="nodes-data-table">
            <thead>
              <tr>
                <th>Identity Core / Tier</th>
                <th>Network Footprint</th>
                <th>Ecosystem Asset Ledger Balance</th>
                <th>Last Login Timestamp</th>
                <th className="text-center">Database Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="node-data-row-item">
                  
                  {/* Identity profile cell core */}
                  <td className="identity-profile-cell">
                    <div className="identity-avatar">{user.name?.charAt(0) || '?'}</div>
                    <div className="identity-text-stack">
                      <button 
                        type="button" 
                        className="clickable-identity-name-btn"
                        onClick={() => handleOpenEditModal(user)}
                        title="Open Control Terminal for this Operator"
                      >
                        <span className="id-core-name">{user.name}</span>
                        <Edit3 size={11} className="inline-edit-icon-hint" />
                      </button>
                      
                      <span className="id-sub-email">{user.email} <code className="mini-id-code">[{user.id?.slice(-6)}]</code></span>
                      <span className={`id-clearance-badge ${user.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                        {user.tier}
                      </span>
                    </div>
                  </td>

                  {/* Footprint access tracking */}
                  <td className="footprint-metadata-cell">
                    <div className="meta-line">
                      <Globe size={14} />
                      <span>{user.location}</span>
                    </div>
                    <div className="meta-sub-hash">
                      <code>{user.ip}</code>
                    </div>
                  </td>

                  {/* LIQUID LEDGER BALANCES DISPLAY GRID */}
                  <td className="ledger-balance-cell">
                    <div className="balance-mini-matrix">
                      <div className="balance-pill"><span className="lbl green">USDT</span> <span className="val">{user.balances.usdt}</span></div>
                      <div className="balance-pill"><span className="lbl gold">BTC</span> <span className="val">{user.balances.btc}</span></div>
                      <div className="balance-pill"><span className="lbl grey">LTC</span> <span className="val">{user.balances.ltc}</span></div>
                      <div className="balance-pill"><span className="lbl blue">ETH</span> <span className="val">{user.balances.eth}</span></div>
                    </div>
                  </td>

                  {/* Specific timestamps */}
                  <td className="timestamp-cell">
                    <div className="meta-line">
                      <Calendar size={14} />
                      <span>{user.lastLoginDate}</span>
                    </div>
                    <div className="meta-line text-slate offset-top">
                      <Clock size={14} />
                      <span>{user.lastLoginTime}</span>
                    </div>
                  </td>

                  {/* Immediate purging/editing tools */}
                  <td className="actions-button-cell text-center">
                    <div className="actions-button-cluster-row">
                      <button 
                        type="button" 
                        className="node-action-icon-btn edit-accent"
                        onClick={() => handleOpenEditModal(user)}
                        title="Modify Parameters & Ledger"
                        disabled={actionLoading}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        type="button" 
                        className="node-action-icon-btn delete-accent"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Purge Account Vector"
                        disabled={actionLoading}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-search-notice">
                    {searchTerm ? 'No database indices found matching query parameters.' : 'No users in database. Click "Provision New User" to add one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== POPUP 1: INTERACTIVE USER EDITING & LEDGER MODIFIER ===== */}
      {showEditModal && selectedUser && (
        <div className="modal-backdrop-blur">
          <div className="modal-terminal-box core-edit-variant">
            <div className="modal-terminal-header">
              <div className="title-cluster">
                <Edit3 size={18} className="text-gold" />
                <h3>Modify Operator & Balances: <code className="accent-code-title">{selectedUser.id?.slice(-6)}</code></h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => { setShowEditModal(false); setSelectedUser(null); }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="modal-terminal-form">
              <div className="form-split-scroller">
                
                <h4 className="terminal-sub-heading">Profile Configurations</h4>
                <div className="modal-form-group">
                  <label>Modify Profile Username</label>
                  <input 
                    type="text" 
                    required 
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>

                <div className="modal-form-group">
                  <label>Secure Communication Email</label>
                  <input 
                    type="email" 
                    required 
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>

                <div className="modal-form-group">
                  <label>Clearance Threshold Allocation</label>
                  <select 
                    value={selectedUser.tier} 
                    onChange={(e) => setSelectedUser({...selectedUser, tier: e.target.value})}
                  >
                    <option value="Level 1 Auth">Level 1 Auth (Standard Pipeline View)</option>
                    <option value="Level 2 Auth">Level 2 Auth (Vault Intermediary)</option>
                    <option value="Level 5 Auth">Level 5 Auth (Full Core Infrastructure Clearance)</option>
                  </select>
                </div>

                <h4 className="terminal-sub-heading balances-divider"><Coins size={12} /> Asset Ledger Balance Adjustments</h4>
                <div className="balance-inputs-grid">
                  <div className="modal-form-group">
                    <label>USDT Balance</label>
                    <input 
                      type="text" 
                      value={selectedUser.usdtBalance}
                      onChange={(e) => setSelectedUser({...selectedUser, usdtBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>BTC Balance</label>
                    <input 
                      type="text" 
                      value={selectedUser.btcBalance}
                      onChange={(e) => setSelectedUser({...selectedUser, btcBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>LTC Balance</label>
                    <input 
                      type="text" 
                      value={selectedUser.ltcBalance}
                      onChange={(e) => setSelectedUser({...selectedUser, ltcBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>ETH Balance</label>
                    <input 
                      type="text" 
                      value={selectedUser.ethBalance}
                      onChange={(e) => setSelectedUser({...selectedUser, ethBalance: e.target.value})}
                    />
                  </div>
                </div>

              </div>

              <div className="modal-terminal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => { setShowEditModal(false); setSelectedUser(null); }} disabled={actionLoading}>
                  Abort Override
                </button>
                <button type="submit" className="modal-submit-btn commit-edit-accent" disabled={actionLoading}>
                  {actionLoading ? (
                    <><RefreshCw size={14} className="spin" /> Applying...</>
                  ) : (
                    'Apply State Parameters'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== POPUP 2: PROVISION NEW USER MODAL ===== */}
      {showCreateModal && (
        <div className="modal-backdrop-blur">
          <div className="modal-terminal-box core-edit-variant">
            <div className="modal-terminal-header">
              <div className="title-cluster">
                <UserPlus size={18} className="text-gold" />
                <h3>Provision New Ecosystem Account</h3>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="modal-terminal-form">
              <div className="form-split-scroller">
                
                <div className="modal-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>

                <div className="modal-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="e.g. j.doe@erax.io"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div className="modal-form-group">
                  <label>Clearance Allocation</label>
                  <select 
                    value={newUser.tier} 
                    onChange={(e) => setNewUser({...newUser, tier: e.target.value})}
                  >
                    <option value="Level 1 Auth">Level 1 Auth (Standard Pipeline View)</option>
                    <option value="Level 2 Auth">Level 2 Auth (Vault Intermediary)</option>
                    <option value="Level 5 Auth">Level 5 Auth (Full Core Infrastructure Clearance)</option>
                  </select>
                </div>

                <h4 className="terminal-sub-heading balances-divider"><Coins size={12} /> Assign Base Opening Balances</h4>
                <div className="balance-inputs-grid">
                  <div className="modal-form-group">
                    <label>USDT Balance</label>
                    <input 
                      type="text" 
                      placeholder="0.00"
                      value={newUser.usdtBalance}
                      onChange={(e) => setNewUser({...newUser, usdtBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>BTC Balance</label>
                    <input 
                      type="text" 
                      placeholder="0.0000"
                      value={newUser.btcBalance}
                      onChange={(e) => setNewUser({...newUser, btcBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>LTC Balance</label>
                    <input 
                      type="text" 
                      placeholder="0.00"
                      value={newUser.ltcBalance}
                      onChange={(e) => setNewUser({...newUser, ltcBalance: e.target.value})}
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>ETH Balance</label>
                    <input 
                      type="text" 
                      placeholder="0.0000"
                      value={newUser.ethBalance}
                      onChange={(e) => setNewUser({...newUser, ethBalance: e.target.value})}
                    />
                  </div>
                </div>

              </div>

              <div className="modal-terminal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowCreateModal(false)} disabled={actionLoading}>
                  Abort
                </button>
                <button type="submit" className="modal-submit-btn" disabled={actionLoading}>
                  {actionLoading ? (
                    <><RefreshCw size={14} className="spin" /> Initializing...</>
                  ) : (
                    'Initialize Credentials'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}