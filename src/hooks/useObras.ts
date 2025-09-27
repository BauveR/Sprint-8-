import { useState, useEffect } from 'react';
import type { ObraArte } from '../types/ObraArte';   
import { obrasAPI } from '../services/api';

export const useObras = () => {
  const [obras, setObras] = useState<ObraArte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await obrasAPI.getAll();
        setObras(Array.isArray(res.data) ? res.data : []); // defensivo leve
      } catch (e) {
        console.error(e);
        setError('Error cargando obras');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { obras, loading, error };
};

export const useObrasConUbicacion = () => {
  const [obras, setObras] = useState<ObraArte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await obrasAPI.getWithLocation();
        setObras(Array.isArray(res.data) ? res.data : []); // defensivo leve
      } catch (e) {
        console.error(e);
        setError('Error cargando obras');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { obras, loading, error };
};
