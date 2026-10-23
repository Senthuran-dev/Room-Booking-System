import React from 'react';
import {
  Wifi,
  Wind,
  Tv,
  Coffee,
  BedDouble,
  Utensils,
  Waves,
  Mountain,
  Building2,
  Sun,
  DoorOpen,
  TreePine,
  Palmtree,
  Sparkles,
  ShowerHead,
  Flame,
  Bath,
  Laptop,
  Dumbbell,
  UtensilsCrossed,
  ShieldCheck,
  Bell,
  Wine,
  Check
} from 'lucide-react';

export const AMENITY_ICONS_MAP = {
  'Free WiFi': Wifi,
  'Air Conditioning': Wind,
  'TV': Tv,
  'Coffee Maker': Coffee,
  'King Bed': BedDouble,
  'Breakfast Included': Utensils,
  'Lake View': Waves,
  'Ocean View': Waves,
  'Mountain View': Mountain,
  'City View': Building2,
  'Private Balcony': Sun,
  'Private Veranda': DoorOpen,
  'Courtyard Access': TreePine,
  'Beach Access': Palmtree,
  'Private Pool': Sparkles,
  'Rainfall Shower': ShowerHead,
  'Hot Water': Flame,
  'Jacuzzi': Bath,
  'Desk': Laptop,
  'Gym Access': Dumbbell,
  'Kitchenette': UtensilsCrossed,
  'Room Service': Bell,
  'Mini Bar': Wine
};

export const COMMON_AMENITIES_LIST = [
  'Free WiFi',
  'Air Conditioning',
  'TV',
  'Coffee Maker',
  'King Bed',
  'Breakfast Included',
  'Lake View',
  'Ocean View',
  'Mountain View',
  'City View',
  'Private Balcony',
  'Private Veranda',
  'Courtyard Access',
  'Beach Access',
  'Private Pool',
  'Rainfall Shower',
  'Hot Water',
  'Jacuzzi',
  'Desk',
  'Gym Access',
  'Kitchenette',
  'Room Service',
  'Mini Bar'
];

export const getAmenityIcon = (name) => {
  if (!name) return Sparkles;
  const key = Object.keys(AMENITY_ICONS_MAP).find(
    k => k.toLowerCase() === name.trim().toLowerCase()
  );
  return key ? AMENITY_ICONS_MAP[key] : Sparkles;
};

const AmenityIcon = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = getAmenityIcon(name);
  return <IconComponent className={className} />;
};

export default AmenityIcon;
