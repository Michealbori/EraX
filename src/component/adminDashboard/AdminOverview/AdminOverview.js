import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, AlertCircle, CheckCircle, XCircle, RefreshCw, 
  Search, Ban, Eye, Download, Clock, DollarSign, TrendingUp,
  User as UserIcon, Mail, Phone, MapPin, Calendar, Shield,
  CreditCard, TrendingDown, Activity, FileText, X
} from 'lucide-react';
import "./AdminOverview.css";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalVolume: 0,
    totalAdmins: 0,
    activeAdmins: 0
  });
  
  const [pendingActions, setPendingActions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);
  
  // User detail modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('No authentication token. Please log in again.');
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/adminLogin';
      }, 2000);
      return;
    }
    
    fetchAllAdminData();
    
    const interval = setInterval(() => {
      fetchAllAdminData(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllAdminData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    
    try {
      const [statsRes, pendingRes, activitiesRes, usersRes] = await Promise.all([
        adminApi.get('/api/admin/dashboard/stats'),
        adminApi.get('/api/admin/dashboard/pending-actions'),
        adminApi.get('/api/admin/dashboard/activities'),
        adminApi.get('/api/admin/users')
      ]);
      
      setStats(statsRes.data.stats || statsRes.data || {});
      setPendingActions(pendingRes.data.pending || pendingRes.data || []);
      setRecentActivities(activitiesRes.data.activities || activitiesRes.data || []);
      setUsers(usersRes.data.users || usersRes.data || []);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("❌ Failed to load admin data:", err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Redirecting to login...');
        localStorage.removeItem('adminToken');
        setTimeout(() => {
          window.location.href = '/adminLogin';
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('Access denied. Insufficient permissions.');
      } else if (err.response?.status === 404) {
        setError('API endpoints not found. Check backend configuration.');
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data from database.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const response = await adminApi.get(`/api/admin/users/${userId}`);
      if (response.data.success) {
        setSelectedUser(response.data.user);
        setShowUserModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load user details");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleAction = async (id, action, type) => {
    if (!window.confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this ${type}?`)) return;
    
    try {
      let endpoint;
      if (type === 'deposit') {
        endpoint = `/api/admin/dashboard/deposits/${id}`;
      } else if (type === 'withdrawal') {
        endpoint = `/api/admin/dashboard/withdrawals/${id}`;
      } else if (type === 'verification') {
        endpoint = `/api/admin/dashboard/users/${id}/verify`;
      } else {
        endpoint = `/api/admin/${type}/${id}`;
      }
      
      await adminApi.post(endpoint, { 
        action,
        adminId: 'admin-system'
      });
      
      await fetchAllAdminData();
      alert(`✅ ${action === 'approve' ? 'Approved' : 'Rejected'} successfully`);
      
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process action");
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Activate'} this user?`)) return;
    
    try {
      await adminApi.patch(`/api/admin/users/${userId}/status`, { 
        status: newStatus,
        adminId: 'admin-system'
      });
      
      await fetchAllAdminData();
      alert(`✅ User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
      
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await adminApi.get('/api/admin/users/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `eraX-users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      alert("Failed to export data. Please try again.");
    }
  };

  const filteredPending = pendingActions.filter(item => 
    item.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const formatCurrency = (amount) => {
    return `$${(amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  if (loading && !stats.totalUsers) {
    return (
      <div className="admin-container">
        <div className="loading-state">
          <RefreshCw size={24} className="spin" />
          <p>Loading live data from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-state">
          <AlertCircle size={24} className="text-red" />
          <p>{error}</p>
          <button onClick={() => fetchAllAdminData()} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p className="header-subtitle">
            Live data from MongoDB database
            {lastUpdated && (
              <span className="last-updated">
                {' • Last updated: ' + lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button onClick={() => fetchAllAdminData()} className="btn-refresh" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> 
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span>Total Users</span>
            <strong>{stats.totalUsers?.toLocaleString() || 0}</strong>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={20} className="text-green" />
          <div>
            <span>Active Users</span>
            <strong>{stats.activeUsers?.toLocaleString() || 0}</strong>
          </div>
        </div>
        <div className="stat-card warning">
          <AlertCircle size={20} />
          <div>
            <span>Pending Verifications</span>
            <strong>{stats.pendingVerifications || 0}</strong>
          </div>
        </div>
        <div className="stat-card warning">
          <DollarSign size={20} />
          <div>
            <span>Pending Deposits</span>
            <strong>{stats.pendingDeposits || 0}</strong>
          </div>
        </div>
        <div className="stat-card warning">
          <DollarSign size={20} />
          <div>
            <span>Pending Withdrawals</span>
            <strong>{stats.pendingWithdrawals || 0}</strong>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign size={20} className="text-gold" />
          <div>
            <span>Total Volume</span>
            <strong>{formatCurrency(stats.totalVolume)}</strong>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search users, emails, or IDs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'pending' ? 'active' : ''}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingActions.length})
          </button>
          <button 
            className={activeTab === 'activity' ? 'active' : ''}
            onClick={() => setActiveTab('activity')}
          >
            Activity Log
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            User Management ({users.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="pending-list">
          <h3>Actions Requiring Approval - Live Data</h3>
          {filteredPending.length > 0 ? (
            filteredPending.map((item) => (
              <div key={`${item.type}-${item.id}`} className="pending-item">
                <div className="item-info">
                  <div className="item-header">
                    <span className={`item-type ${item.type}`}>{item.type?.toUpperCase()}</span>
                    <span className="item-id">#{item.id?.slice(-6)}</span>
                  </div>
                  <strong>{item.user?.email || item.user || 'Unknown'}</strong>
                  {item.amount && (
                    <span className="item-amount">{formatCurrency(item.amount)}</span>
                  )}
                  <span className="item-time">
                    <Clock size={12} /> {formatDate(item.createdAt)}
                  </span>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleAction(item.id, 'approve', item.type)}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleAction(item.id, 'reject', item.type)}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">
              {searchQuery ? 'No results found.' : '✅ All caught up! No pending actions in database.'}
            </p>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="activity-list">
          <h3>System Activity Log - Real-Time</h3>
          {recentActivities.length > 0 ? (
            recentActivities.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon">
                  {item.action?.includes('approved') ? (
                    <CheckCircle size={16} className="text-green" />
                  ) : item.action?.includes('rejected') ? (
                    <XCircle size={16} className="text-red" />
                  ) : item.action?.includes('suspended') ? (
                    <Ban size={16} className="text-orange" />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
                <div className="activity-content">
                  <span className="activity-action">{item.action}</span>
                  <span className="activity-user">
                    {item.admin ? `Admin: ${item.admin}` : `User: ${item.user?.email || item.user}`}
                  </span>
                </div>
                <span className="activity-time">{formatDate(item.timestamp || item.createdAt)}</span>
              </div>
            ))
          ) : (
            <p className="empty-msg">No recent activity in database.</p>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="user-management">
          <div className="user-list-header">
            <h3>User Directory - {users.length} Users in Database</h3>
            <button className="btn-export" onClick={handleExportUsers}>
              <Download size={14} /> Export CSV
            </button>
          </div>
          
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Total Portfolio</th>
                  <th>Investments</th>
                  <th>Deposits</th>
                  <th>Withdrawals</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => 
                    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.fullName || 'N/A'}</strong>
                        <br/>
                        <small className="text-muted">ID: {user._id?.slice(-6)}</small>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="balance-amount">
                          {formatCurrency(user.balances?.availableLiquidity)}
                        </span>
                      </td>
                      <td>
                        <strong className="total-portfolio">
                          {formatCurrency(user.stats?.totalPortfolio)}
                        </strong>
                      </td>
                      <td>
                        <span className="stat-mini">
                          {user.stats?.totalInvestments || 0}
                          <small>{formatCurrency(user.stats?.totalInvested)}</small>
                        </span>
                      </td>
                      <td>
                        <span className="stat-mini">
                          {user.stats?.totalDeposits || 0}
                          <small>{formatCurrency(user.stats?.totalDeposited)}</small>
                        </span>
                      </td>
                      <td>
                        <span className="stat-mini">
                          {user.stats?.totalWithdrawals || 0}
                          <small>{formatCurrency(user.stats?.totalWithdrawn)}</small>
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status || 'active'}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewUserDetails(user._id)}
                            title="View complete profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className={`btn-status ${user.status === 'suspended' ? 'activate' : 'suspend'}`}
                            onClick={() => handleToggleUserStatus(user._id, user.status || 'active')}
                            title={user.status === 'suspended' ? 'Activate user' : 'Suspend user'}
                          >
                            <Ban size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <UserIcon size={24} />
                Complete User Profile
              </h2>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>
                <X size={20} />
              </button>
            </div>

            {loadingUserDetails ? (
              <div className="loading-state">
                <RefreshCw size={24} className="spin" />
                <p>Loading user details...</p>
              </div>
            ) : (
              <div className="modal-body">
                {/* User Info Section */}
                <div className="detail-section">
                  <h3><UserIcon size={18} /> Personal Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span>Full Name</span>
                      <strong>{selectedUser.fullName || 'N/A'}</strong>
                    </div>
                    <div className="info-item">
                      <span>Email</span>
                      <strong>{selectedUser.email}</strong>
                    </div>
                    <div className="info-item">
                      <span>Phone</span>
                      <strong>{selectedUser.phone || 'Not provided'}</strong>
                    </div>
                    <div className="info-item">
                      <span>User ID</span>
                      <strong className="mono">{selectedUser._id}</strong>
                    </div>
                    <div className="info-item">
                      <span>Joined</span>
                      <strong>{formatDate(selectedUser.createdAt)}</strong>
                    </div>
                    <div className="info-item">
                      <span>Status</span>
                      <span className={`status-badge ${selectedUser.status || 'active'}`}>
                        {selectedUser.status || 'active'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span>Verified</span>
                      <strong>{selectedUser.isVerified ? '✅ Yes' : '❌ No'}</strong>
                    </div>
                    <div className="info-item">
                      <span>2FA Enabled</span>
                      <strong>{selectedUser.twoStep ? '✅ Yes' : '❌ No'}</strong>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="detail-section">
                  <h3><DollarSign size={18} /> Financial Summary</h3>
                  <div className="financial-grid">
                    <div className="financial-card">
                      <span>Available Balance</span>
                      <strong className="text-gold">{formatCurrency(selectedUser.balances?.availableLiquidity)}</strong>
                    </div>
                    <div className="financial-card">
                      <span>Total Portfolio</span>
                      <strong className="text-green">{formatCurrency(selectedUser.stats?.totalPortfolio)}</strong>
                    </div>
                    <div className="financial-card">
                      <span>Total Deposited</span>
                      <strong>{formatCurrency(selectedUser.stats?.deposits?.completed)}</strong>
                    </div>
                    <div className="financial-card">
                      <span>Total Withdrawn</span>
                      <strong>{formatCurrency(selectedUser.stats?.withdrawals?.completed)}</strong>
                    </div>
                    <div className="financial-card">
                      <span>Total Invested</span>
                      <strong>{formatCurrency(selectedUser.stats?.investments?.total)}</strong>
                    </div>
                    <div className="financial-card">
                      <span>Current Investment Value</span>
                      <strong className="text-blue">{formatCurrency(selectedUser.stats?.investments?.currentValue)}</strong>
                    </div>
                  </div>
                </div>

                {/* Recent Deposits */}
                {selectedUser.deposits && selectedUser.deposits.length > 0 && (
                  <div className="detail-section">
                    <h3><TrendingUp size={18} /> Recent Deposits ({selectedUser.deposits.length})</h3>
                    <div className="data-list">
                      {selectedUser.deposits.slice(0, 5).map((deposit) => (
                        <div key={deposit._id} className="data-item">
                          <div className="data-info">
                            <strong>{formatCurrency(deposit.amount)}</strong>
                            <span className={`status-badge small ${deposit.status}`}>{deposit.status}</span>
                          </div>
                          <span className="data-time">{formatDate(deposit.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Withdrawals */}
                {selectedUser.withdrawals && selectedUser.withdrawals.length > 0 && (
                  <div className="detail-section">
                    <h3><TrendingDown size={18} /> Recent Withdrawals ({selectedUser.withdrawals.length})</h3>
                    <div className="data-list">
                      {selectedUser.withdrawals.slice(0, 5).map((withdrawal) => (
                        <div key={withdrawal._id} className="data-item">
                          <div className="data-info">
                            <strong>{formatCurrency(withdrawal.amount)}</strong>
                            <span className={`status-badge small ${withdrawal.status}`}>{withdrawal.status}</span>
                          </div>
                          <span className="data-time">{formatDate(withdrawal.requestedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Investments */}
                {selectedUser.investments && selectedUser.investments.length > 0 && (
                  <div className="detail-section">
                    <h3><Activity size={18} /> Recent Investments ({selectedUser.investments.length})</h3>
                    <div className="data-list">
                      {selectedUser.investments.slice(0, 5).map((investment) => (
                        <div key={investment._id} className="data-item">
                          <div className="data-info">
                            <strong>{investment.symbol} - {formatCurrency(investment.amount)}</strong>
                            <span className={`status-badge small ${investment.status}`}>{investment.status}</span>
                          </div>
                          <span className="data-time">{formatDate(investment.investedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}