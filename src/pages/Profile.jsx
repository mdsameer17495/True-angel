import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ChevronRight, User as UserIcon, Shield, Bell, Heart, Plus, X, Edit2 } from 'lucide-react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useContactStore, useAuthStore } from '../store';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { contacts, addContact, deleteContact, updateContact } = useContactStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', relationship: '', phone: '' });

  const handleOpenModal = (contact = null) => {
    if (contact) {
      setEditingId(contact.id);
      setFormData({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    } else {
      setEditingId(null);
      setFormData({ name: '', relationship: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) return;
    
    if (editingId) {
      updateContact(editingId, formData);
    } else {
      addContact({ id: Date.now().toString(), ...formData });
    }
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Header title="Profile" />
      <div className="profile-container animate-fadeInUp"
      style={{
        paddingTop: '60px',     /* <-- Baki pages ki tarah perfect unified gap */
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '100px', /* Bottom microphone/nav bar ke liye safety padding */
        boxSizing: 'border-box'
      }}
      >
        <div className="profile-header">
          <div className="profile-avatar">
            <UserIcon size={40} className="text-primary-dark" />
          </div>
          <h2 className="text-h2 mt-2">{user?.name || 'Nadiya Ali'}</h2>
          <p className="text-secondary">{user?.email || 'nadiya@example.com'}</p>
        </div>

        <div className="profile-stats grid grid-cols-2 gap-sm mb-xl">
          <Card className="text-center">
            <h3 className="text-h2 text-primary">98%</h3>
            <p className="text-caption">Adherence</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-h2 text-success">14</h3>
            <p className="text-caption">Day Streak</p>
          </Card>
        </div>

        <div className="profile-menu">
          <h3 className="text-label mb-sm">Preferences</h3>
          
          <Card className="menu-card" onClick={() => navigate('/settings')}>
            <div className="flex-between">
              <div className="flex gap-sm">
                <div className="menu-icon bg-info-light text-info"><Settings size={20} /></div>
                <span className="font-medium">App Settings</span>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </Card>

          <Card className="menu-card mt-sm" onClick={() => navigate('/notifications')}>
            <div className="flex-between">
              <div className="flex gap-sm">
                <div className="menu-icon bg-warning-light text-warning-dark"><Bell size={20} /></div>
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </Card>

          <Card className="menu-card mt-sm" onClick={() => navigate('/family-care')}>
            <div className="flex-between">
              <div className="flex gap-sm">
                <div className="menu-icon bg-success-light text-success-dark"><Heart size={20} /></div>
                <span className="font-medium">Family Care</span>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </Card>

          <Card className="menu-card mt-sm" onClick={() => navigate('/privacy')}>
            <div className="flex-between">
              <div className="flex gap-sm">
                <div className="menu-icon bg-primary-light text-primary-dark"><Shield size={20} /></div>
                <span className="font-medium">Privacy</span>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          </Card>
        </div>

        <div className="emergency-contacts mt-md">
          <div className="flex-between mb-sm">
            <h3 className="text-label">Emergency Contacts</h3>
            <button className="text-primary flex-center" onClick={() => handleOpenModal()}>
              <Plus size={20} /> Add
            </button>
          </div>
          
          <div className="flex-col gap-sm">
            {contacts.map(contact => (
              <Card key={contact.id} variant="danger" className="p-md flex-between gap-sm">
                <div className="flex gap-md flex-1">
                  <div className="menu-icon bg-danger-light text-danger-dark flex-shrink-0">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 className="text-body font-semibold">{contact.name}</h4>
                    <p className="text-caption">{contact.relationship} • {contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-xs flex-shrink-0">
                  <Button size="sm" variant="ghost" className="text-primary" onClick={() => handleOpenModal(contact)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger" onClick={() => deleteContact(contact.id)}>
                    <X size={16} />
                  </Button>
                </div>
              </Card>
            ))}
            {contacts.length === 0 && (
              <p className="text-muted text-center py-md">No contacts added.</p>
            )}
          </div>
        </div>

        <button className="logout-btn mt-xl flex-center gap-sm" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Contact" : "Add Contact"}>
        <div className="flex-col gap-md">
          <div className="form-group">
            <label className="text-label">Name</label>
            <input 
              type="text" 
              className="form-input text-h3" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Contact Name"
            />
          </div>
          <div className="form-group">
            <label className="text-label">Relationship / Role</label>
            <input 
              type="text" 
              className="form-input text-h3" 
              value={formData.relationship}
              onChange={e => setFormData({...formData, relationship: e.target.value})}
              placeholder="e.g. Primary Care, Son"
            />
          </div>
          <div className="form-group">
            <label className="text-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-input text-h3" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="Phone Number"
            />
          </div>
          <Button fullWidth className="mt-md" onClick={handleSave}>Save Contact</Button>
        </div>
      </Modal>
    </>
  );
}
