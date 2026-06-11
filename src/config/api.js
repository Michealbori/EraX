// API Configuration for EraX
// Automatically switches between localhost and production URL

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth & Identity
  REGISTER: `${API_BASE}/api/identity/register`,
  LOGIN: `${API_BASE}/api/identity/login`,
  VERIFY_OTP: `${API_BASE}/api/identity/verify-otp`,
  RESEND_OTP: `${API_BASE}/api/identity/resend-otp`,
  
  // Referrals
  VALIDATE_REFERRAL: (code) => `${API_BASE}/api/identity/validate-referral/${code}`,
  GET_REFERRAL_CODE: (email) => `${API_BASE}/api/identity/referral-code/${email}`,
  GET_REFERRAL_STATS: (email) => `${API_BASE}/api/identity/referral-stats/${email}`,
  
  // Profile
  GET_PROFILE: (email) => `${API_BASE}/api/identity/profile?email=${email}`,
  UPDATE_PROFILE: `${API_BASE}/api/identity/update-profile`,
  UPDATE_EMAIL: `${API_BASE}/api/identity/update-email`,
  SET_PASSWORD: `${API_BASE}/api/identity/set-password`,
  UPDATE_PASSWORD: `${API_BASE}/api/identity/update-password`,
  DELETE_ACCOUNT: `${API_BASE}/api/identity/delete-account`,
  REQUEST_EMAIL_CHANGE: `${API_BASE}/api/identity/request-email-change`,
  VERIFY_EMAIL_CHANGE: `${API_BASE}/api/identity/verify-email-change`,
  UPLOAD_AVATAR: `${API_BASE}/api/identity/upload-avatar`,
  DELETE_AVATAR: `${API_BASE}/api/identity/delete-avatar`,
  
  // Dashboard
  DASHBOARD_METRICS: (email) => `${API_BASE}/api/identity/dashboard-metrics?email=${email}`,
  
  // Investments
  CREATE_INVESTMENT: `${API_BASE}/api/investment/create`,
  GET_INVESTMENTS: (email) => `${API_BASE}/api/investment/user/${email}`,
  GET_SURVEY_QUESTIONS: (investmentId, email) => `${API_BASE}/api/investment/survey/${investmentId}?email=${email}`,
  SUBMIT_SURVEY: (id) => `${API_BASE}/api/investment/survey/${id}/submit`,
  CLAIM_INTEREST: (id) => `${API_BASE}/api/investment/interest/${id}/claim`,
  EARLY_WITHDRAWAL: (id) => `${API_BASE}/api/investment/interest/${id}/early-withdrawal`,
  
  // Deposits & Withdrawals
  CREATE_DEPOSIT: `${API_BASE}/api/deposit/create`,
  GET_DEPOSITS: (email) => `${API_BASE}/api/deposit/user/${email}`,
  CREATE_WITHDRAWAL: `${API_BASE}/api/withdrawal/create`,
  GET_WITHDRAWALS: (email) => `${API_BASE}/api/withdrawal/user/${email}`,
  
  // Health Check
  HEALTH: `${API_BASE}/api/health`
};

export default API_BASE;