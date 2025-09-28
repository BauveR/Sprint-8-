import type { Request, Response } from 'express';
import fetch from 'node-fetch';

/**
 * GET /api/geo/geocode?address=Calle+Gran+Vía+1,+Madrid
 * Respuesta: { lat, lng, display_name, raw }
 */
export async function geocodeAddress(req: Request, res: Response) {
  try {
    const address = (req.query.address as string || '').trim();
    if (!address) return res.status(400).json({ error: 'address es requerido' });

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', address);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    // Respetar política de uso de Nominatim: añade un User-Agent identificable
    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'GaleriaArte/1.0 (contacto@tu-dominio.com)' }
    });
    const data = await response.json() as any[];

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron resultados' });
    }

    const result = data[0];
    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
      raw: result
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error en geocoding Nominatim' });
  }
}
