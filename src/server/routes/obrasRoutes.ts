import { Router } from 'express';
import {
  getObras,
  getObraById,
  createObra,
  getObrasConUbicacion,
  deleteObra,
  getRelaciones,
  vincularTienda, desvincularTienda,
  vincularExposicion, desvincularExposicion,
  getObraCompleta,
} from '../controllers/obrasController';

const router = Router();

router.get('/', getObras);
router.get('/ubicacion', getObrasConUbicacion);
router.get('/:id', getObraById);
router.post('/', createObra);
router.delete('/:id', deleteObra);

router.get('/:id/relaciones', getRelaciones);
router.post('/:id/vincular/tienda', vincularTienda);
router.delete('/:id/vincular/tienda', desvincularTienda);
router.post('/:id/vincular/exposicion', vincularExposicion);
router.delete('/:id/vincular/exposicion', desvincularExposicion);

router.get('/:id/completa', getObraCompleta);

export default router;
