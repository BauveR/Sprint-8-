// src/components/ObrasList.tsx
import { useState } from 'react';
import { useObras } from '../hooks/useObras';
import { obrasAPI } from '../services/api';
import ObraForm from './ObraForm';
import Relations from './Relations';

export function ObrasList() {
  const { obras, loading, error } = useObras();
  const [showForm, setShowForm] = useState(false);
  const [reloading, setReloading] = useState(false);

  const reload = async () => {
    // Truco sin tocar el hook original: forzamos “remontar”
    setReloading(true);
    setTimeout(() => setReloading(false), 0);
  };

  const remove = async (id: number) => {
    if (!confirm('¿Seguro que quieres borrar esta obra?')) return;
    await obrasAPI.delete(id);
    await reload();
  };

  if (loading || reloading) return <div className="p-6 text-gray-500">Cargando obras…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!obras.length) return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Obras</h2>
        <button onClick={() => setShowForm(s => !s)} className="px-3 py-2 rounded-xl bg-black text-white shadow">
          {showForm ? 'Cerrar' : 'Nueva obra'}
        </button>
      </div>
      {showForm && <ObraForm onCreated={reload} />}
      <div className="p-6 text-gray-400">No hay obras.</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Obras</h2>
        <button onClick={() => setShowForm(s => !s)} className="px-3 py-2 rounded-xl bg-black text-white shadow">
          {showForm ? 'Cerrar' : 'Nueva obra'}
        </button>
      </div>

      {showForm && <ObraForm onCreated={reload} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {obras.map((o) => (
          <article key={o.id_obra} className="rounded-2xl shadow p-4 bg-slate-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{o.titulo}</h3>
                <p className="text-sm text-gray-600">{o.autor} · {o.tipo}</p>
              </div>
              <button onClick={() => remove(o.id_obra)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">
                Eliminar
              </button>
            </div>

            <p className="mt-2 text-sm">Estado: <span className="font-medium">{o.disponibilidad}</span></p>
            <p className="text-sm">Precio salida: €{Number(o.precio_salida).toLocaleString()}</p>
            {o.ubicacion_actual && (
              <p className="text-xs text-gray-200 mt-1">Ubicación: {o.ubicacion_actual}</p>
            )}

            <div className="mt-3 bg-white/10 rounded p-2">
              <Relations obraId={o.id_obra} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
