import React, { useState, useEffect } from 'react';
import { 
  getRooms, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  uploadRoomImages, 
  deleteRoomImage 
} from '../../services/room.service';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Users, 
  Check, 
  AlertCircle, 
  UploadCloud, 
  Loader2 
} from 'lucide-react';

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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState('');
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
    setSelectedFiles([]);
    setFilePreviews([]);
    setError('');
    setSubmitStatusText('');
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
      imageUrl: ''
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setError('');
    setSubmitStatusText('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingRoom(null);
    setSelectedFiles([]);
    setFilePreviews([]);
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + selectedFiles.length > 5) {
      setError('You can upload up to 5 images at a time.');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index) => {
    URL.revokeObjectURL(filePreviews[index]);
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
    setFilePreviews(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleDeleteExistingImage = async (imgId) => {
    if (!editingRoom) return;
    if (!window.confirm('Delete this image from Cloudinary and this room?')) return;

    try {
      await deleteRoomImage(editingRoom._id, imgId);
      const updatedImages = editingRoom.images.filter(img => img._id !== imgId);
      setEditingRoom(prev => ({ ...prev, images: updatedImages }));
      setRooms(prev => prev.map(r => r._id === editingRoom._id ? { ...r, images: updatedImages } : r));
    } catch (err) {
      console.error(err);
      alert('Failed to delete image from Cloudinary');
    }
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
    setSubmitStatusText('Saving room details...');

    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        description: formData.description.trim(),
        amenities: formData.amenities
      };

      // If an external image URL was provided
      if (formData.imageUrl.trim()) {
        payload.images = [
          ...(editingRoom?.images || []),
          { url: formData.imageUrl.trim(), public_id: `custom_${Date.now()}` }
        ];
      }

      let savedRoomId = editingRoom?._id;

      if (editingRoom) {
        await updateRoom(editingRoom._id, payload);
      } else {
        const createRes = await createRoom(payload);
        savedRoomId = createRes.data?._id;
      }

      // If user selected image files, upload directly to Cloudinary
      if (selectedFiles.length > 0 && savedRoomId) {
        setSubmitStatusText(`Uploading ${selectedFiles.length} image(s) to Cloudinary...`);
        const uploadData = new FormData();
        selectedFiles.forEach(file => {
          uploadData.append('images', file);
        });
        await uploadRoomImages(savedRoomId, uploadData);
      }

      await fetchRooms();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save room. Please try again.');
    } finally {
      setSubmitting(false);
      setSubmitStatusText('');
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
          <p className="text-sm text-gray-500 mt-1">Create, update, upload Cloudinary photos, and manage hotel room listings.</p>
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
              Get started by creating your first room with pricing, capacity, and Cloudinary photos.
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
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Photos</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.images?.length || 0} photo{(room.images?.length || 0) === 1 ? '' : 's'}
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
                  placeholder="e.g. Royal Ocean Suite"
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
                  placeholder="Describe the room, ambiance, view, and unique hospitality features..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  required
                />
              </div>

              {/* Cloudinary Image Upload Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Upload Room Photos to Cloudinary (up to 5)
                </label>
                
                {/* Drag and Drop / Click File Selector */}
                <label className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <p className="text-xs text-gray-600 font-medium">
                      <span className="font-semibold text-primary">Click to choose photos</span> or drag & drop
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    disabled={submitting}
                  />
                </label>

                {/* New File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">Selected for upload:</div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {filePreviews.map((previewUrl, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-16">
                          <img src={previewUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Images (when Editing) */}
                {editingRoom?.images?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-600 mb-2">Existing Cloudinary Photos:</div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {editingRoom.images.map(img => (
                        <div key={img._id} className="relative group rounded-lg overflow-hidden border border-gray-200 h-16">
                          <img src={img.url} alt="Room" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img._id)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors opacity-90 group-hover:opacity-100"
                            title="Delete from Cloudinary"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional External Image URL input */}
                <div className="mt-3">
                  <span className="text-[11px] text-gray-500">Or paste an image URL:</span>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
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
                            ? 'bg-primary text-white shadow-sm' 
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
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-primary font-medium">
                  {submitting && (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      {submitStatusText}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
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
                    {submitting ? 'Uploading & Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
