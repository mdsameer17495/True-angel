import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useContactStore } from '../store';
import { Heart, Plus, X, Edit2, Phone, UserPlus } from 'lucide-react';
import './FamilyCare.css';

export default function FamilyCare() {
  const { contacts, fetchContacts, addContact, deleteContact, updateContact } = useContactStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', relationship: '', phone: '' });

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

  return (
    <>
      <Header 
        title="Family Care" 
        showBack 
        rightAction={
          <button className="text-primary flex-center" onClick={() => handleOpenModal()}>
            <Plus size={24} />
          </button>
        }
      />
      <div className="family-care-container animate-fadeInUp">
        
        {/* Page Description */}
        <div className="page-desc mb-lg">
          <p className="text-secondary text-body">
            Manage your family circle and emergency contacts. These individuals can be contacted quickly in case of emergency.
          </p>
        </div>

        {/* Contacts Section */}
        <section className="contacts-list flex-col gap-md">
          {contacts.map(contact => (
            <Card key={contact.id} variant="danger" className="contact-card flex-between gap-sm">
              <div className="flex gap-md flex-1">
                <div className="contact-avatar bg-danger-light text-danger-dark">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-body">{contact.name}</h4>
                  <p className="text-caption mt-xs flex align-center gap-xs">
                    <span className="relationship-tag">{contact.relationship}</span>
                    <span>•</span>
                    <span className="phone-number flex align-center gap-xs">
                      <Phone size={12} /> {contact.phone}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-xs">
                <Button size="sm" variant="ghost" className="text-primary" onClick={() => handleOpenModal(contact)} aria-label="Edit Contact">
                  <Edit2 size={16} />
                </Button>
                <Button size="sm" variant="ghost" className="text-danger" onClick={() => deleteContact(contact.id)} aria-label="Delete Contact">
                  <X size={16} />
                </Button>
              </div>
            </Card>
          ))}

          {contacts.length === 0 && (
            <div className="empty-contacts-state text-center py-2xl flex-col flex-center gap-md">
              <div className="empty-icon-bg bg-primary-light text-primary">
                <UserPlus size={36} />
              </div>
              <div>
                <h4 className="font-semibold text-body-lg">No emergency contacts</h4>
                <p className="text-secondary text-caption mt-xs">Add trusted caretakers or relatives</p>
              </div>
              <Button onClick={() => handleOpenModal()} size="sm">
                Add First Contact
              </Button>
            </div>
          )}
        </section>

      </div>

      {/* Add / Edit Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Contact" : "Add Contact"}>
        <div className="flex-col gap-md">
          <div className="form-group">
            <label className="text-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label className="text-label">Relationship</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.relationship}
              onChange={e => setFormData({...formData, relationship: e.target.value})}
              placeholder="e.g. Son, Physician"
              required
            />
          </div>
          <div className="form-group">
            <label className="text-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-input" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="e.g. +1 (555) 019-2834"
              required
            />
          </div>
          <Button fullWidth className="mt-md" onClick={handleSave}>
            Save Contact
          </Button>
        </div>
      </Modal>
    </>
  );
}
