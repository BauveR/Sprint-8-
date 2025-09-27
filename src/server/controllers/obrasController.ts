import type { Request, Response } from 'express';
import { pool } from '../config/database';
// No usas ObraArte en este archivo, solo el DTO de entrada:
import type { ObraArteCreate } from '../models/ObraArte';

export const getObras = async (_req: Request, res: Response) => {  // _req para evitar TS6133
  try {
    const result = await pool.query(`
      SELECT 
        id_obra, autor, titulo, año AS anio, medidas, tecnica, disponibilidad,
        precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at
      FROM obras_arte 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error obteniendo obras' });
  }
};

export const getObraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        id_obra, autor, titulo, año AS anio, medidas, tecnica, disponibilidad,
        precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at
      FROM obras_arte
      WHERE id_obra = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Obra no encontrada' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error obteniendo obra' });
  }
};

export const createObra = async (req: Request, res: Response) => {
  try {
    const obraData: ObraArteCreate = req.body;

    const result = await pool.query(`
      INSERT INTO obras_arte 
      (autor, titulo, año, medidas, tecnica, disponibilidad, precio_salida, ubicacion, tipo, links, descripcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING 
        id_obra, autor, titulo, año AS anio, medidas, tecnica, disponibilidad,
        precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at
    `, [
      obraData.autor, obraData.titulo, obraData.año, obraData.medidas,
      obraData.tecnica, obraData.disponibilidad ?? 'disponible',
      obraData.precio_salida, obraData.ubicacion, obraData.tipo ?? 'pintura',
      JSON.stringify(obraData.links ?? {}), obraData.descripcion
    ]);

    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error creando obra' });
  }
};

export const getObrasConUbicacion = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id_obra, o.autor, o.titulo, o.año AS anio, o.medidas, o.tecnica, o.disponibilidad,
        o.precio_salida, o.ubicacion, o.tipo, o.links, o.descripcion, o.created_at, o.updated_at,
        COALESCE(
          (SELECT t.nombre FROM obras_tiendas ot 
           JOIN tiendas t ON ot.id_tienda = t.id_tienda 
           WHERE ot.id_obra = o.id_obra AND ot.stock > 0 LIMIT 1),
          (SELECT e.titulo FROM obras_exposiciones oe 
           JOIN exposiciones e ON oe.id_exposicion = e.id_exposicion
           WHERE oe.id_obra = o.id_obra 
           AND CURRENT_DATE BETWEEN e.fecha_inicio AND e.fecha_fin LIMIT 1),
          o.ubicacion
        ) AS ubicacion_actual
      FROM obras_arte o
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error obteniendo obras con ubicación' });
  }
};
