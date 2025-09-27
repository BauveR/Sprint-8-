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
    const body: any = req.body as ObraArteCreate;
    // Acepta anio o año desde el front
    const anio = body.anio ?? body.año;

    const result = await pool.query(`
      INSERT INTO obras_arte 
      (autor, titulo, año, medidas, tecnica, disponibilidad, precio_salida, ubicacion, tipo, links, descripcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING 
        id_obra, autor, titulo, año AS anio, medidas, tecnica, disponibilidad,
        precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at
    `, [
      body.autor, body.titulo, anio, body.medidas,
      body.tecnica, body.disponibilidad ?? 'disponible',
      body.precio_salida, body.ubicacion, body.tipo ?? 'pintura',
      JSON.stringify(body.links ?? {}), body.descripcion
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

/* =========================
   NUEVO: borrar y relaciones
   ========================= */

export const deleteObra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const r = await pool.query(
      'DELETE FROM obras_arte WHERE id_obra = $1 RETURNING id_obra',
      [id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'Obra no encontrada' });
    res.json({ ok: true, id: r.rows[0].id_obra });
  } catch {
    res.status(500).json({ error: 'Error borrando obra' });
  }
};

export const getRelaciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_obra
    const [tiendas, expos] = await Promise.all([
      pool.query(`
        SELECT ot.id_relacion, t.id_tienda, t.nombre, ot.stock, ot.precio_venta, ot.codigo_inventario, ot.fecha_ingreso
        FROM obras_tiendas ot
        JOIN tiendas t ON t.id_tienda = ot.id_tienda
        WHERE ot.id_obra = $1
        ORDER BY t.nombre
      `, [id]),
      pool.query(`
        SELECT oe.id_relacion, e.id_exposicion, e.titulo, e.lugar, e.fecha_inicio, e.fecha_fin, oe.fecha_incorporacion, oe.ubicacion_en_exposicion
        FROM obras_exposiciones oe
        JOIN exposiciones e ON e.id_exposicion = oe.id_exposicion
        WHERE oe.id_obra = $1
        ORDER BY e.fecha_inicio DESC
      `, [id]),
    ]);
    res.json({ tiendas: tiendas.rows, exposiciones: expos.rows });
  } catch {
    res.status(500).json({ error: 'Error obteniendo relaciones' });
  }
};

export const vincularTienda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_obra
    const { id_tienda, stock = 1, precio_venta, codigo_inventario } = req.body;
    const r = await pool.query(`
      INSERT INTO obras_tiendas (id_obra, id_tienda, stock, precio_venta, codigo_inventario)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id_obra, id_tienda) DO UPDATE
        SET stock = EXCLUDED.stock,
            precio_venta = COALESCE(EXCLUDED.precio_venta, obras_tiendas.precio_venta),
            codigo_inventario = COALESCE(EXCLUDED.codigo_inventario, obras_tiendas.codigo_inventario),
            updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `, [id, id_tienda, stock, precio_venta, codigo_inventario]);
    res.status(201).json(r.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error vinculando tienda' });
  }
};

export const desvincularTienda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_obra
    const { id_tienda } = req.body;
    const r = await pool.query(
      'DELETE FROM obras_tiendas WHERE id_obra = $1 AND id_tienda = $2',
      [id, id_tienda]
    );
    res.json({ ok: true, deleted: r.rowCount });
  } catch {
    res.status(500).json({ error: 'Error desvinculando tienda' });
  }
};

export const vincularExposicion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_obra
    const { id_exposicion, ubicacion_en_exposicion } = req.body;
    const r = await pool.query(`
      INSERT INTO obras_exposiciones (id_obra, id_exposicion, ubicacion_en_exposicion)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_obra, id_exposicion) DO NOTHING
      RETURNING *;
    `, [id, id_exposicion, ubicacion_en_exposicion]);
    res.status(201).json(r.rows[0] ?? { ok: true, conflict: true });
  } catch {
    res.status(500).json({ error: 'Error vinculando exposición' });
  }
};

export const desvincularExposicion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id_obra
    const { id_exposicion } = req.body;
    const r = await pool.query(
      'DELETE FROM obras_exposiciones WHERE id_obra = $1 AND id_exposicion = $2',
      [id, id_exposicion]
    );
    res.json({ ok: true, deleted: r.rowCount });
  } catch {
    res.status(500).json({ error: 'Error desvinculando exposición' });
  }
};
