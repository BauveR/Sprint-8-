// src/components/ObrasList.tsx
import { useObras } from '../hooks/useObras';

export function ObrasList() {
  const { obras, loading, error } = useObras();

  if (loading) return <div className="p-6 text-gray-500">Cargando obras…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!obras.length) return <div className="p-6 text-gray-400">No hay obras.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {obras.map((o) => (
        <article key={o.id_obra} className="rounded-2xl shadow p-4 bg-white">
          <h3 className="text-lg font-semibold">{o.titulo}</h3>
          <p className="text-sm text-gray-600">{o.autor} · {o.tipo}</p>
          <p className="mt-2 text-sm">Estado: <span className="font-medium">{o.disponibilidad}</span></p>
          <p className="text-sm">Precio salida: €{o.precio_salida.toLocaleString()}</p>
          {o.ubicacion_actual && (
            <p className="text-xs text-gray-500 mt-1">Ubicación: {o.ubicacion_actual}</p>
          )}
        </article>
      ))}
    </div>
  );
}
