import { useState } from 'react';
import type { ObraCreate } from '../types/ObraArte';
import { obrasAPI } from '../services/api';

export default function ObraForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<ObraCreate>({
    autor: '',
    titulo: '',
    anio: new Date().getFullYear(),
    precio_salida: 0,
    tipo: 'pintura',
    disponibilidad: 'disponible',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'precio_salida' || name === 'anio' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await obrasAPI.create(form);
      onCreated();
      setForm({ autor: '', titulo: '', anio: new Date().getFullYear(), precio_salida: 0, tipo: 'pintura', disponibilidad: 'disponible' });
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la obra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold">Dar de alta obra</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="autor" value={form.autor} onChange={handleChange} placeholder="Autor" className="border rounded px-3 py-2" required />
        <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" className="border rounded px-3 py-2" required />
        <input name="anio" type="number" value={form.anio} onChange={handleChange} placeholder="Año" className="border rounded px-3 py-2" required />
        <select name="tipo" value={form.tipo} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="pintura">Pintura</option>
          <option value="escultura">Escultura</option>
          <option value="fotografia">Fotografía</option>
          <option value="digital">Digital</option>
          <option value="mixta">Mixta</option>
          <option value="otros">Otros</option>
        </select>
        <select name="disponibilidad" value={form.disponibilidad} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="disponible">Disponible</option>
          <option value="vendido">Vendido</option>
          <option value="reservado">Reservado</option>
          <option value="no disponible">No disponible</option>
          <option value="en_exposicion">En exposición</option>
          <option value="en_tienda">En tienda</option>
        </select>
        <input name="precio_salida" type="number" step="0.01" value={form.precio_salida} onChange={handleChange} placeholder="Precio salida" className="border rounded px-3 py-2" required />
        <input name="ubicacion" value={form.ubicacion ?? ''} onChange={handleChange} placeholder="Ubicación (opcional)" className="border rounded px-3 py-2" />
      </div>
      <textarea name="descripcion" value={form.descripcion ?? ''} onChange={handleChange} placeholder="Descripción" className="border rounded px-3 py-2 w-full" />
      <button disabled={saving} className="px-4 py-2 rounded-xl shadow bg-black text-white disabled:opacity-60">
        {saving ? 'Guardando…' : 'Crear obra'}
      </button>
    </form>
  );
}
