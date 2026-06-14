import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useMedicineStore } from '../store';
import './AddMedicine.css';

export default function AddMedicine() {
  const navigate = useNavigate();
  const { addMedicine } = useMedicineStore();

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    dosageUnit: 'mg',
    frequency: 'daily',
    time: '08:00',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addMedicine({
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      dosageUnit: formData.dosageUnit,
      frequency: formData.frequency,
      times: [formData.time],
      notes: formData.notes,
      takenToday: false
    });

    // Animate and return
    setTimeout(() => navigate('/medicines'), 300);
  };

  return (
    <>
      <Header title="Add Medicine" showBack />
      <div className="add-medicine-container animate-fadeInUp"
      style={{ 
        paddingTop: '65px',     /* <-- Perfect header gap */
        paddingLeft: '16px', 
        paddingRight: '16px',
        paddingBottom: '100px', 
        boxSizing: 'border-box'
      }}
      >
        <form onSubmit={handleSubmit}>
          
          <Card className="mb-md p-md">
            <div className="form-group">
              <label className="text-label">Medicine Name</label>
              <input 
                type="text" 
                name="name"
                className="form-input text-h3" 
                placeholder="e.g. Aspirin"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
          </Card>

          <Card className="mb-md p-md grid grid-cols-2 gap-md">
            <div className="form-group">
              <label className="text-label">Dosage</label>
              <input 
                type="number" 
                name="dosage"
                className="form-input text-h3" 
                placeholder="100"
                value={formData.dosage}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="text-label">Unit</label>
              <select 
                name="dosageUnit"
                className="form-select text-h3"
                value={formData.dosageUnit}
                onChange={handleChange}
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="pill">pill(s)</option>
                <option value="drop">drop(s)</option>
              </select>
            </div>
          </Card>

          <Card className="mb-md p-md">
            <div className="form-group mb-md">
              <label className="text-label">Frequency</label>
              <select 
                name="frequency"
                className="form-select text-body"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="daily">Every day</option>
                <option value="twice">Twice a day</option>
                <option value="weekly">Once a week</option>
                <option value="as_needed">As needed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="text-label">Reminder Time</label>
              <input 
                type="time" 
                name="time"
                className="form-input text-h3" 
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card className="mb-xl p-md">
            <div className="form-group">
              <label className="text-label">Notes (Optional)</label>
              <textarea 
                name="notes"
                className="form-textarea text-body" 
                placeholder="e.g. Take after food"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Button type="submit" fullWidth size="lg" icon={Save} disabled={!formData.name}>
            Save Medicine
          </Button>
          
        </form>
      </div>
    </>
  );
}
