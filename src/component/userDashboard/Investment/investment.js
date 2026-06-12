import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { 
  getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot 
} from 'firebase/firestore';
import { auth } from '../../../firebase'; 
import "./investment.css";
import { 
  BarChart3, ShieldCheck, Coins, 
  Layers, Zap, Clock, MessageSquare, Send, X, CheckCircle2, AlertCircle,
  RefreshCw, FileText, Gift, Trophy, Edit3
} from 'lucide-react';

const db = getFirestore();
import { API_ENDPOINTS } from "../../config/api";

const Investments = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  
  const [showInvestForm, setShowInvestForm] = useState(false);
  const [investAsset, setInvestAsset] = useState('stocks');
  const [investAmount, setInvestAmount] = useState('');
  const [investLoading, setInvestLoading] = useState(false);
  const [investError, setInvestError] = useState('');
  const [investSuccess, setInvestSuccess] = useState('');
  
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyResponses, setSurveyResponses] = useState({});
  const [surveyLoading, setSurveyLoading] = useState(false);
  
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalInvestment, setWithdrawalInvestment] = useState(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  
  const [investments, setInvestments] = useState([]);
  const [investmentSummary, setInvestmentSummary] = useState({
    totalInvested: 0,
    totalPendingInterest: 0,
    maturedCount: 0,
    activeCount: 0,
    investmentCount: 0
  });
  
  const chatEndRef = useRef(null);

  const [financials, setFinancials] = useState({
    totalPortfolio: 0,
    netProfitLoss: 0,
    availableLiquidity: 0
  });
  
  const [allocationData, setAllocationData] = useState({ 
    stocks: 0, bonds: 0, commodities: 0 
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photo: user.photoURL || null
        });
        await fetchAllData(user.email);
      } else {
        setCurrentUser(null);
        setLoadingMetrics(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchAllData = async (email) => {
    try {
      const metricsResponse = await axios.get(`${API_BASE}/api/identity/dashboard-metrics?email=${email}`);
      if (metricsResponse.data.success) {
        setFinancials(metricsResponse.data.balances);
        setAllocationData(metricsResponse.data.allocations);
      }

      const investmentsResponse = await axios.get(`${API_BASE}/api/investment/user/${email}`);
      if (investmentsResponse.data.success) {
        setInvestments(investmentsResponse.data.investments);
        setInvestmentSummary(investmentsResponse.data.summary);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => fetchAllData(currentUser.email), 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const chatQuery = query(collection(db, 'investment_chat'), orderBy('timestamp', 'asc'), limit(50));
    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      const liveMessages = [];
      snapshot.forEach((doc) => liveMessages.push({ id: doc.id, ...doc.data() }));
      setMessages(liveMessages);
    });
    return () => unsubscribeChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || sending) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'investment_chat'), {
        text: newMessage,
        uid: currentUser.uid,
        userName: currentUser.name,
        userPhoto: currentUser.photo,
        timestamp: new Date()
      });
      setNewMessage('');
    } catch (error) {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleInvestSubmit = async (e) => {
    e.preventDefault();
    setInvestError('');
    setInvestSuccess('');
    
    const amount = parseFloat(investAmount);
    
    if (!amount || amount <= 0) {
      setInvestError('Please enter a valid amount');
      return;
    }
    if (amount > financials.availableLiquidity) {
      setInvestError(`Amount exceeds available balance ($${financials.availableLiquidity.toFixed(2)})`);
      return;
    }
    if (amount < 50) {
      setInvestError('Minimum investment is $50');
      return;
    }

    setInvestLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/api/investment/create`, {
        email: currentUser.email,
        assetClass: investAsset,
        amount: amount
      });

      if (response.data.success) {
        setInvestSuccess(response.data.message);
        setInvestAmount('');
        await fetchAllData(currentUser.email);
        
        setTimeout(() => {
          setShowInvestForm(false);
          setInvestSuccess('');
        }, 4000);
      }
    } catch (err) {
      setInvestError(err.response?.data?.message || 'Failed to process investment');
    } finally {
      setInvestLoading(false);
    }
  };

  const handleOpenSurvey = async (investment) => {
    setSelectedInvestment(investment);
    setSurveyResponses({});
    setSurveyLoading(true);
    
    try {
      const response = await axios.get(`${API_BASE}/api/investment/survey-questions/${investment.id}?email=${currentUser.email}`);
      
      if (response.data.success) {
        setSurveyQuestions(response.data.questions);
        setShowSurveyModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load survey questions');
    } finally {
      setSurveyLoading(false);
    }
  };

  const handleSurveyAnswer = (questionId, answer) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!selectedInvestment) return;
    
    const unanswered = surveyQuestions.filter(q => !surveyResponses[q.questionId]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }
    
    setSurveyLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/investment/submit-survey/${selectedInvestment.id}`, {
        email: currentUser.email,
        responses: surveyResponses
      });

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        setShowSurveyModal(false);
        await fetchAllData(currentUser.email);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit survey');
    } finally {
      setSurveyLoading(false);
    }
  };

  const handleEarlyWithdrawal = async () => {
    if (!withdrawalInvestment) return;
    
    if (!window.confirm(`⚠️ Are you sure you want to withdraw early?\n\nYou will receive $${withdrawalInvestment.earlyWithdrawalInfo.payout} (penalty: $${withdrawalInvestment.earlyWithdrawalInfo.penalty})`)) {
      return;
    }
    
    setWithdrawalLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/investment/early-withdrawal/${withdrawalInvestment.id}`, {
        email: currentUser.email
      });

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        setShowWithdrawalModal(false);
        await fetchAllData(currentUser.email);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process early withdrawal');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const handleClaimInterest = async (investmentId) => {
    if (!window.confirm('Claim your interest? The amount will be added to your available balance.')) return;
    
    try {
      const response = await axios.post(`${API_BASE}/api/investment/claim-interest/${investmentId}`, {
        email: currentUser.email
      });

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        await fetchAllData(currentUser.email);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim interest');
    }
  };

  const handleSetMax = () => {
    setInvestAmount(financials.availableLiquidity.toFixed(2));
  };

  const getAssetIcon = (assetClass) => {
    switch (assetClass) {
      case 'stocks': return <BarChart3 size={18} />;
      case 'bonds': return <ShieldCheck size={18} />;
      case 'commodities': return <Coins size={18} />;
      default: return <Coins size={18} />;
    }
  };

  const getStatusBadge = (investment) => {
    if (investment.interestStatus === 'claimed') {
      return <span className="status-badge claimed">✅ Claimed</span>;
    }
    if (investment.interestStatus === 'survey_completed') {
      return <span className="status-badge ready"> Ready to Claim</span>;
    }
    if (investment.interestStatus === 'survey_assigned') {
      return <span className="status-badge in-progress">📝 Survey In Progress</span>;
    }
    if (investment.isMatured && investment.interestStatus === 'pending') {
      return <span className="status-badge survey">📝 Take Survey</span>;
    }
    if (investment.isMatured) {
      return <span className="status-badge matured">📅 Survey Available</span>;
    }
    if (investment.interestStatus === 'early_withdrawn') {
      return <span className="status-badge withdrawn">⚠️ Early Withdrawn</span>;
    }
    return (
      <span className="status-badge active">
        <Clock size={12} /> {investment.hoursUntilMaturity}h left
      </span>
    );
  };

  const portfolioStats = [
    { 
      id: 1, label: 'Active Investments', 
      value: `$${investmentSummary.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
      change: `${investmentSummary.activeCount} positions`, isPositive: true 
    },
    { 
      id: 2, label: 'Pending Interest', 
      value: `$${investmentSummary.totalPendingInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
      change: `${investmentSummary.maturedCount} matured`, 
      isPositive: investmentSummary.totalPendingInterest > 0
    },
    { 
      id: 3, label: 'Available Balance', 
      value: `$${financials.availableLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
      change: '100% Daily Return', isPositive: true 
    }
  ];

  if (loadingMetrics) {
    return <div className="erax-dashboard-wrapper"><p className="loading-text">Loading portfolio...</p></div>;
  }

  return (
    <div className="erax-dashboard-wrapper">
      
      <div className="live-indicator investment-info-banner">
        <Gift size={16} />
        <span>Daily Investment Plan • 100% Return in 24 Hours • Early Withdrawal Available</span>
      </div>
      
      <div className="erax-stats-strip">
        {portfolioStats.map((stat) => (
          <div key={stat.id} className="erax-stat-node">
            <span className="erax-node-label">{stat.label}</span>
            <div className="erax-node-value-group">
              <h3>{stat.value}</h3>
              <span className={`erax-mini-badge ${stat.isPositive ? 'up' : 'down'}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="erax-split-workspace">
        
        <div className="erax-workspace-panel main-ledger-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="panel-title">My Investments</h3>
              <p className="panel-subtitle">{investments.length} total investments • Daily maturity cycle</p>
            </div>
            <button 
              className="btn-invest-open"
              onClick={() => setShowInvestForm(true)}
              disabled={financials.availableLiquidity <= 0}
            >
              <Zap size={14} /> Invest Now
            </button>
          </div>

          <div className="holdings-table-container">
            {investments.length > 0 ? (
              investments.map((inv) => (
                <div key={inv.id} className="holding-row-card investment-card">
                  <div className={`holding-icon-box ${inv.assetClass}-tint`}>
                    {getAssetIcon(inv.assetClass)}
                  </div>
                  <div className="holding-identity-cell">
                    <h4>{inv.symbol} Investment</h4>
                    <span>Principal: ${inv.amount}</span>
                    <span className="text-muted" style={{ fontSize: '11px' }}>
                      Matures: {new Date(inv.maturityDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="holding-data-cell text-right">
                    <span className="cell-top market-value">
                      Interest: ${inv.interestAmount}
                    </span>
                    {getStatusBadge(inv)}
                  </div>
                  <div className="investment-actions">
                    {!inv.isMatured && inv.interestStatus === 'pending' && (
                      <>
                        <span className="waiting-text">
                          <Clock size={12} /> {inv.hoursUntilMaturity}h
                        </span>
                        <button 
                          className="btn-early-withdraw"
                          onClick={() => {
                            setWithdrawalInvestment(inv);
                            setShowWithdrawalModal(true);
                          }}
                          title="Withdraw early (penalty applies)"
                        >
                          <AlertCircle size={14} /> Cash Out
                        </button>
                      </>
                    )}
                    
                    {inv.isMatured && (inv.interestStatus === 'pending' || inv.interestStatus === 'survey_assigned') && (
                      <button 
                        className={`btn-survey ${inv.interestStatus === 'survey_assigned' ? 'continue' : ''}`}
                        onClick={() => handleOpenSurvey(inv)}
                      >
                        {inv.interestStatus === 'survey_assigned' ? (
                          <><Edit3 size={14} /> Continue Survey</>
                        ) : (
                          <><FileText size={14} /> Take Survey</>
                        )}
                      </button>
                    )}
                    
                    {inv.interestStatus === 'survey_completed' && (
                      <button 
                        className="btn-claim"
                        onClick={() => handleClaimInterest(inv.id)}
                      >
                        <Gift size={14} /> Claim ${inv.interestAmount}
                      </button>
                    )}
                    {inv.interestStatus === 'claimed' && (
                      <span className="claimed-text">
                        <CheckCircle2 size={14} /> Claimed
                      </span>
                    )}
                    {inv.interestStatus === 'early_withdrawn' && (
                      <span className="early-withdrawn-text">
                        <AlertCircle size={14} /> Early Withdrawn
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No active investments yet.</p>
                <button className="btn-invest-open" onClick={() => setShowInvestForm(true)}>
                  Make Your First Investment
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="analytics-side-panel">
          
          <div className="inner-card how-it-works-card">
            <h4 className="card-title"><Trophy size={16} /> How It Works</h4>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Invest</strong>
                  <span>Choose amount & asset class</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Principal Returns</strong>
                  <span>Your investment returns to balance immediately</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Wait 24 Hours</strong>
                  <span>Interest accumulates (100% of principal)</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Complete Daily Survey</strong>
                  <span>Answer 10 random questions about markets</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-content">
                  <strong>Claim Interest</strong>
                  <span>Get your profit added to balance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="inner-card chat-card">
            <h4 className="card-title"><MessageSquare size={16} /> Community</h4>
            <div className="chat-messages">
              {messages.map((msg) => {
                const isMe = currentUser && msg.uid === currentUser.uid;
                return (
                  <div key={msg.id} className={`chat-msg ${isMe ? 'me' : ''}`}>
                    <span className="chat-name">{msg.userName}</span>
                    <p className="chat-text">{msg.text}</p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            {currentUser && (
              <form onSubmit={handleSendMessage} className="chat-form">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share insights..."
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <Clock size={14} /> : <Send size={14} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Investment Form Modal */}
      {showInvestForm && (
        <div className="modal-overlay" onClick={() => setShowInvestForm(false)}>
          <div className="modal-content invest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make an Investment</h3>
              <button className="modal-close" onClick={() => setShowInvestForm(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleInvestSubmit} className="invest-form">
              
              <div className="info-box">
                <Gift size={16} />
                <div>
                  <strong>100% Daily Return</strong>
                  <p>Your principal returns immediately. Interest (equal to your investment) unlocks after 24 hours + survey completion. Early withdrawal available with penalty.</p>
                </div>
              </div>

              <div className="form-section">
                <label>Available Balance</label>
                <div className="balance-display">
                  <Coins size={16} />
                  <strong>${financials.availableLiquidity.toFixed(2)}</strong>
                </div>
              </div>

              <div className="form-section">
                <label>Select Asset Class</label>
                <div className="asset-selector">
                  <button 
                    type="button"
                    className={`asset-btn ${investAsset === 'stocks' ? 'active' : ''}`}
                    onClick={() => setInvestAsset('stocks')}
                  >
                    <BarChart3 size={18} />
                    <span>Stocks</span>
                    <span className="asset-return">+100%/day</span>
                  </button>
                  <button 
                    type="button"
                    className={`asset-btn ${investAsset === 'bonds' ? 'active' : ''}`}
                    onClick={() => setInvestAsset('bonds')}
                  >
                    <ShieldCheck size={18} />
                    <span>Bonds</span>
                    <span className="asset-return">+100%/day</span>
                  </button>
                  <button 
                    type="button"
                    className={`asset-btn ${investAsset === 'commodities' ? 'active' : ''}`}
                    onClick={() => setInvestAsset('commodities')}
                  >
                    <Coins size={18} />
                    <span>Commodities</span>
                    <span className="asset-return">+100%/day</span>
                  </button>
                </div>
              </div>

              <div className="form-section">
                <label>Investment Amount (USD)</label>
                <div className="amount-input-group">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    min="50"
                    max={financials.availableLiquidity}
                    placeholder={`Min $50 • Max $${financials.availableLiquidity.toFixed(2)}`}
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    required
                  />
                  <button type="button" className="btn-max" onClick={handleSetMax}>MAX</button>
                </div>
                <p className="input-hint">
                  Invest ${investAmount || '0'} → Get ${investAmount || '0'} interest in 24 hours
                </p>
              </div>

              {investError && (
                <div className="form-message error">
                  <AlertCircle size={14} /> {investError}
                </div>
              )}
              {investSuccess && (
                <div className="form-message success">
                  <CheckCircle2 size={14} /> {investSuccess}
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowInvestForm(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={investLoading || !investAmount || parseFloat(investAmount) < 50}
                >
                  {investLoading ? (
                    <><RefreshCw size={16} className="spin" /> Processing...</>
                  ) : (
                    `Invest $${investAmount || '0'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Survey Modal */}
      {showSurveyModal && selectedInvestment && surveyQuestions.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowSurveyModal(false)}>
          <div className="modal-content survey-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{surveyQuestions[0]?.questionText ? 'EraX Daily Market Insights' : 'Survey'}</h3>
              <button className="modal-close" onClick={() => setShowSurveyModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="survey-modal-body">
              <div className="survey-info-box">
                <div className="info-row">
                  <span>Investment:</span>
                  <strong>${selectedInvestment.amount}</strong>
                </div>
                <div className="info-row">
                  <span>Interest to unlock:</span>
                  <strong className="text-gold">${selectedInvestment.interestAmount}</strong>
                </div>
                <div className="info-row">
                  <span>Questions:</span>
                  <strong>{surveyQuestions.length}</strong>
                </div>
              </div>

              <div className="survey-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(Object.keys(surveyResponses).length / surveyQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Object.keys(surveyResponses).length} / {surveyQuestions.length} answered
                </span>
              </div>

              <div className="survey-questions-container">
                {surveyQuestions.map((question) => (
                  <div key={question.questionId} className="survey-question-card">
                    <div className="question-header">
                      <span className="question-number">Q{question.questionId}</span>
                      <span className="question-text">{question.questionText}</span>
                    </div>
                    <div className="question-options">
                      {question.options.map((option, optIndex) => (
                        <label 
                          key={optIndex} 
                          className={`option-label ${surveyResponses[question.questionId] === option ? 'selected' : ''}`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${question.questionId}`}
                            value={option}
                            checked={surveyResponses[question.questionId] === option}
                            onChange={() => handleSurveyAnswer(question.questionId, option)}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowSurveyModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmitSurvey}
                disabled={surveyLoading || Object.keys(surveyResponses).length !== surveyQuestions.length}
              >
                {surveyLoading ? (
                  <><RefreshCw size={16} className="spin" /> Submitting...</>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Submit Survey & Unlock ${selectedInvestment.interestAmount}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Early Withdrawal Modal */}
      {showWithdrawalModal && withdrawalInvestment && (
        <div className="modal-overlay" onClick={() => setShowWithdrawalModal(false)}>
          <div className="modal-content withdrawal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Early Withdrawal</h3>
              <button className="modal-close" onClick={() => setShowWithdrawalModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="withdrawal-modal-body">
              <div className="warning-banner">
                <AlertCircle size={20} />
                <div>
                  <strong>Early Withdrawal Penalty</strong>
                  <p>Withdrawing before 24 hours will result in a penalty on your interest earnings.</p>
                </div>
              </div>

              <div className="withdrawal-details">
                <div className="detail-row">
                  <span>Investment Amount:</span>
                  <strong>${withdrawalInvestment.amount}</strong>
                </div>
                <div className="detail-row">
                  <span>Days Since Investment:</span>
                  <strong>{withdrawalInvestment.daysSinceInvestment} days</strong>
                </div>
                <div className="detail-row">
                  <span>Hours Until Maturity:</span>
                  <strong>{withdrawalInvestment.hoursUntilMaturity} hours</strong>
                </div>
                <div className="detail-row highlight">
                  <span>Original Interest:</span>
                  <strong>${withdrawalInvestment.earlyWithdrawalInfo.originalInterest}</strong>
                </div>
                <div className="detail-row penalty">
                  <span>Penalty ({withdrawalInvestment.earlyWithdrawalInfo.penaltyPercentage}%):</span>
                  <strong>-${withdrawalInvestment.earlyWithdrawalInfo.penalty}</strong>
                </div>
                <div className="detail-row payout">
                  <span>You Will Receive:</span>
                  <strong>${withdrawalInvestment.earlyWithdrawalInfo.payout}</strong>
                </div>
              </div>

              <div className="penalty-info">
                <h4>Penalty Structure:</h4>
                <ul>
                  <li>Days 1-7: 50% penalty on interest</li>
                  <li>Days 8-14: 30% penalty on interest</li>
                  <li>Days 15-21: 15% penalty on interest</li>
                  <li>Days 22-29: 5% penalty on interest</li>
                  <li>Day 30+: No penalty (complete survey for full interest)</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowWithdrawalModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleEarlyWithdrawal}
                disabled={withdrawalLoading}
              >
                {withdrawalLoading ? (
                  <><RefreshCw size={16} className="spin" /> Processing...</>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Confirm Early Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;