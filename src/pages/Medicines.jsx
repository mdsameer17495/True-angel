import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, X, Clock, Calendar } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { useMedicineStore } from '../store';
import './Medicines.css';

export default function Medicines() {
  const navigate = useNavigate();
  const { medicines, markTaken, deleteMedicine } = useMedicineStore();

  return (
    <>
      <Header 
        title="Medicines" 
        rightAction={
          <button className="text-primary flex-center" onClick={() => navigate('/add-medicine')}>
            <Plus size={24} />
          </button>
        }
      />
      <div className="medicines-container animate-fadeInUp">
        
        {/* Weekly Adherence Summary */}
        <section className="mb-xl">
          <Card className="bg-primary-light text-primary-dark border-none">
            <div className="flex-between">
              <div>
                <h2 className="text-h2">Weekly Adherence</h2>
                <p className="opacity-80">You're doing great!</p>
              </div>
              <div className="text-display">92%</div>
            </div>
          </Card>
        </section>

        {/* Today's Schedule */}
        <section>
          <div className="flex-between mb-sm">
            <h2 className="text-h3">Today's Schedule</h2>
            <button className="text-link text-small flex-center" onClick={() => navigate('/medicine-history')}>
              History <Calendar size={14} className="ml-1" />
            </button>
          </div>

          <div className="medicine-list">
            {medicines.map(med => (
              <Card key={med.id} className="medicine-list-item flex-row gap-md">
                <div className="med-icon bg-info-light text-info">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex-between">
                    <h3 className="text-body font-semibold">{med.name}</h3>
                    <Badge variant={med.takenToday ? 'success' : 'default'}>
                      {med.takenToday ? 'Taken' : 'Upcoming'}
                    </Badge>
                  </div>
                  <p className="text-caption mt-1">{med.dosage} {med.dosageUnit} • {med.times.join(', ')}</p>
                </div>
                <div className="flex gap-xs ml-2">
                  {!med.takenToday && (
                    <Button size="sm" variant="outline" onClick={() => markTaken(med.id)}>
                      <Check size={16} />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-danger" onClick={() => deleteMedicine(med.id)}>
                    <X size={16} />
                  </Button>
                </div>
              </Card>
            ))}

            {medicines.length === 0 && (
              <Card className="text-center p-xl">
                <p className="text-muted">No medicines added yet.</p>
                <Button className="mt-md" onClick={() => navigate('/add-medicine')}>
                  Add Medicine
                </Button>
              </Card>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
