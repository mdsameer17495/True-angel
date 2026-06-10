import React, { useState } from 'react';
import { Plus, BellRing } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useAlarmStore, useSettingsStore } from '../store';
import './AlarmCenter.css';

// ── Time Conversion Helpers ─────────────────────────────────

/**
 * Converts a 24-hour "HH:MM" string to 12-hour format components.
 * Handles edge cases:
 * - 00:00 -> 12:00 AM
 * - 12:00 -> 12:00 PM
 */
const convert24To12 = (timeStr) => {
  if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minStr;
  const period = hour >= 12 ? 'PM' : 'AM';
  
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  
  return {
    hour: String(hour12).padStart(2, '0'),
    minute,
    period
  };
};

/**
 * Converts 12-hour components back to a 24-hour "HH:MM" string.
 * Handles edge cases:
 * - 12:00 AM -> 00:00
 * - 12:00 PM -> 12:00
 */
const convert12To24 = (hour12, minute, period) => {
  let hour = parseInt(hour12, 10);
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  return `${String(hour).padStart(2, '0')}:${minute}`;
};

/**
 * Displays a 24-hour time string "HH:MM" in the desired format (12h/24h)
 */
const formatTime = (timeStr, format) => {
  if (!timeStr) return '';
  if (format === '24h') return timeStr;
  const { hour, minute, period } = convert24To12(timeStr);
  return `${hour}:${minute} ${period}`;
};

export default function AlarmCenter() {
  const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useAlarmStore();
  const { timeFormat } = useSettingsStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ label: 'Wake up', type: 'daily' });

  // Separate states for format-aware dropdown selections in the modal
  const [tempTime12, setTempTime12] = useState({ hour: '07', minute: '00', period: 'AM' });
  const [tempTime24, setTempTime24] = useState({ hour: '07', minute: '00' });

  const handleAdd = () => {
    let finalTime;
    if (timeFormat === '12h') {
      finalTime = convert12To24(tempTime12.hour, tempTime12.minute, tempTime12.period);
    } else {
      finalTime = `${tempTime24.hour}:${tempTime24.minute}`;
    }

    addAlarm({
      id: Date.now().toString(),
      time: finalTime,
      label: newAlarm.label || 'Alarm',
      type: newAlarm.type || 'daily',
      enabled: true
    });
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Header 
        title="Alarms" 
        rightAction={
          <button className="text-primary flex-center" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={24} />
          </button>
        }
      />
      <div className="alarm-center-container animate-fadeInUp">
        
        <div className="alarms-list">
          {alarms.map(alarm => (
            <Card key={alarm.id} className={`alarm-card flex-between ${!alarm.enabled ? 'opacity-60' : ''}`}>
              <div className="flex gap-md align-center">
                <div className="alarm-time">
                  <span className="text-display font-medium">{formatTime(alarm.time, timeFormat)}</span>
                </div>
                <div>
                  <h3 className="text-h3">{alarm.label}</h3>
                  <div className="flex gap-xs mt-1">
                    <Badge variant={alarm.enabled ? 'primary' : 'default'} size="sm">
                      {alarm.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex-col gap-sm align-end">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={alarm.enabled} 
                    onChange={() => toggleAlarm(alarm.id)} 
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button 
                  className="text-danger mt-1" 
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                  onClick={() => deleteAlarm(alarm.id)}
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}

          {alarms.length === 0 && (
            <Card className="text-center p-xl">
              <BellRing size={48} className="text-muted mx-auto mb-md opacity-50" />
              <p className="text-muted">No alarms set.</p>
              <Button className="mt-md" onClick={() => setIsAddModalOpen(true)}>
                Add Alarm
              </Button>
            </Card>
          )}
        </div>

      </div>

      {/* Add Alarm Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Alarm">
        <div className="flex-col gap-md">
          <div className="form-group">
            <label className="text-label mb-xs">Time</label>
            {timeFormat === '12h' ? (
              <div className="flex gap-sm justify-center">
                <div className="flex-1">
                  <span className="text-caption text-center block mb-xxs" style={{ fontWeight: 600 }}>Hour</span>
                  <select 
                    className="form-select text-center font-semibold text-body"
                    value={tempTime12.hour}
                    onChange={e => setTempTime12({ ...tempTime12, hour: e.target.value })}
                  >
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <span className="text-caption text-center block mb-xxs" style={{ fontWeight: 600 }}>Minute</span>
                  <select 
                    className="form-select text-center font-semibold text-body"
                    value={tempTime12.minute}
                    onChange={e => setTempTime12({ ...tempTime12, minute: e.target.value })}
                  >
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <span className="text-caption text-center block mb-xxs" style={{ fontWeight: 600 }}>AM/PM</span>
                  <select 
                    className="form-select text-center font-semibold text-body"
                    value={tempTime12.period}
                    onChange={e => setTempTime12({ ...tempTime12, period: e.target.value })}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex gap-sm justify-center">
                <div className="flex-1">
                  <span className="text-caption text-center block mb-xxs" style={{ fontWeight: 600 }}>Hour</span>
                  <select 
                    className="form-select text-center font-semibold text-body"
                    value={tempTime24.hour}
                    onChange={e => setTempTime24({ ...tempTime24, hour: e.target.value })}
                  >
                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <span className="text-caption text-center block mb-xxs" style={{ fontWeight: 600 }}>Minute</span>
                  <select 
                    className="form-select text-center font-semibold text-body"
                    value={tempTime24.minute}
                    onChange={e => setTempTime24({ ...tempTime24, minute: e.target.value })}
                  >
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="text-label">Label</label>
            <input 
              type="text" 
              className="form-input text-h3" 
              value={newAlarm.label || ''}
              onChange={e => setNewAlarm({...newAlarm, label: e.target.value})}
              placeholder="e.g. Wake up, Take medicine"
            />
          </div>
          <div className="form-group">
            <label className="text-label">Repeat</label>
            <select 
              className="form-select text-body"
              value={newAlarm.type || 'daily'}
              onChange={e => setNewAlarm({...newAlarm, type: e.target.value})}
            >
              <option value="one-time">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <Button fullWidth className="mt-md" onClick={handleAdd}>Save Alarm</Button>
        </div>
      </Modal>
    </>
  );
}
