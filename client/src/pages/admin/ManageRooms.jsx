import React, { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../services/room.service';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Users, Check, AlertCircle } from 'lucide-react';

const COMMON_AMENITIES = [
  'Free WiFi',
  'Air Conditioning',
  'Ocean View',
  'Balcony',
  'Room Service',
  'Mini Bar',
  'Flat Screen TV',
  'Private Pool',
  'Desk',
  'King Bed',
  'Jacuzzi',
  'Coffee Maker'
];

const INITIAL_FORM = {
  name: '',
  type: 'Deluxe',
  pricePerNight: '',
  capacity: 2,
  description: '',
  amenities: ['Free WiFi', 'Air Conditioning'],
  imageUrl: ''
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData(INITIAL_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      type: room.type || 'Deluxe',
      pricePerNight: room.pricePerNight || '',
      capacity: room.capacity || 2,
      description: room.description || '',
      amenities: room.amenities || [],
      imageUrl: room.images?.[0]?.url || ''
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingRoom(null);
    setError('');
  };

  const handleToggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity) 
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (!customAmenity.trim()) return;
    if (!formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
    }
    setCustomAmenity('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) return setError('Please enter a room name');
    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
      return setError('Please enter a valid price per night');
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      return setError('Please enter a valid guest capacity');
    }
    if (!formData.description.trim()) {
      return setError('Please provide a room description');
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        description: formData.description.trim(),
        amenities: formData.amenities,
        images: formData.imageUrl.trim() 
          ? [{ url: formData.imageUrl.trim(), public_id: `custom_${Date.now()}` }]
          : (editingRoom?.images || [])
      };

      if (editingRoom) {
        await updateRoom(editingRoom._id, payload);
      } else {
        await createRoom(payload);
      }

      await fetchRooms();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, roomName) => {
    if (!window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteRoom(id);
      setRooms(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b1b1d] tracking-tight">Manage Rooms</h1>
          <p className="text-sm text-gray-500 mt-1">Add, update, or remove hotel suites and room listings.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Room</span>
        </button>
      </div>
      
      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-level-1 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No rooms listed yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              Get started by creating your first room with pricing, capacity, and amenities.
            </p>
            <button onClick={openCreateModal} className="btn-primary py-2 px-4">
              Create First Room
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price / Night</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amenities</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rooms.map(room => (
                  <tr key={room._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {room.images?.[0]?.url ? (
                          <img 
                            src={room.images[0].url} 
                            alt={room.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{room.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{room.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        room.type === 'Suite' 
                          ? 'bg-amber-100 text-amber-800' 
                          : room.type === 'Deluxe' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${room.pricePerNight}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {room.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-100 text-gray-600 px-2 py-0.5 rounded">
                            {amenity}
                          </span>
                        ))}
                        {(room.amenities?.length || 0) > 3 && (
                          <span className="text-[11px] bg-slate-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(room)} 
                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors mr-1"
                        title="Edit Room"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(room._id, room.name)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-level-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRoom ? 'Edit Room Details' : 'Create New Room'}
              </h2>
              <button 
                onClick={closeModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Room Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Room Name *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Presidential Ocean Suite"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  required
                />
              </div>

              {/* Type, Price, Capacity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Room Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Price / Night ($) *
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.pricePerNight}
                    onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })}
                    placeholder="250"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Guest Capacity *
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the room, view, ambiance, and special features..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  required
                />
              </div>

              {/* Image URL with Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Room Image URL
                </label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={formData.imageUrl} 
                      alt="Room Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Amenities Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Included Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_AMENITIES.map(amenity => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {amenity}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Amenity */}
                <div className="mt-3 flex gap-2">
                  <input 
                    type="text" 
                    value={customAmenity}
                    onChange={e => setCustomAmenity(e.target.value)}
                    placeholder="Add custom amenity (e.g. Butler Service)"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddCustomAmenity} 
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
                >
                  {submitting ? 'Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
