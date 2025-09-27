import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tiendas WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error obteniendo tiendas' });
  }
});

router.get('/online', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, COUNT(ot.id_obra) as total_obras
      FROM tiendas t
      LEFT JOIN obras_tiendas ot ON t.id_tienda = ot.id_tienda AND ot.stock > 0
      WHERE t.tipo_tienda = 'online' AND t.activo = true
      GROUP BY t.id_tienda
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error obteniendo tiendas online' });
  }
});

export default router;
