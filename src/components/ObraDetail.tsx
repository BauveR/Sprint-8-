// src/components/ObraDetail.tsx
import { useEffect, useRef, useState } from 'react';
import { obrasAPI } from '../services/api';
import type { ObraArte } from '../types/ObraArte';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcons } from './leafletIconFix';

export default function ObraDetail({ id }: { id: number }) {
  const [data, setData] = useState<{ obra: ObraArte; tiendas: any[]; exposiciones: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ReturnType<typeof L.map> | null>(null);
  const markerRef = useRef<ReturnType<typeof L.marker> | null>(null);

  // 1) Cargar datos
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const r = await obrasAPI.getCompleta(id);
        setData(r.data);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el detalle');
      }
    })();
  }, [id]);

  // 2) Inicializar mapa UNA vez cuando haya coords
  useEffect(() => {
    const obra = data?.obra;
    if (!obra || obra.lat == null || obra.lng == null) return;
    if (!mapDivRef.current) return;

    // si ya existe, no lo recrees
    if (mapRef.current) return;

    fixLeafletIcons();

    const map = L.map(mapDivRef.current).setView([obra.lat, obra.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([obra.lat, obra.lng]).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    // cleanup al desmontar el componente
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [data?.obra?.lat, data?.obra?.lng]);

  // 3) Si cambian coords, mueve vista/marker sin recrear
  useEffect(() => {
    const obra = data?.obra;
    if (!obra || obra.lat == null || obra.lng == null) return;
    if (!mapRef.current) return;

    mapRef.current.setView([obra.lat, obra.lng], mapRef.current.getZoom());
    if (markerRef.current) {
      markerRef.current.setLatLng([obra.lat, obra.lng]);
    } else {
      markerRef.current = L.marker([obra.lat, obra.lng]).addTo(mapRef.current);
    }
  }, [data?.obra?.lat, data?.obra?.lng]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return <div className="p-4 text-gray-500">Cargando…</div>;

  const { obra, tiendas, exposiciones } = data;

  return (
    <div className="space-y-4">
      <header className="p-4 rounded-xl bg-white shadow">
        <h2 className="text-xl font-semibold">{obra.titulo}</h2>
        <p className="text-sm text-gray-600">{obra.autor} · {obra.tipo} · {obra.anio}</p>
        <p className="text-sm">Estado: {obra.disponibilidad}</p>
        <p className="text-sm">Precio salida: €{Number(obra.precio_salida).toLocaleString()}</p>
        {obra.ubicacion_actual && <p className="text-xs text-gray-500">Ubicación: {obra.ubicacion_actual}</p>}
      </header>

      {(obra.lat != null && obra.lng != null) && (
        <div className="rounded-xl overflow-hidden shadow">
          <div ref={mapDivRef} style={{ height: 300, width: '100%' }} />
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-medium">Tiendas vinculadas</h3>
          {tiendas.length ? (
            <ul className="list-disc pl-5 text-sm">
              {tiendas.map(t => (
                <li key={t.id_relacion}>
                  {t.nombre} ({t.tipo_tienda}){t.direccion ? ` · ${t.direccion}` : ''} · stock {t.stock} · {t.precio_venta ? `€${Number(t.precio_venta).toLocaleString()}` : 'sin precio'}
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">Sin vínculos</p>}
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-medium">Exposiciones vinculadas</h3>
          {exposiciones.length ? (
            <ul className="list-disc pl-5 text-sm">
              {exposiciones.map(e => (
                <li key={e.id_relacion}>
                  {e.titulo} ({e.lugar}) · {e.fecha_inicio} → {e.fecha_fin}
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">Sin vínculos</p>}
        </div>
      </section>
    </div>
  );
}
