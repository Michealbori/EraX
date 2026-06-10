import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ===== PUBLIC MARKETING & GUEST AUTH COMPONENTS =====
import Navbar from "./component/nav/nav";
import Landing from "./component/home/Landing";
import EraxGetStarted from "./component/getStarted/getStarted";
import Register from "./component/Register/Register";
import Login from "./component/Login/Login";
import OtpVerification from "./component/otp/otp";
import FeaturesPage from "./component/FeaturesPage/FeaturesPage";
import AboutUs from "./component/AboutUs/AboutUs";

// ===== ADMIN PANEL INFRASTRUCTURE COMPONENTS =====
import AdminLayout from "./component/adminDashboard/AdminLayout/AdminLayout";
import AdminLogin from "./component/adminDashboard/AdminLogin/AdminLogin";
import AdminOverview from "./component/adminDashboard/AdminOverview/AdminOverview";
import AdminRegister from "./component/adminDashboard/AdminRegister/AdminRegister";
import AssetVault from "./component/adminDashboard/assetVault/assetVault";
import MarketTelemetry from "./component/adminDashboard/MarketTelemetryTracker/MarketTelemetryTracker";
import EcosystemFineTuning from "./component/adminDashboard/ecosystemFineTuning/EcosystemFineTuning";
import AdminUserData from "./component/adminDashboard/AdminUserData/AdminUserData";

// ===== USER DASHBOARD PLATFORM COMPONENTS =====
import DashboardLayout from "./component/userDashboard/DashboardLayout/DashboardLayout";
import Overview from "./component/userDashboard/overView/overView";
import MyProfile from "./component/userDashboard/MyProfile/Myprofile";
import Investments from "./component/userDashboard/Investment/investment";
import Wallet from "./component/userDashboard/Wallet/Wallet";
import Deposit from "./component/userDashboard/Deposit/Deposit";
import Withdraw from "./component/userDashboard/withdraw/withdraw";
import Transactions from "./component/userDashboard/Transaction/transaction";
import Referrals from "./component/userDashboard/Referrals/Referrals";
import HelpCenter from "./component/userDashboard/HelpCenter/HelpCenter";

// ===== IMPORT REAL PROTECTED ROUTE =====
import ProtectedRoute from "./component/routes/ProtectedRoute.jsx";

/* ===== MARKETING VIEWPORT WRAPPER ===== */
const MarketingLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MARKETING SHELL */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Landing />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* PUBLIC AUTH CHANNELS */}
        <Route path="/getStarted" element={<EraxGetStarted />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />

        {/* ADMIN AUTH */}
        <Route path="/adminRegistration" element={<AdminRegister />} />
        <Route path="/adminLogin" element={<AdminLogin />} />

        {/* SECURED USER DASHBOARD */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={<Navigate to="/dashboard/overview" replace />}
            />

            <Route path="overview" element={<Overview />} />
            <Route path="investments" element={<Investments />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="settings" element={<MyProfile />} />
            <Route path="help" element={<HelpCenter />} />
          </Route>
        </Route>

        {/* SECURED ADMIN DASHBOARD element={<ProtectedRoute requiredStage="logged_in" />*/}
        <Route >
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="assets" element={<AssetVault />} />
            <Route path="analytics" element={<MarketTelemetry />} />
            <Route path="users" element={<AdminUserData />} />
            <Route path="settings" element={<EcosystemFineTuning />} />
          </Route>
        </Route>

        {/* GLOBAL FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;