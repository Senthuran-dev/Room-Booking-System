import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

const RoomCard = ({ room }) => {
  return (
    <div className="card flex flex-col h-full">
      <div className="relative pb-[60%] overflow-hidden rounded-md mb-4 bg-gray-100">
        <img 
          src={room.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={room.name} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
          {room.type}
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-[#1b1b1d] line-clamp-1">{room.name}</h3>
        <div className="flex items-center text-sm font-medium text-[#1b1b1d]">
          <Star className="h-4 w-4 text-accent fill-accent mr-1" />
          {room.averageRating ? room.averageRating.toFixed(1) : 'New'}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-[#43474e] mb-4 space-x-4">
        <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> {room.capacity} Guests</span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span className="text-xl font-bold text-primary">${room.pricePerNight}</span>
          <span className="text-xs text-[#43474e] ml-1">/ night</span>
        </div>
        <Link to={`/rooms/${room._id}`} className="btn-primary py-2 px-4 text-sm">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
