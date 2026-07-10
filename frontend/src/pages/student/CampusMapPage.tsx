import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CampusMapPage() {
  const [venues, setVenues] = useState([]);
  const collegeId = '4a92a461-1670-4e29-82cb-221cd28f9f22'; // Hardcoded for demo
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default SF

  useEffect(() => {
    axios.get(`http://localhost:5000/api/campus-map/${collegeId}`).then(res => {
      const v = res.data.venues.filter((venue: any) => venue.latitude && venue.longitude);
      setVenues(v);
      if (v.length > 0) {
        setCenter([v[0].latitude, v[0].longitude]);
      }
    });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Campus Map & Navigation</h1>

      <div className="flex-1 bg-white border rounded shadow overflow-hidden relative">
        <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {venues.map((venue: any) => (
            <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
              <Popup>
                <div className="font-bold">{venue.name}</div>
                <div className="text-sm text-gray-600">Capacity: {venue.capacity}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
