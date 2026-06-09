import React, { useState } from 'react';
import { Plus, BellRing } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useAlarmStore } from '../store';
import './AlarmCenter.css';

export default function AlarmCenter() {
  const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useAlarmStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '07:00', label: 'Wake up', type: 'daily' });

  const handleAdd = () => {
    addAlarm({
      id: Date.now().toString(),
      time: newAlarm.time,
      label: newAlarm.label,
      type: newAlarm.type,
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
                  <span className="text-display font-medium">{alarm.time}</span>
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
            <label className="text-label">Time</label>
            <input 
              type="time" 
              className="form-input text-display text-center" 
              value={newAlarm.time}
              onChange={e => setNewAlarm({...newAlarm, time: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="text-label">Label</label>
            <input 
              type="text" 
              className="form-input text-h3" 
              value={newAlarm.label}
              onChange={e => setNewAlarm({...newAlarm, label: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="text-label">Repeat</label>
            <select 
              className="form-select text-body"
              value={newAlarm.type}
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
