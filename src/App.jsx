import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/Layout/AppShell';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Public Pages
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Pages
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Medicines from './pages/Medicines';
import AddMedicine from './pages/AddMedicine';
import MedicineHistory from './pages/MedicineHistory';
import AlarmCenter from './pages/AlarmCenter';
import ReminderCenter from './pages/ReminderCenter';
import AppSettings from './pages/AppSettings';
import NotificationsPage from './pages/NotificationsPage';
import FamilyCare from './pages/FamilyCare';
import PrivacyPage from './pages/PrivacyPage';

// Store
import { useMedicineStore, useAlarmStore, useReminderStore, useContactStore, useAuthStore, useSettingsStore } from './store';

export default function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const fetchMedicines = useMedicineStore(state => state.fetchMedicines);
  const fetchAlarms = useAlarmStore(state => state.fetchAlarms);
  const fetchReminders = useReminderStore(state => state.fetchReminders);
  const fetchContacts = useContactStore(state => state.fetchContacts);
  const { theme, fontSize, contrast } = useSettingsStore();

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedicines();
      fetchAlarms();
      fetchReminders();
      fetchContacts();
    }
  }, [isAuthenticated, fetchMedicines, fetchAlarms, fetchReminders, fetchContacts]);

  // Apply settings to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [theme, fontSize, contrast]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Public Routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="/add-medicine" element={<ProtectedRoute><AddMedicine /></ProtectedRoute>} />
          <Route path="/medicine-history" element={<ProtectedRoute><MedicineHistory /></ProtectedRoute>} />
          <Route path="/alarms" element={<ProtectedRoute><AlarmCenter /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><ReminderCenter /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppSettings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/family-care" element={<ProtectedRoute><FamilyCare /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
