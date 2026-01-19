import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import { BottomNav } from './components/layout';
import { AdminCountySwitcher } from './components/features';
import './styles/variables.css';
import './styles/reset.css';
import './styles/utilities.css';
import './App.css';

// Screens - Onboarding
import LoginScreen from './screens/onboarding/LoginScreen';
import RegisterScreen from './screens/onboarding/RegisterScreen';
import ForgotPasswordScreen from './screens/onboarding/ForgotPasswordScreen';
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import EngagementScreen from './screens/onboarding/EngagementScreen';

// Screens - Stack (local content stream with tabs)
import StackScreen from './screens/stack/StackScreen';
import BillDetailScreen from './screens/stack/BillDetailScreen';
import ElectionDetailScreen from './screens/stack/ElectionDetailScreen';
import VoiceDetailScreen from './screens/stack/VoiceDetailScreen';

// Screens - Leaders
import LeadersScreen from './screens/leaders/LeadersScreen';
import LeaderProfileScreen from './screens/leaders/LeaderProfileScreen';
import CandidateCompareScreen from './screens/leaders/CandidateCompareScreen';

// Screens - Media
import MediaScreen from './screens/media/MediaScreen';
import SourceProfileScreen from './screens/media/SourceProfileScreen';

// Screens - Learn
import LearnScreen from './screens/learn/LearnScreen';
import QuizScreen from './screens/learn/QuizScreen';

// Screens - Profile
import ProfileScreen from './screens/profile/ProfileScreen';
import SettingsScreen from './screens/profile/SettingsScreen';
import RebalanceScreen from './screens/profile/RebalanceScreen';

// Screens - Ghost Advisory
import GhostAdvisorScreen from './screens/ghost/GhostAdvisorScreen';

// Back button handler component
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Main navigation routes - these are "home" screens, hitting back should minimize app
    const mainRoutes = ['/home', '/leaders', '/media', '/learn', '/profile'];
    const isMainRoute = mainRoutes.includes(location.pathname);

    const handleBackButton = () => {
      if (isMainRoute) {
        // On a main tab, minimize the app instead of going back
        CapacitorApp.minimizeApp();
      } else {
        // On a sub-screen, use browser history to go back
        navigate(-1);
      }
    };

    // Listen for hardware back button
    const listener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      listener.then(l => l.remove());
    };
  }, [navigate, location.pathname]);

  return null;
}

function AppLayout() {
  return (
    <div className="app-container">
      <BackButtonHandler />
      <Outlet />
      <BottomNav />
      <AdminCountySwitcher />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter basename="/">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

          {/* Protected routes */}
          <Route path="/welcome" element={
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          } />
          <Route path="/engagement" element={
            <ProtectedRoute>
              <EngagementScreen />
            </ProtectedRoute>
          } />

          {/* Main App - Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<StackScreen />} />
            <Route path="bills/:id" element={<BillDetailScreen />} />
            <Route path="elections/:id" element={<ElectionDetailScreen />} />
            <Route path="voices/:id" element={<VoiceDetailScreen />} />
            <Route path="leaders" element={<LeadersScreen />} />
            <Route path="leaders/:id" element={<LeaderProfileScreen />} />
            <Route path="compare/:raceId" element={<CandidateCompareScreen />} />
            <Route path="media" element={<MediaScreen />} />
            <Route path="source/:id" element={<SourceProfileScreen />} />
            <Route path="learn" element={<LearnScreen />} />
            <Route path="quiz/:id" element={<QuizScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="rebalance" element={<RebalanceScreen />} />
            <Route path="ghost" element={<GhostAdvisorScreen />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
