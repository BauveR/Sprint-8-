// TIPOS SOLO PARA EL FRONT
export type Disponibilidad =
  | 'disponible'
  | 'vendido'
  | 'reservado'
  | 'no disponible'
  | 'en_exposicion'
  | 'en_tienda';

export type TipoObra =
  | 'pintura'
  | 'escultura'
  | 'fotografia'
  | 'digital'
  | 'mixta'
  | 'otros';

export type TipoTienda = 'online' | 'fisica';

export interface ObraArte {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number;             // <- usa anio en el front (sin tilde)
  medidas: string;
  tecnica: string;
  disponibilidad: Disponibilidad;
  precio_salida: number;
  ubicacion: string;
  tipo: TipoObra;
  links: Record<string, string>;
  descripcion: string;
  created_at: string;
  updated_at: string;
  ubicacion_actual?: string;
}

export interface Tienda {
  id_tienda: number;
  nombre: string;
  tipo_tienda: TipoTienda;
  direccion?: string;
  telefono?: string;
  email?: string;
  url_tienda?: string;
  activo: boolean;
}

export interface ObraCreate {
  autor: string;
  titulo: string;
  anio: number;             // <- anio aquí también
  medidas?: string;
  tecnica?: string;
  disponibilidad?: Disponibilidad;
  precio_salida: number;
  ubicacion?: string;
  tipo?: TipoObra;
  links?: Record<string, string>;
  descripcion?: string;
}
