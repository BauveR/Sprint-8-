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
};

export const tiendasAPI = {
  getAll: () => api.get<Tienda[]>('/tiendas'),
  getOnline: () => api.get<Tienda[]>('/tiendas/online'),
};
