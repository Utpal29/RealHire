# RealHire AI

AI-powered resume optimization studio. Paste or drop a resume (PDF/DOCX), feed a job description, and get:
- A match score with missing skills and actionable suggestions.
- A rewritten, ATS-friendly Markdown resume.
- An “ideal” 100% match reference resume.

## Preview
Add your screenshots after capture:
- `![RealHire hero](./public/screenshot-hero.png)`
- `![Analysis results](./public/screenshot-results.png)`

## Stack
- Next.js 16 (App Router) + TypeScript
- Groq SDK (`llama-3.1-8b-instant`)
- Framer Motion (lightly used), Lucide icons
- Parsing: `pdfjs-dist` (PDF via worker), `mammoth` (DOCX)

## Setup
1) Install deps
```bash
npm install
```
2) Create `.env.local`
```
GROQ_API_KEY=your_key_here
```
3) Run dev server
```bash
npm run dev
```
App lives at http://localhost:3000.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — lint (PDF worker is ignored in `eslint.config.mjs`)

## How it works
1) Client (`src/app/page.tsx`) collects resume + JD.
2) API route (`src/app/api/analyze/route.ts`) calls `analyzeResume` in `src/lib/llm.ts` (Groq prompt/parse).
3) Response includes score, missing skills, suggestions, rewritten resume, and ideal resume. Client adds `id`/`date` locally for history.
4) Results render in `ResultsView`; history stored in localStorage via `useHistory`.

## Notable UI bits
- Calm slate/blue palette, solid gradient background (no neon glows).
- Custom score dial with trail stroke (no glow ring).
- Dual-column intake with dropzone + JD textarea, styled CTAs.
- History drawer (last 10 analyses), local-only storage.

## File map (key)
- `src/app/layout.tsx` — fonts, layout shell, hydration suppression.
- `src/app/globals.css` — theme tokens/base styles.
- `src/app/page.tsx` — hero + form/results toggle.
- `src/app/api/analyze/route.ts` — POST handler to Groq.
- `src/components/*` — UI modules (form, results, history, footer, background).
- `src/lib/groq.ts` — typed Groq client; `llm.ts` — prompt/parse logic; `fileParser.ts` — PDF/DOCX text extraction.
- `src/hooks/useHistory.ts` — localStorage history (lazy init).
- `src/types` — shared types.

## API Contract
`POST /api/analyze`
```json
{ "resumeText": "string", "jobDescription": "string" }
```
Returns
```json
{
  "score": number,
  "missingSkills": ["string"],
  "suggestions": ["string"],
  "fixedResume": "markdown",
  "idealResume": "markdown",
  "id": "uuid",     // added client-side
  "date": "ISO"     // added client-side
}
```

## Notes
- PDF worker served from `public/pdf.worker.min.mjs`.
- Extension-induced hydration noise is suppressed on `<html>` (layout.tsx).
- Data privacy: history is localStorage only; no server persistence.
