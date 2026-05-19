import { supabaseAdmin, isAdmin, json } from './_lib.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) return json(res, 401, { error: 'Unauthorized' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

    if (!body.id) return json(res, 400, { error: 'Missing reservation id' });

    const db = supabaseAdmin();
    const { error } = await db.from('reservations').delete().eq('id', body.id);

    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, 500, { error: e.message || 'Delete failed' });
  }
}
