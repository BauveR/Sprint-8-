import { useState } from 'react';
import type { ObraCreate } from '../types/ObraArte';
import { obrasAPI, geoAPI } from '../services/api';
import MiniMap from './MiniMap'; // <- NUEVO componente de mapa chiquito

export default function ObraForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<ObraCreate>({
    autor: '', titulo: '', anio: new Date().getFullYear(),
    precio_salida: 0, tipo: 'pintura', disponibilidad: 'disponible',
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMsg, setGeoMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: ['precio_salida','anio','lat','lng'].includes(name) ? Number(value) : value
    }) as any);
  };

  const doGeocode = async () => {
    try {
      setGeoLoading(true);
      setGeoMsg(null);
      setError(null);
      const address = (form.ubicacion ?? '').trim();
      if (!address) return setGeoMsg('Escribe una dirección en "Ubicación".');

      const { data } = await geoAPI.geocode(address);
      setForm(f => ({ ...f, ubicacion: data.display_name, lat: data.lat, lng: data.lng }));
      setGeoMsg(`Coordenadas: ${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}`);
    } catch (e) {
      console.error(e);
      setError('No se pudo geocodificar la dirección');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await obrasAPI.create(form);
      onCreated();
      setForm({ autor: '', titulo: '', anio: new Date().getFullYear(), precio_salida: 0, tipo: 'pintura', disponibilidad: 'disponible' });
      setGeoMsg(null);
    } catch {
      setError('No se pudo crear la obra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold">Dar de alta obra</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {geoMsg && <div className="text-emerald-700 text-sm">{geoMsg}</div>}

      <div className="grid sm:grid-cols-2 gap-3">
        {/* ...tus inputs existentes... */}
        <div className="sm:col-span-2 flex gap-2">
          <input
            name="ubicacion"
            value={form.ubicacion ?? ''}
            onChange={handleChange}
            placeholder="Ubicación (p.ej. 'Calle Gran Vía 1, Madrid')"
            className="border rounded px-3 py-2 w-full"
          />
          <button
            type="button"
            onClick={doGeocode}
            disabled={geoLoading}
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {geoLoading ? 'Buscando…' : 'Geolocalizar'}
          </button>
        </div>

        <input name="lat" type="number" step="any" value={form.lat ?? ''} onChange={handleChange} placeholder="Latitud" className="border rounded px-3 py-2" />
        <input name="lng" type="number" step="any" value={form.lng ?? ''} onChange={handleChange} placeholder="Longitud" className="border rounded px-3 py-2" />
      </div>

      {/* Previsualización del mapa si hay coordenadas */}
      {(form.lat != null && form.lng != null) && (
        <MiniMap lat={form.lat} lng={form.lng} />
      )}

      <textarea name="descripcion" value={form.descripcion ?? ''} onChange={handleChange} placeholder="Descripción" className="border rounded px-3 py-2 w-full" />
      <button disabled={saving} className="px-4 py-2 rounded-xl shadow bg-black text-white disabled:opacity-60">
        {saving ? 'Guardando…' : 'Crear obra'}
      </button>
    </form>
  );
}
