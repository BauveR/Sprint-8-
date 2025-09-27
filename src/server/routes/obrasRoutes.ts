import { Router } from 'express';
import { getObras, getObraById, createObra, getObrasConUbicacion } from '../controllers/obrasController';

const router = Router();

router.get('/', getObras);
router.get('/ubicacion', getObrasConUbicacion);
router.get('/:id', getObraById);
router.post('/', createObra);

export default router;