import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Calendar, AlertCircle, X } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useReminderStore } from '../store';
import './ReminderCenter.css';

export default function ReminderCenter() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useReminderStore();
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    category: 'tasks',
    priority: 'low',
    date: new Date().toISOString().split('T')[0]
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'appointments', label: 'Appts' },
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'info';
  };

  const handleSave = () => {
    if (!formData.text.trim()) return;
    addReminder({
      id: Date.now().toString(),
      text: formData.text,
      category: formData.category,
      priority: formData.priority,
      date: formData.date,
      completed: false
    });
    setFormData({
      text: '',
      category: 'tasks',
      priority: 'low',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  const filteredReminders = reminders.filter(r => activeTab === 'all' || r.category === activeTab);

  return (
    <>
      <Header 
        title="Reminders" 
        rightAction={
          <button className="text-primary flex-center" onClick={() => setIsModalOpen(true)}>
            <Plus size={24} />
          </button>
        }
      />
      
      <div className="reminders-container animate-fadeInUp">
        
        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reminders List */}
        <div className="reminders-list">
          {filteredReminders.length > 0 ? filteredReminders.map(reminder => (
            <Card key={reminder.id} className="reminder-card flex-between gap-md">
              <div className="flex gap-md">
                <button className="check-btn text-muted flex-shrink-0" onClick={() => toggleReminder(reminder.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  {reminder.completed ? <CheckCircle size={24} className="text-success" /> : <Circle size={24} />}
                </button>
                <div className="flex-1">
                  <h3 className={`text-body font-medium ${reminder.completed ? 'line-through text-muted' : ''}`}>
                    {reminder.text}
                  </h3>
                  <div className="flex gap-sm mt-1">
                    <Badge variant={getPriorityColor(reminder.priority)} size="sm">
                      {reminder.priority}
                    </Badge>
                    {reminder.date && (
                      <Badge variant="default" size="sm" icon={Calendar}>
                        {reminder.date}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <button 
                className="text-danger flex-shrink-0" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                onClick={() => deleteReminder(reminder.id)}
                aria-label="Delete Reminder"
              >
                <X size={20} />
              </button>
            </Card>
          )) : (
            <Card className="text-center p-xl">
              <AlertCircle size={48} className="text-muted mx-auto mb-md opacity-50" />
              <p className="text-muted">No reminders for now.</p>
              <Button className="mt-md" onClick={() => setIsModalOpen(true)}>Create Reminder</Button>
            </Card>
          )}
        </div>

      </div>

      {/* New Reminder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Reminder">
        <div className="flex-col gap-md">
          <div className="form-group">
            <label className="text-label">Reminder Text</label>
            <input 
              type="text" 
              className="form-input text-body" 
              value={formData.text}
              onChange={e => setFormData({...formData, text: e.target.value})}
              placeholder="e.g. Schedule check-up"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="text-label">Category</label>
            <select 
              className="form-select text-body"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="tasks">Task</option>
              <option value="appointments">Appointment</option>
            </select>
          </div>

          <div className="form-group">
            <label className="text-label">Priority</label>
            <select 
              className="form-select text-body"
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="text-label">Date</label>
            <input 
              type="date" 
              className="form-input text-body" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <Button fullWidth className="mt-md" onClick={handleSave}>
            Save Reminder
          </Button>
        </div>
      </Modal>
    </>
  );
}
