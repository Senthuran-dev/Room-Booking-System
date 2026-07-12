import { useState, useEffect } from 'react';
import { getRooms, deleteRoom } from '../../services/room.service';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch (error) {
      alert('Failed to delete room');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading rooms...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1d]">Manage Rooms</h1>
        <button className="btn-primary py-2" onClick={() => alert('Add Room UI not implemented yet')}>Add New Room</button>
      </div>
      
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Night</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map(room => (
              <tr key={room._id}>
                <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{room.name}</div></td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{room.type}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${room.pricePerNight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => alert('Edit Room UI not implemented yet')} className="text-primary hover:text-primary-dark mr-3">Edit</button>
                  <button onClick={() => handleDelete(room._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No rooms found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRooms;
