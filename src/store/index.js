import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api';
const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

// ── Auth Store (persisted to localStorage) ───────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      signup: (name, email, password) => {
        // Store credentials in a separate localStorage key
        const users = JSON.parse(localStorage.getItem('true-angel-users') || '[]');
        const exists = users.find(u => u.email === email);
        if (exists) return { success: false, error: 'An account with this email already exists.' };

        users.push({ name, email, password });
        localStorage.setItem('true-angel-users', JSON.stringify(users));

        const user = { id: DEFAULT_USER_ID, name, email };
        set({ user, isAuthenticated: true, hasCompletedOnboarding: true });
        return { success: true };
      },

      login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('true-angel-users') || '[]');
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) return { success: false, error: 'Invalid email or password.' };

        const user = { id: DEFAULT_USER_ID, name: found.name, email: found.email };
        set({ user, isAuthenticated: true, hasCompletedOnboarding: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'true-angel-auth',
    }
  )
);

// ── Settings Store ───────────────────────────────────────────
export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      fontSize: 'normal',
      contrast: 'normal',
      timeFormat: '12h',
      voiceAnnouncements: true,
      voiceLanguage: 'en-US',
      setTheme: (theme) => set({ theme }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      toggleVoiceAnnouncements: () => set((state) => ({ voiceAnnouncements: !state.voiceAnnouncements })),
      setVoiceLanguage: (voiceLanguage) => set({ voiceLanguage }),
      toggleLargeText: () => set((state) => ({ fontSize: state.fontSize === 'normal' ? 'large' : 'normal' })),
      toggleHighContrast: () => set((state) => ({ contrast: state.contrast === 'normal' ? 'high' : 'normal' })),
    }),
    {
      name: 'true-angel-settings',
    }
  )
);

// ── Medicine Store ───────────────────────────────────────────
export const useMedicineStore = create((set) => ({
  medicines: [],
  fetchMedicines: async () => {
    try {
      const res = await fetch(`${API_URL}/medicines`);
      const data = await res.json();
      set({ medicines: data });
    } catch (err) { console.error(err); }
  },
  addMedicine: async (med) => {
    try {
      const res = await fetch(`${API_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med)
      });
      const newMed = await res.json();
      set((state) => ({ medicines: [...state.medicines, newMed] }));
    } catch (err) { console.error(err); }
  },
  deleteMedicine: async (id) => {
    try {
      await fetch(`${API_URL}/medicines/${id}`, { method: 'DELETE' });
      set((state) => ({ medicines: state.medicines.filter(m => m.id !== id) }));
    } catch (err) { console.error(err); }
  },
  markTaken: async (id) => {
    try {
      const res = await fetch(`${API_URL}/medicines/${id}/take`, { method: 'PUT' });
      const updatedMed = await res.json();
      set((state) => ({
        medicines: state.medicines.map(m => m.id === id ? updatedMed : m)
      }));
    } catch (err) { console.error(err); }
  }
}));

// ── Alarm Store ──────────────────────────────────────────────
export const useAlarmStore = create((set) => ({
  alarms: [],
  fetchAlarms: async () => {
    try {
      const res = await fetch(`${API_URL}/alarms`);
      const data = await res.json();
      set({ alarms: data });
    } catch (err) { console.error(err); }
  },
  addAlarm: async (alarm) => {
    try {
      const res = await fetch(`${API_URL}/alarms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alarm)
      });
      const newAlarm = await res.json();
      set((state) => ({ alarms: [...state.alarms, newAlarm] }));
    } catch (err) { console.error(err); }
  },
  deleteAlarm: async (id) => {
    try {
      await fetch(`${API_URL}/alarms/${id}`, { method: 'DELETE' });
      set((state) => ({ alarms: state.alarms.filter(a => a.id !== id) }));
    } catch (err) { console.error(err); }
  },
  toggleAlarm: async (id) => {
    try {
      const res = await fetch(`${API_URL}/alarms/${id}/toggle`, { method: 'PUT' });
      const updatedAlarm = await res.json();
      set((state) => ({
        alarms: state.alarms.map(a => a.id === id ? updatedAlarm : a)
      }));
    } catch (err) { console.error(err); }
  }
}));

// ── Reminder Store ───────────────────────────────────────────
export const useReminderStore = create((set) => ({
  reminders: [],
  fetchReminders: async () => {
    try {
      const res = await fetch(`${API_URL}/reminders`);
      const data = await res.json();
      set({ reminders: data });
    } catch (err) { console.error(err); }
  },
  addReminder: async (rem) => {
    try {
      const res = await fetch(`${API_URL}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rem)
      });
      const newRem = await res.json();
      set((state) => ({ reminders: [...state.reminders, newRem] }));
    } catch (err) { console.error(err); }
  },
  deleteReminder: async (id) => {
    try {
      await fetch(`${API_URL}/reminders/${id}`, { method: 'DELETE' });
      set((state) => ({ reminders: state.reminders.filter(r => r.id !== id) }));
    } catch (err) { console.error(err); }
  },
  toggleReminder: async (id) => {
    try {
      const res = await fetch(`${API_URL}/reminders/${id}/toggle`, { method: 'PUT' });
      const updatedRem = await res.json();
      set((state) => ({
        reminders: state.reminders.map(r => r.id === id ? updatedRem : r)
      }));
    } catch (err) { console.error(err); }
  }
}));

// ── Health Store ─────────────────────────────────────────────
export const useHealthStore = create((set) => ({
  waterIntake: 2,
  waterGoal: 8,
  addWater: () => set((state) => ({ waterIntake: Math.min(state.waterIntake + 1, state.waterGoal) })),
}));

// ── Contact Store ────────────────────────────────────────────
export const useContactStore = create((set) => ({
  contacts: [],
  fetchContacts: async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      set({ contacts: data });
    } catch (err) { console.error(err); }
  },
  addContact: async (contact) => {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      const newContact = await res.json();
      set((state) => ({ contacts: [...state.contacts, newContact] }));
    } catch (err) { console.error(err); }
  },
  deleteContact: async (id) => {
    try {
      await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
      set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) }));
    } catch (err) { console.error(err); }
  },
  updateContact: async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedContact = await res.json();
      set((state) => ({
        contacts: state.contacts.map(c => c.id === id ? updatedContact : c)
      }));
    } catch (err) { console.error(err); }
  }
}));

// ── Notification Preferences Store ───────────────────────────
export const useNotificationStore = create(
  persist(
    (set) => ({
      medicineReminders: true,
      alarmAlerts: true,
      dailySummary: false,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      toggleMedicineReminders: () => set((s) => ({ medicineReminders: !s.medicineReminders })),
      toggleAlarmAlerts: () => set((s) => ({ alarmAlerts: !s.alarmAlerts })),
      toggleDailySummary: () => set((s) => ({ dailySummary: !s.dailySummary })),
      toggleQuietHours: () => set((s) => ({ quietHoursEnabled: !s.quietHoursEnabled })),
      setQuietHoursStart: (v) => set({ quietHoursStart: v }),
      setQuietHoursEnd: (v) => set({ quietHoursEnd: v }),
    }),
    { name: 'true-angel-notifications' }
  )
);

// ── Privacy Preferences Store ────────────────────────────────
export const usePrivacyStore = create(
  persist(
    (set) => ({
      analyticsConsent: false,
      toggleAnalytics: () => set((s) => ({ analyticsConsent: !s.analyticsConsent })),
    }),
    { name: 'true-angel-privacy' }
  )
);
