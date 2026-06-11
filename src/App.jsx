import { useEffect, useState, useRef } from 'react';
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

// Services
import { voiceService } from './services/voiceService';

// Store
import { useMedicineStore, useAlarmStore, useReminderStore, useContactStore, useAuthStore, useSettingsStore } from './store';

// UI Components
import Modal from './components/UI/Modal';
import Button from './components/UI/Button';
import { BellRing } from 'lucide-react';

// Helper to format current time in Indian Standard Time (Asia/Kolkata)
// Returns 24-hour "HH:MM" format string.
const getKolkataTimeStr = () => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    let hour = '';
    let minute = '';
    for (const part of parts) {
      if (part.type === 'hour') hour = part.value;
      if (part.type === 'minute') minute = part.value;
    }
    // Normalization for environments that output 24 instead of 00
    if (hour === '24') hour = '00';
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch {
    // Fallback to local system time if timezone formatting fails
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
};

export default function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const fetchMedicines = useMedicineStore(state => state.fetchMedicines);
  const fetchAlarms = useAlarmStore(state => state.fetchAlarms);
  const fetchReminders = useReminderStore(state => state.fetchReminders);
  const fetchContacts = useContactStore(state => state.fetchContacts);
  const { theme, fontSize, contrast, voiceAnnouncements, voiceLanguage } = useSettingsStore();

  const voiceSettingsRef = useRef({ voiceAnnouncements, voiceLanguage });
  useEffect(() => {
    voiceSettingsRef.current = { voiceAnnouncements, voiceLanguage };
  }, [voiceAnnouncements, voiceLanguage]);

  // Active ringing states
  const [ringingAlarms, setRingingAlarms] = useState([]);
  const [ringingReminders, setRingingReminders] = useState([]);
  const [ringingMedicines, setRingingMedicines] = useState([]);

  // Store references & actions
  const alarms = useAlarmStore(state => state.alarms);
  const toggleAlarm = useAlarmStore(state => state.toggleAlarm);
  
  const reminders = useReminderStore(state => state.reminders);
  const toggleReminder = useReminderStore(state => state.toggleReminder);

  const medicines = useMedicineStore(state => state.medicines);
  const markTaken = useMedicineStore(state => state.markTaken);

  // References to keep checking loop functions static and stable
  const alarmsRef = useRef(alarms);
  const remindersRef = useRef(reminders);
  const medicinesRef = useRef(medicines);
  const isAuthenticatedRef = useRef(isAuthenticated);
  
  const firedAlarmsRef = useRef({ minute: '', ids: new Set() });
  const firedRemindersRef = useRef({ minute: '', ids: new Set() });
  const firedMedicinesRef = useRef({ minute: '', ids: new Set() });

  // Web Audio API refs for continuous alarm sound
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Web Audio API sound generator (pulsing beep-beep alarm tone)
  const startAlarmSound = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz tone

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      gain.gain.setValueAtTime(0.5, ctx.currentTime);

      // Pulse the sound volume every 250ms
      let isMuted = false;
      const pulseInterval = setInterval(() => {
        if (!gainNodeRef.current || !audioCtxRef.current) {
          clearInterval(pulseInterval);
          return;
        }
        gainNodeRef.current.gain.setValueAtTime(isMuted ? 0.5 : 0, audioCtxRef.current.currentTime);
        isMuted = !isMuted;
      }, 250);

      gain.pulseInterval = pulseInterval;
    } catch (err) {
      console.error('[Alarm Sound] Web Audio initialization failed:', err);
    }
  };

  const stopAlarmSound = () => {
    if (gainNodeRef.current && gainNodeRef.current.pulseInterval) {
      clearInterval(gainNodeRef.current.pulseInterval);
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (err) {
        console.warn('[Alarm Audio] Oscillator stop failed:', err);
      }
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (err) {
        console.warn('[Alarm Audio] GainNode disconnect failed:', err);
      }
      gainNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (err) {
        console.warn('[Alarm Audio] AudioContext close failed:', err);
      }
      audioCtxRef.current = null;
    }
  };

  // Sync state variables to stable refs
  useEffect(() => {
    alarmsRef.current = alarms;
  }, [alarms]);

  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  useEffect(() => {
    medicinesRef.current = medicines;
  }, [medicines]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Request browser notification permissions on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedicines();
      fetchAlarms();
      fetchReminders();
      fetchContacts();
    }
  }, [isAuthenticated, fetchMedicines, fetchAlarms, fetchReminders, fetchContacts]);

  // Apply visual theme settings to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [theme, fontSize, contrast]);

  // Clear ringing state if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setRingingAlarms(prev => prev.length > 0 ? [] : prev);
      setRingingReminders(prev => prev.length > 0 ? [] : prev);
      setRingingMedicines(prev => prev.length > 0 ? [] : prev);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isAuthenticated]);

  // Toggle alarm sound playback depending on ringing state
  useEffect(() => {
    if (ringingAlarms.length > 0 || ringingReminders.length > 0 || ringingMedicines.length > 0) {
      startAlarmSound();
    } else {
      stopAlarmSound();
    }
    return () => stopAlarmSound();
  }, [ringingAlarms, ringingReminders, ringingMedicines]);

  // 1-second Checking Engine Loop for Alarms, Reminders, and Medicines
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (!isAuthenticatedRef.current) return;

      const now = new Date();
      const kolkataTimeStr = getKolkataTimeStr();
      
      // Compute Local Datetime string for Reminders (YYYY-MM-DDTHH:MM)
      const tzOffset = now.getTimezoneOffset() * 60000;
      const localDateTimeStr = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);

      // Debug log displaying device time, India Standard Time, and alarm counts
      console.log(`[Notification Engine] IST: ${kolkataTimeStr} | Local: ${localDateTimeStr} | Alarms: ${alarmsRef.current.length} | Reminders: ${remindersRef.current.length} | Medicines: ${medicinesRef.current.length}`);

      // Reset de-duplication set if we entered a new minute in Kolkata timezone
      if (firedAlarmsRef.current.minute !== kolkataTimeStr) {
        firedAlarmsRef.current.minute = kolkataTimeStr;
        firedAlarmsRef.current.ids.clear();
      }
      // Use local minute for Reminders
      const localMinuteStr = localDateTimeStr.slice(11, 16);
      if (firedRemindersRef.current.minute !== localMinuteStr) {
        firedRemindersRef.current.minute = localMinuteStr;
        firedRemindersRef.current.ids.clear();
      }
      if (firedMedicinesRef.current.minute !== kolkataTimeStr) {
        firedMedicinesRef.current.minute = kolkataTimeStr;
        firedMedicinesRef.current.ids.clear();
      }

      // Check all active alarms
      const activeAlarms = alarmsRef.current.filter(a => a.enabled);
      activeAlarms.forEach(alarm => {
        if (alarm.time === kolkataTimeStr) {
          if (!firedAlarmsRef.current.ids.has(alarm.id)) {
            firedAlarmsRef.current.ids.add(alarm.id);

            setRingingAlarms(prev => {
              if (prev.some(p => p.id === alarm.id)) return prev;
              return [...prev, alarm];
            });

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`⏰ Alarm: ${alarm.label}`, {
                body: `It is now ${alarm.time} (IST). Time for your alarm.`,
                requireInteraction: true,
                tag: `alarm-${alarm.id}`
              });
            }
            if (voiceSettingsRef.current.voiceAnnouncements) {
              voiceService.speak(`It is time for your alarm: ${alarm.label}`, voiceSettingsRef.current.voiceLanguage);
            }
          }
        }
      });

      // Check reminders
      const pendingReminders = remindersRef.current.filter(r => !r.completed);
      pendingReminders.forEach(reminder => {
        if (reminder.date === localDateTimeStr || reminder.date === localMinuteStr /* fallback */) {
          if (!firedRemindersRef.current.ids.has(reminder.id)) {
            firedRemindersRef.current.ids.add(reminder.id);

            setRingingReminders(prev => {
              if (prev.some(p => p.id === reminder.id)) return prev;
              return [...prev, reminder];
            });

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`🔔 Reminder: ${reminder.text}`, {
                body: `Time for your scheduled reminder.`,
                requireInteraction: true,
                tag: `reminder-${reminder.id}`
              });
            }
            if (voiceSettingsRef.current.voiceAnnouncements) {
              voiceService.speak(`Reminder: ${reminder.text}`, voiceSettingsRef.current.voiceLanguage);
            }
          }
        }
      });

      // Check medicines
      const pendingMedicines = medicinesRef.current.filter(m => !m.takenToday);
      pendingMedicines.forEach(medicine => {
        // medicine.times is an array of strings e.g. ["08:00", "20:00"]
        if (medicine.times && medicine.times.includes(kolkataTimeStr)) {
          if (!firedMedicinesRef.current.ids.has(medicine.id)) {
            firedMedicinesRef.current.ids.add(medicine.id);

            setRingingMedicines(prev => {
              if (prev.some(p => p.id === medicine.id)) return prev;
              return [...prev, medicine];
            });

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`💊 Medicine: ${medicine.name}`, {
                body: `Time to take your medicine: ${medicine.dosage} ${medicine.dosageUnit}`,
                requireInteraction: true,
                tag: `medicine-${medicine.id}`
              });
            }
            if (voiceSettingsRef.current.voiceAnnouncements) {
              voiceService.speak(`Time to take your medicine: ${medicine.name}. Dosage is ${medicine.dosage} ${medicine.dosageUnit}.`, voiceSettingsRef.current.voiceLanguage);
            }
          }
        }
      });

    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  // Stops ringing alarms and disables any one-time alarms
  const handleStopAlarms = async () => {
    voiceService.stopSpeaking();
    const activeRinging = [...ringingAlarms];
    setRingingAlarms([]);

    for (const alarm of activeRinging) {
      if (alarm.type === 'one-time' && alarm.enabled) {
        try {
          await toggleAlarm(alarm.id);
        } catch (err) {
          console.error('[Alarm System] Failed to auto-disable one-time alarm:', err);
        }
      }
    }
  };

  const handleStopReminders = () => {
    voiceService.stopSpeaking();
    setRingingReminders([]);
  };
  
  const handleSnoozeReminder = (reminderId) => {
    voiceService.stopSpeaking();
    // Basic snooze logic: just remove from ringing, user can manually change time if needed.
    // In a fully featured version, we could update the DB with a new time + 10 mins.
    setRingingReminders(prev => prev.filter(r => r.id !== reminderId));
  };
  
  const handleCompleteReminder = async (reminderId) => {
    voiceService.stopSpeaking();
    try {
      await toggleReminder(reminderId);
      setRingingReminders(prev => prev.filter(r => r.id !== reminderId));
    } catch (err) {
      console.error('[Reminder System] Failed to complete reminder:', err);
    }
  };

  const handleStopMedicines = () => {
    voiceService.stopSpeaking();
    setRingingMedicines([]);
  };
  
  const handleSnoozeMedicine = (medicineId) => {
    voiceService.stopSpeaking();
    setRingingMedicines(prev => prev.filter(m => m.id !== medicineId));
  };
  
  const handleTakeMedicine = async (medicineId) => {
    voiceService.stopSpeaking();
    try {
      await markTaken(medicineId);
      setRingingMedicines(prev => prev.filter(m => m.id !== medicineId));
    } catch (err) {
      console.error('[Medicine System] Failed to mark taken:', err);
    }
  };

  return (
    <>
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

      {/* Global Alarm Triggering Popup Modal */}
      <Modal
        isOpen={ringingAlarms.length > 0}
        onClose={handleStopAlarms}
        title="⏰ Alarm Ringing!"
        showClose={false}
        size="sm"
      >
        <div className="flex-col gap-md text-center py-md animate-pulse">
          <div 
            className="mx-auto p-lg rounded-full mb-sm animate-bounce"
            style={{ 
              width: 'fit-content', 
              animationDuration: '1.2s',
              backgroundColor: 'var(--danger-light)', 
              color: 'var(--danger-dark)'
            }}
          >
            <BellRing size={48} />
          </div>
          {ringingAlarms.map(alarm => (
            <div key={alarm.id} className="alarm-trigger-details mb-md animate-scaleIn">
              <h2 className="text-display font-bold text-primary" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>
                {alarm.time}
              </h2>
              <p className="text-h2 font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                {alarm.label}
              </p>
              <span className="text-muted font-medium mt-xs block" style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                Repeat: {alarm.type === 'one-time' ? 'Once' : alarm.type}
              </span>
            </div>
          ))}
          <Button
            variant="danger"
            fullWidth
            size="lg"
            className="mt-md font-bold animate-pulse"
            style={{ padding: '16px' }}
            onClick={handleStopAlarms}
          >
            Stop Alarm
          </Button>
        </div>
      </Modal>

      {/* Global Reminder Triggering Popup Modal */}
      <Modal
        isOpen={ringingReminders.length > 0}
        onClose={handleStopReminders}
        title="🔔 Reminder"
        showClose={false}
        size="sm"
      >
        <div className="flex-col gap-md text-center py-md animate-pulse">
          {ringingReminders.map(reminder => (
            <div key={reminder.id} className="reminder-trigger-details mb-md animate-scaleIn">
              <h2 className="text-display font-bold text-primary" style={{ fontSize: '2rem' }}>
                {reminder.text}
              </h2>
              <p className="text-muted font-medium mt-xs block capitalize">
                Category: {reminder.category} | Priority: {reminder.priority}
              </p>
              <div className="flex gap-sm mt-md">
                <Button variant="success" fullWidth onClick={() => handleCompleteReminder(reminder.id)}>
                  Mark Complete
                </Button>
                <Button variant="secondary" fullWidth onClick={() => handleSnoozeReminder(reminder.id)}>
                  Snooze
                </Button>
              </div>
            </div>
          ))}
          <Button variant="danger" fullWidth className="mt-sm" onClick={handleStopReminders}>
            Stop Sound
          </Button>
        </div>
      </Modal>

      {/* Global Medicine Triggering Popup Modal */}
      <Modal
        isOpen={ringingMedicines.length > 0}
        onClose={handleStopMedicines}
        title="💊 Medicine Reminder"
        showClose={false}
        size="sm"
      >
        <div className="flex-col gap-md text-center py-md animate-pulse">
          {ringingMedicines.map(medicine => (
            <div key={medicine.id} className="medicine-trigger-details mb-md animate-scaleIn">
              <h2 className="text-display font-bold text-primary" style={{ fontSize: '2rem' }}>
                {medicine.name}
              </h2>
              <p className="text-h2 font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                {medicine.dosage} {medicine.dosageUnit}
              </p>
              <span className="text-muted font-medium mt-xs block">
                {medicine.notes || 'Time to take your medicine.'}
              </span>
              <div className="flex gap-sm mt-md">
                <Button variant="success" fullWidth onClick={() => handleTakeMedicine(medicine.id)}>
                  Mark as Taken
                </Button>
                <Button variant="secondary" fullWidth onClick={() => handleSnoozeMedicine(medicine.id)}>
                  Snooze
                </Button>
              </div>
            </div>
          ))}
          <Button variant="danger" fullWidth className="mt-sm" onClick={handleStopMedicines}>
            Stop Sound
          </Button>
        </div>
      </Modal>
    </>
  );
}
