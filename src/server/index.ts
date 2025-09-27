import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import obrasRoutes from './routes/obrasRoutes';
import tiendasRoutes from './routes/tiendaRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/obras', obrasRoutes);
app.use('/api/tiendas', tiendasRoutes);

app.get('/api/health', (_req, res) => {  // _req para evitar TS6133
  res.json({ status: 'OK', message: 'API Galería de Arte funcionando' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});
