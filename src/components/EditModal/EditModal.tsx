import React, { useState, useEffect } from 'react';
import { Country, EditTaxData } from '../../types/types';
import './EditModal.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditTaxData) => Promise<boolean>;
  initialData: EditTaxData;
  countries: Country[];
  loading?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  countries,
  loading = false,
}) => {
  const [formData, setFormData] = useState<EditTaxData>(initialData);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
    setValidationError(null); 
  }, [initialData, isOpen]);

  const handleSave = async () => {
    setValidationError(null); 
    if (!formData.name.trim()) {
      setValidationError('Name is required.');
      return;
    }

    setSaving(true);
    const success = await onSave(formData);
    setSaving(false);
    
    if (success) {
      onClose();
    } else {
     
      setValidationError('Failed to save changes. Please try again.');
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Customer</h2>
        
        
        {validationError && (
          <div className="error-message">{validationError}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={saving}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            disabled={saving}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            onClick={handleClose}
            disabled={saving}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            disabled={saving}
            className="save-btn"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};