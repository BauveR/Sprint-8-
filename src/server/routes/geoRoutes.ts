import { Router } from 'express';
import { geocodeAddress } from '../controllers/geoController';

const router = Router();
router.get('/geocode', geocodeAddress);

export default router;
