import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Droplets, Clock, ChevronRight, Activity, Plus } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useHealthStore, useAuthStore, useMedicineStore } from '../store';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { waterIntake, waterGoal, addWater } = useHealthStore();
  const { user } = useAuthStore();
  const { medicines, markTaken } = useMedicineStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const waterPercent = Math.round((waterIntake / waterGoal) * 100);
  const nextMedicine = medicines.find(m => !m.takenToday);

  return (
  <>
    <Header 
      title="True Angel" 
      rightAction={
        <button 
          className="text-secondary flex-center" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <Bell size={24} />
        </button>
      } 
      transparent 
    />
    
    {/* Overlap Fix: padding-top aur margin-top add kiya hai taaki content safe zone mein rahe */}
    <div 
      className="dashboard-container" 
      style={{ 
        paddingTop: '45px',     /* <-- Header ke overlapping se text bachane ke liye */
        paddingLeft: '16px', 
        paddingRight: '16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Greeting Section - Ab yeh Header ke peeche nahi chupegi */}
      <div className="greeting-section animate-fadeInUp stagger-1">
        <h1 className="text-h1">{getGreeting()}, {user?.name || 'User'}!</h1>
        <p className="text-secondary mt-1">Here is your care summary for today.</p>
      </div>

      {/* Next Medicine Card */}
      <section className="dashboard-section animate-fadeInUp stagger-2">
        <div className="section-header">
          <h2 className="text-h3">Next Medicine</h2>
          <button className="text-link text-small flex-center" onClick={() => navigate('/medicines')}>
            See All <ChevronRight size={14} />
          </button>
        </div>
        
        {nextMedicine ? (
          <Card variant="gradient" className="medicine-card" onClick={() => navigate('/medicines')}>
            <div className="flex-between gap-md align-start">
              <div className="overflow-hidden">
                <h3 className="text-h2 text-inverse truncate">{nextMedicine.name}</h3>
                <p className="card-secondary-text mt-1 truncate">
                  {nextMedicine.dosage} {nextMedicine.dosageUnit} {nextMedicine.instructions ? `• ${nextMedicine.instructions}` : ''}
                </p>
              </div>
              <div className="time-badge flex-shrink-0">
                <Clock size={16} /> {nextMedicine.times?.[0] || 'Scheduled'}
              </div>
            </div>
            <div className="mt-4 flex gap-sm">
              <Button 
                size="sm" 
                variant="secondary" 
                className="take-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  markTaken(nextMedicine.id);
                }}
              >
                Mark Taken
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="medicine-card-empty flex-col flex-center text-center gap-sm p-lg">
            <p className="text-muted text-body-sm">No pending medicines for today!</p>
            <Button size="sm" onClick={() => navigate('/add-medicine')} className="mt-xs">
              Add Medicine
            </Button>
          </Card>
        )}
      </section>

        {/* Quick Actions grid */}
        <section className="dashboard-section animate-fadeInUp stagger-3">
          <h2 className="text-h3 section-header">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Card className="action-card flex-col flex-center text-center gap-sm" onClick={() => navigate('/add-medicine')}>
              <div className="action-icon-bg bg-primary-light">
                <Plus size={24} className="text-primary-dark" />
              </div>
              <span className="text-small font-medium">Add Med</span>
            </Card>
            <Card className="action-card flex-col flex-center text-center gap-sm" onClick={() => navigate('/alarms')}>
              <div className="action-icon-bg bg-warning-light">
                <Bell size={24} className="text-warning-dark" />
              </div>
              <span className="text-small font-medium">Alarms</span>
            </Card>
            <Card className="action-card flex-col flex-center text-center gap-sm" onClick={() => navigate('/reminders')}>
              <div className="action-icon-bg bg-info-light">
                <Activity size={24} className="text-info" />
              </div>
              <span className="text-small font-medium">Reminder</span>
            </Card>
          </div>
        </section>

        {/* Health Tracker */}
        <section className="dashboard-section animate-fadeInUp stagger-4">
          <h2 className="text-h3 section-header">Daily Health</h2>
          <Card>
            <div className="flex-between">
              <div className="flex gap-md">
                <div className="water-icon-bg">
                  <Droplets size={24} className="text-info" />
                </div>
                <div>
                  <h3 className="text-body font-semibold">Water Intake</h3>
                  <p className="text-caption">{waterIntake} of {waterGoal} glasses</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addWater} disabled={waterIntake >= waterGoal}>
                + Add
              </Button>
            </div>
            <div className="progress-bar-container mt-3">
              <div className="progress-bar-fill" style={{ width: `${waterPercent}%` }} />
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
