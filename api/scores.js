const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TABLE = 'group_scores';

const VALID_GROUPS = [
  'Red Hawks', 'Gold Stars', 'Green Wave', 'Blue Bolts', 'Purple Pack',
  'Pink Squad', 'Cyan Crew', 'Yellow Yetis', 'Orange Owls', 'Violet Vipers'
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  // GET — load all scores
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*`, {
        headers: BASE_HEADERS
      });
      if (!response.ok) throw new Error('Failed to load scores');
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — save a score
  if (req.method === 'POST') {
    const { group_name, best_score, games_played } = req.body;

    // Validate group name
    if (!VALID_GROUPS.includes(group_name)) {
      return res.status(400).json({ error: 'Invalid group name' });
    }

    // Validate score range
    if (typeof best_score !== 'number' || best_score < 0 || best_score > 500) {
      return res.status(400).json({ error: 'Score must be between 0 and 500' });
    }

    try {
      // First fetch the current best so we never overwrite a higher score
      const current = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?group_name=eq.${encodeURIComponent(group_name)}&select=best_score,games_played`,
        { headers: BASE_HEADERS }
      );
      const rows = await current.json();
      const existing = rows[0];

      const finalBest   = existing ? Math.max(existing.best_score, best_score) : best_score;
      const finalGames  = existing ? existing.games_played + 1 : 1;

      const upsert = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          ...BASE_HEADERS,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          group_name,
          best_score: finalBest,
          games_played: finalGames
        })
      });

      if (!upsert.ok) throw new Error('Failed to save score');
      const saved = await upsert.json();
      return res.status(200).json(saved[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
