import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X, LocateFixed, Loader2, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// أيقونة الدبوس الافتراضية بـ Leaflet ما تظهر صح مع bundlers، نعرّفها يدويًا
const pinIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [24.7136, 46.6753]; // الرياض كنقطة انطلاق افتراضية

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

// بحث عكسي مجاني عبر Nominatim (OpenStreetMap) — بدون مفاتيح API
async function reverseGeocode(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`);
  if (!res.ok) throw new Error('geocode failed');
  return res.json();
}

export default function LocationPicker({ onConfirm, onClose }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressPreview, setAddressPreview] = useState(null);
  const markerRef = useRef(null);

  const pickPoint = async (lat, lng) => {
    setPosition([lat, lng]);
    setLoading(true);
    try {
      const data = await reverseGeocode(lat, lng);
      setAddressPreview(data);
    } catch {
      setAddressPreview(null);
    }
    setLoading(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => pickPoint(pos.coords.latitude, pos.coords.longitude),
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => { useMyLocation(); }, []);

  const confirm = () => {
    if (!position) return;
    const a = addressPreview?.address || {};
    onConfirm({
      lat: position[0],
      lng: position[1],
      city: a.city || a.town || a.village || a.state || '',
      address: addressPreview?.display_name || '',
    });
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold">حدّد موقعك على الخريطة</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
        </div>

        <div className="relative flex-1" style={{ minHeight: 320 }}>
          <MapContainer center={position || DEFAULT_CENTER} zoom={position ? 16 : 6} style={{ height: 320, width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler onPick={pickPoint} />
            {position && (
              <Marker
                position={position}
                icon={pinIcon}
                draggable
                eventHandlers={{ dragend: (e) => { const ll = e.target.getLatLng(); pickPoint(ll.lat, ll.lng); } }}
                ref={markerRef}
              />
            )}
          </MapContainer>

          <button onClick={useMyLocation} className="absolute bottom-3 left-3 z-[400] bg-card shadow-md rounded-full p-2.5 hover:bg-secondary" title="موقعي الحالي">
            <LocateFixed className="w-4 h-4 text-primary" />
          </button>
        </div>

        <div className="p-4 border-t border-border space-y-3">
          <p className="text-xs text-foreground/50">اضغط بأي مكان بالخريطة أو اسحب الدبوس لتحديد موقعك بدقة.</p>
          <div className="min-h-[40px] text-sm">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-foreground/50"><Loader2 className="w-4 h-4 animate-spin" /> جاري تحديد العنوان...</span>
            ) : addressPreview ? (
              <p className="text-foreground/80">{addressPreview.display_name}</p>
            ) : (
              <p className="text-foreground/40">لسه ما حددت موقع</p>
            )}
          </div>
          <button onClick={confirm} disabled={!position || loading} className="w-full py-3 btn-primary disabled:opacity-40 inline-flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> استخدام هذا الموقع
          </button>
        </div>
      </div>
    </div>
  );
}
