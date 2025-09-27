export interface ObraArte {
    id_obra: number;
    autor: string;
    titulo: string;
    año: number;
    medidas: string;
    tecnica: string;
    disponibilidad: 'disponible' | 'vendido' | 'reservado' | 'no disponible' | 'en_exposicion' | 'en_tienda';
    precio_salida: number;
    ubicacion: string;
    tipo: 'pintura' | 'escultura' | 'fotografia' | 'digital' | 'mixta' | 'otros';
    links: any; // JSONB
    descripcion: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ObraArteCreate {
    autor: string;
    titulo: string;
    año: number;
    medidas?: string;
    tecnica?: string;
    disponibilidad?: ObraArte['disponibilidad'];
    precio_salida: number;
    ubicacion?: string;
    tipo?: ObraArte['tipo'];
    links?: any;
    descripcion?: string;
  }