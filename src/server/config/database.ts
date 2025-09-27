import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'rick',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'galeria_arte',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Verificar conexión
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  }
};