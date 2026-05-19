import { supabaseAdmin, isAdmin, json } from './_lib.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) {
    return json(res, 401, { error: 'Unauthorized' });
  }

  const db = supabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('app_config')
      .select('value')
      .eq('key', 'main')
      .maybeSingle();

    if (error) {
      return json(res, 500, { error: error.message });
    }

    return json(res, 200, data?.value || {});
  }

  if (req.method === 'POST') {
    try {
      const chunks = [];

      for await (const c of req) {
        chunks.push(c);
      }

      const raw = Buffer.concat(chunks).toString() || '{}';
      const body = JSON.parse(raw);

      const { error } = await db
        .from('app_config')
        .upsert(
          {
            key: 'main',
            value: body
          },
          {
            onConflict: 'key'
          }
        );

      if (error) {
        return json(res, 500, { error: error.message });
      }

      return json(res, 200, { ok: true });
    } catch (e) {
      return json(res, 500, { error: e.message || 'Erreur sauvegarde configuration' });
    }
  }

  return json(res, 405, { error: 'Method not allowed' });
}
