import { Router } from 'express';
import {
  getObras,
  getObraById,
  createObra,
  getObrasConUbicacion,
  // NUEVOS:
  deleteObra,
  getRelaciones,
  vincularTienda, desvincularTienda,
  vincularExposicion, desvincularExposicion,
} from '../controllers/obrasController';

const router = Router();

router.get('/', getObras);
router.get('/ubicacion', getObrasConUbicacion);
router.get('/:id', getObraById);
router.post('/', createObra);

// NUEVO: borrar
router.delete('/:id', deleteObra);

// NUEVO: relaciones
router.get('/:id/relaciones', getRelaciones);
router.post('/:id/vincular/tienda', vincularTienda);
router.delete('/:id/vincular/tienda', desvincularTienda);
router.post('/:id/vincular/exposicion', vincularExposicion);
router.delete('/:id/vincular/exposicion', desvincularExposicion);

export default router;
