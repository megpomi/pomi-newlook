import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PomiLoader from '@/components/PomiLoader';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Start from '@/pages/Start';
import Upgrade from '@/pages/Upgrade';
import CycleCalendar from '@/pages/CycleCalendar';
import CauseDetail from '@/pages/CauseDetail';
import Profile from '@/pages/Profile';
import ThankYou from '@/pages/ThankYou';
import Mission from '@/pages/Mission';
import LogToday from '@/pages/LogToday';
import DeleteAccount from '@/pages/DeleteAccount';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <PomiLoader />
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/ThankYou" element={<ThankYou />} />
      <Route path="/" element={<Start />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/calendar" element={<CycleCalendar />} />
        <Route path="/log-today" element={<LogToday />} />
        <Route path="/causes/:causeValue" element={<CauseDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/mission" element={<Mission />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App