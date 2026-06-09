import React, { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

export default function MedicineHistory() {
  const [activeTab, setActiveTab] = useState('medicines');

  // Mock history data for demonstration since we don't have a robust history store yet
  const medHistory = [
    { id: 1, date: 'Today', status: 'taken', time: '08:00 AM', name: 'Aspirin', type: 'med' },
    { id: 2, date: 'Yesterday', status: 'missed', time: '08:00 PM', name: 'Vitamin C', type: 'med' },
    { id: 3, date: 'Yesterday', status: 'taken', time: '08:00 AM', name: 'Aspirin', type: 'med' },
  ];

  const alarmHistory = [
    { id: 4, date: 'Today', status: 'taken', time: '07:00 AM', name: 'Wake Up', type: 'alarm' },
    { id: 5, date: 'Yesterday', status: 'missed', time: '14:30 PM', name: 'Drink Water', type: 'alarm' },
  ];

  const reminderHistory = [
    { id: 6, date: 'Today', status: 'taken', time: '10:00 AM', name: 'Call Doctor', type: 'reminder' }
  ];

  const getHistoryData = () => {
    if (activeTab === 'alarms') return alarmHistory;
    if (activeTab === 'reminders') return reminderHistory;
    return medHistory;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'taken': return <Check size={16} />;
      case 'missed': return <X size={16} />;
      case 'delayed': return <AlertTriangle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'taken': return 'success';
      case 'missed': return 'danger';
      case 'delayed': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status, type) => {
    if (type === 'med') return status === 'taken' ? 'Taken' : status === 'missed' ? 'Missed' : 'Delayed';
    if (type === 'alarm') return status === 'taken' ? 'Dismissed' : 'Snoozed/Missed';
    return status === 'taken' ? 'Completed' : 'Missed';
  }

  return (
    <>
      <Header title="History Logs" showBack />
      <div className="flex-col gap-md animate-fadeInUp">
        
        {/* Tabs */}
        <div className="tabs-container mx-md mt-sm">
          <button className={`tab-btn ${activeTab === 'medicines' ? 'active' : ''}`} onClick={() => setActiveTab('medicines')}>Medicines</button>
          <button className={`tab-btn ${activeTab === 'alarms' ? 'active' : ''}`} onClick={() => setActiveTab('alarms')}>Alarms</button>
          <button className={`tab-btn ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}>Reminders</button>
        </div>

        <div className="flex-col gap-sm">
          {getHistoryData().map(item => (
            <Card key={item.id} className="p-md flex-between">
              <div className="flex-col">
                <h4 className="text-body font-semibold">{item.name}</h4>
                <p className="text-caption mt-1">{item.date} • {item.time}</p>
              </div>
              <Badge variant={getStatusColor(item.status)} icon={() => getStatusIcon(item.status)}>
                {getStatusText(item.status, item.type)}
              </Badge>
            </Card>
          ))}
          {getHistoryData().length === 0 && (
             <p className="text-center text-muted mt-xl">No history found.</p>
          )}
        </div>

      </div>
    </>
  );
}
