import axios from 'axios';
import type { ObraArte, ObraCreate, Tienda } from '../types/ObraArte';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const obrasAPI = {
  getAll: () => api.get<ObraArte[]>('/obras'),
  getById: (id: number) => api.get<ObraArte>(`/obras/${id}`),
  getWithLocation: () => api.get<ObraArte[]>('/obras/ubicacion'),
  create: (obra: ObraCreate) => api.post<ObraArte>('/obras', obra),

  // NUEVOS
  delete: (id: number) => api.delete<{ ok: boolean; id: number }>(`/obras/${id}`),
  getRelations: (id: number) => api.get(`/obras/${id}/relaciones`),
  linkStore: (id: number, payload: { id_tienda: number; stock?: number; precio_venta?: number; codigo_inventario?: string }) =>
    api.post(`/obras/${id}/vincular/tienda`, payload),
  unlinkStore: (id: number, payload: { id_tienda: number }) =>
    api.delete(`/obras/${id}/vincular/tienda`, { data: payload }),
  linkExpo: (id: number, payload: { id_exposicion: number; ubicacion_en_exposicion?: string }) =>
    api.post(`/obras/${id}/vincular/exposicion`, payload),
  unlinkExpo: (id: number, payload: { id_exposicion: number }) =>
    api.delete(`/obras/${id}/vincular/exposicion`, { data: payload }),
};

export const tiendasAPI = {
  getAll: () => api.get<Tienda[]>('/tiendas'),
  getOnline: () => api.get<Tienda[]>('/tiendas/online'),
};
