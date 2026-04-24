# n0llan_floppy_bird
Värdigt spel för en så meningslös och ovärdig själ som n0llan
## Teknikstack

- **Frontend** — Vanilla HTML, CSS och Canvas API
- **Backend** — Vercel Serverlösa funktioner (Node 18)
- **Databas** — Supabase (Postgres)
- **Hosting** — Vercel

## Projektstruktur
/api
scores.js     # Serverlös funktion som hanterar läsning och skrivning mot databasen
index.html      # Spel och ledartavla
vercel.json     # Vercel routingkonfiguration
## Miljövariabler

Lägg till dessa i Vercel under Settings → Environment Variables. Lägg aldrig till dessa direkt i koden eller committa dem till repot.

| Variabel | Beskrivning |
|---|---|
| `SUPABASE_URL` | Din Supabase-projektadress |
| `SUPABASE_KEY` | Din Supabase anon-nyckel |

## Lokal utveckling

Eftersom spelet anropar `/api/scores` behöver du Vercel CLI för att köra projektet lokalt. Installera det och starta en lokal server med följande kommandon:

```bash
npm i -g vercel
vercel dev
```

Öppna sedan `http://localhost:3000` i webbläsaren. Skapa även en `.env.local`-fil i rotkatalogen med dina miljövariabler — den ignoreras automatiskt av Git och pushas aldrig till GitHub:
## Poängvalidering

All poängvalidering sker på serversidan i `api/scores.js` för att förhindra fusk. Maxpoäng är satt till 200, gruppnamnet måste matcha en av de tio giltiga grupperna, och en grupps bästa poäng skrivs aldrig över med ett lägre värde.
