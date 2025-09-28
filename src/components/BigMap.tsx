import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from './leafletIconFix';

export function BigMap({ lat, lng }: { lat: number; lng: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ReturnType<typeof L.map> | null>(null);
  const markerRef = useRef<ReturnType<typeof L.marker> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    fixLeafletIcons();

    const map = L.map(ref.current).setView([lat, lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = L.marker([lat, lng]).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([lat, lng], mapRef.current.getZoom());

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
  }, [lat, lng]);

  return <div ref={ref} style={{ height: 300, width: '100%' }} className="rounded-xl border" />;
}
