import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './popup.css'; // Add styles for the popup in this file

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  state: 'create' | 'edit';
  data?: { _id: string; name: string; email: string; number: string; product: string };
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, state, data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    product: 'A'
  });

  useEffect(() => {
    if (state === 'edit' && data) {
      setFormData({
        name: data.name,
        email: data.email,
        number: data.number,
        product: data.product
      });
    } else {
      setFormData({
        name: '',
        email: '',
        number: '',
        product: 'A'
      });
    }
  }, [state, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (state === 'create') {
        // Send request to add new lead
        await axios.post('http://128.199.147.135:3002//add-lead', formData);
        console.log('Lead created successfully');
      } else if (state === 'edit' && data) {
        // Send request to update existing lead
        await axios.put(`http://128.199.147.135:3002//edit-lead/${data._id}`, formData);
        console.log('Lead updated successfully');
      }

      // Close the popup after submission
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle the error appropriately here
    }
  };

  return (
    <div className={`popup-overlay ${isOpen ? 'show' : ''}`}>
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{state === 'create' ? 'Create New Item' : 'Edit Item'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Number:
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Product:
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
          <button type="submit">{state === 'create' ? 'Create' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
