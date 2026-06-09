import React from 'react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import { useNotificationStore } from '../store';
import { Bell, Pill, Calendar, Clock } from 'lucide-react';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const {
    medicineReminders,
    alarmAlerts,
    dailySummary,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    toggleMedicineReminders,
    toggleAlarmAlerts,
    toggleDailySummary,
    toggleQuietHours,
    setQuietHoursStart,
    setQuietHoursEnd
  } = useNotificationStore();

  return (
    <>
      <Header title="Notifications" showBack />
      <div className="notifications-page-container animate-fadeInUp">
        
        {/* Alerts Section */}
        <section className="settings-section">
          <h3 className="text-label mb-sm">Alert Preferences</h3>
          <Card className="settings-card flex-col gap-md">
            
            {/* Medicine Reminders */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-info-light text-info">
                  <Pill size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Medicine Reminders</h4>
                  <p className="text-caption">Remind me when it is time to take doses</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={medicineReminders} 
                  onChange={toggleMedicineReminders} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <hr className="settings-divider" />

            {/* Alarm Alerts */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-warning-light text-warning-dark">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Vital Alarms</h4>
                  <p className="text-caption">Alert for general health checks and exercises</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={alarmAlerts} 
                  onChange={toggleAlarmAlerts} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <hr className="settings-divider" />

            {/* Daily Summary */}
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-success-light text-success-dark">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Daily Summary</h4>
                  <p className="text-caption">A health check report at the end of day</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={dailySummary} 
                  onChange={toggleDailySummary} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

          </Card>
        </section>

        {/* Quiet Hours Section */}
        <section className="settings-section mt-lg">
          <h3 className="text-label mb-sm">Quiet Hours</h3>
          <Card className="settings-card flex-col gap-md">
            
            <div className="settings-item flex-between gap-md">
              <div className="flex gap-sm">
                <div className="settings-icon bg-primary-light text-primary-dark">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">Do Not Disturb</h4>
                  <p className="text-caption">Mute all notification alerts during schedule</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={quietHoursEnabled} 
                  onChange={toggleQuietHours} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {quietHoursEnabled && (
              <div className="quiet-hours-times mt-sm flex gap-md animate-fadeIn">
                <div className="flex-1">
                  <label className="text-label">Starts At</label>
                  <input 
                    type="time" 
                    className="form-input quiet-time-input mt-xs" 
                    value={quietHoursStart} 
                    onChange={(e) => setQuietHoursStart(e.target.value)} 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-label">Ends At</label>
                  <input 
                    type="time" 
                    className="form-input quiet-time-input mt-xs" 
                    value={quietHoursEnd} 
                    onChange={(e) => setQuietHoursEnd(e.target.value)} 
                  />
                </div>
              </div>
            )}

          </Card>
        </section>

      </div>
    </>
  );
}
