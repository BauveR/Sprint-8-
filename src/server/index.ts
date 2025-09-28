import express, { Request, Response } from 'express';  // ⬅️ default + tipos
import cors from 'cors';
import * as dotenv from 'dotenv';
import { testConnection } from './config/database';
import obrasRoutes from './routes/obrasRoutes';
import tiendasRoutes from './routes/tiendaRoutes';
import geoRoutes from './routes/geoRoutes'; // si usas geocoding

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/obras', obrasRoutes);
app.use('/api/tiendas', tiendasRoutes);
app.use('/api/geo', geoRoutes); // si lo tienes

app.get('/api/health', (_req: Request, res: Response) => {   // ⬅️ tipado explícito
  res.json({ status: 'OK', message: 'API Galería de Arte funcionando' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});
