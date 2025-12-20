import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function LocationPicker({ onLocationSelect, initialLat = 13.0827, initialLng = 80.2707 }) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPos);
          onLocationSelect(newPos.lat, newPos.lng);
          reverseGeocode(newPos.lat, newPos.lng);
        },
        (error) => {
          console.log('Geolocation error:', error);
          reverseGeocode(initialLat, initialLng);
        }
      );
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPos);
          onLocationSelect(newPos.lat, newPos.lng);
          reverseGeocode(newPos.lat, newPos.lng);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Delivery Location</p>
            {loading ? (
              <p className="text-xs text-blue-700 mt-1">Loading address...</p>
            ) : address ? (
              <p className="text-xs text-blue-700 mt-1">{address}</p>
            ) : position.lat && position.lng ? (
              <p className="text-xs text-blue-700 mt-1">
                Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
              </p>
            ) : (
              <p className="text-xs text-blue-700 mt-1">No location set</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <MapPin size={16} />
        Use Current Location
      </button>

      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-500 text-sm">
        <div className="text-center">
          <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
          <p>Map Preview</p>
          {position.lat && position.lng ? (
            <p className="text-xs mt-1">Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}</p>
          ) : (
            <p className="text-xs mt-1">Click "Use Current Location" to set</p>
          )}
        </div>
      </div>
    </div>
  );
}
