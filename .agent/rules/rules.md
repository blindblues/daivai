---
trigger: always_on
---

# Regole Progetto Dai Vai

## 👤 Il Mio Ruolo

**Identificazione Automatica basata su GitHub username:**

Prima di lavorare, leggi il nome utente Git con:
```bash
git config user.name
```

**Se il nome è `MikeFrank99` → BACKEND DEVELOPER**
- Creo/modifico SOLO file in `src/lib/database/`
- NON tocco mai HTML/CSS nei componenti `.astro`
- NON modifico file in `src/components/ui/`, `src/pages/`, `src/styles/`, `src/scripts/`
- Mi concentro su funzioni database, validazioni, e logica server-side

**Se il nome è `blindblues` → FRONTEND DEVELOPER**
- Creo/modifico file in `src/components/ui/`, `src/pages/`, `src/styles/`, `src/scripts/`
- Creo componenti UI con dati placeholder/mock
- NON tocco mai file in `src/lib/database/`
- NON scrivo query Supabase dirette, uso funzioni backend già create
- Mi concentro su UI, animazioni, e user experience
- **Seguo le convenzioni di design in `STILE.md`** (palette colori, tipografia, animazioni GSAP)

---

## 🤝 Convenzioni Team Frontend/Backend

### Divisione Responsabilità

**Backend Developer:**
- Lavora SOLO in `src/lib/database/`
- Crea e modifica funzioni database
- NON tocca mai HTML/CSS nei file `.astro`
- Usa sempre path aliases: `import { } from '@/lib/client'`

**Frontend Developer:**
- Lavora in `src/components/ui/`, `src/pages/`, `src/styles/`, `src/scripts/`
- Crea componenti UI con dati placeholder/mock
- NON scrive query Supabase dirette, usa funzioni backend
- Usa sempre path aliases: `import { } from '@/lib/database/...'`

**File Condivisi (`src/components/features/`):**
- Frontend crea HTML/CSS con dati mock
- Backend sostituisce i mock con dati reali nella sezione `---`
- Backend NON modifica HTML/CSS

### Best Practices

- ✅ Usa SEMPRE path aliases `@/lib/...` invece di `../../lib/...`
- ✅ Le funzioni database devono ritornare `{ data, error }`
- ✅ Committare spesso con messaggi chiari
- ✅ Workflow "Mock-First": frontend con placeholder → backend integra dati reali

### Documentazione Completa

Per dettagli completi sul workflow di collaborazione, leggi `TEAM_WORKFLOW.md` nella root del progetto.

---

## 🛠️ Stack Tecnologico

- **Framework:** Astro 5 (v5.16.15+)
- **Output:** Static (SSG)
- **Base URL:** `/daivai` (importante per asset paths)
- **Database:** Supabase (Postgres)
  - Tabelle: `profiles`, `events`, `participations`
  - Storage bucket: `user-documents` (PDF)
- **Autenticazione:** Supabase Auth
  - Google OAuth come metodo principale
  - Row Level Security (RLS) policies attive
- **Styling:** CSS vanilla
  - Design system con variabili CSS (`--primary-color`, ecc.)
  - CSS scoped nei componenti
- **Animazioni:** 
  - GSAP v3.14.2+ (libreria standard)
  - ScrollTrigger per animazioni scroll-driven
  - Lenis v1.3.17+ per smooth scroll (API: `orientation`, `syncTouch`, `smoothWheel`)
- **UI Framework:** React (per componenti interattivi)
- **Environment:** Variabili in `.env`:
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`

---

## 📂 Struttura Progetto

```
src/
├── lib/
│   ├── client.ts              # Client Supabase base (shared)
│   └── database/              # Backend only
│       ├── profiles.ts        # Gestione profili utente
│       ├── events.ts          # CRUD eventi e partecipazioni
│       └── storage.ts         # Upload/delete documenti
│
├── components/
│   ├── features/              # Componenti con logica (workflow Mock-First)
│   │   ├── Auth.astro         # Autenticazione
│   │   ├── ProfileForm.astro  # Form profilo utente
│   │   └── DocumentUpload.astro
│   └── ui/                    # Frontend only (componenti puri)
│       ├── EventCard.astro
│       ├── NavbarAuth.astro
│       └── ScrollArrow.astro
│
├── pages/                     # Frontend only
│   ├── index.astro
│   ├── profile.astro
│   ├── login.astro
│   ├── auth-callback.astro
│   └── complete-profile.astro
│
├── scripts/                   # Frontend only (JS client-side)
│   └── animations.js          # GSAP + Lenis animations
│
└── styles/                    # Frontend only
    └── global.css             # CSS globale con design system
```

---

## 🏗️ Decisioni Architetturali

### 1. Separazione Backend/Frontend
- **Backend:** Tutto in `src/lib/database/` - funzioni pure che ritornano `{ data, error }`
- **Frontend:** UI components, pages, styles, scripts
- **Condiviso:** `src/components/features/` segue workflow Mock-First

### 2. Profile Management
- `profile.astro` gestisce sia visualizzazione (readonly) che modifica
- Design "Clean": Input trasparenti in view mode, box visible in edit mode
- "Danger Zone" separata per azioni distruttive (es. delete account)

### 3. Autenticazione
- Google OAuth come metodo principale
- Tabella `profiles` estende `auth.users` tramite trigger/upsert
- RLS policies proteggono i dati (ogni utente vede/modifica solo il suo)

### 4. Path Aliases
- Configurati in `tsconfig.json` come `@/*` → `src/*`
- Usare SEMPRE path aliases invece di percorsi relativi
- Esempio: `import { supabase } from '@/lib/client'`

### 5. Stile e Design
- Uso intensivo di variabili CSS per consistency
- CSS scoped nei componenti con `:global()` quando necessario
- Palette colori: Rosso `#FB6068` + Giallo `#f5e590`
- Font: Poppins (corpo), Condenso/Integral CF/Whyte (titoli)

---

## 🔍 Problemi Noti & Soluzioni

### TypeScript Errors
```bash
# Se compaiono errori sui moduli Astro
npx astro sync
```

### Build Verification
```bash
# Verifica TypeScript
npm run astro check

# Test build produzione
npm run build
npm run preview
```

### Asset Paths
- Tutti gli asset devono usare base URL `/daivai/`
- Esempio: `/daivai/fonts/Poppins/...` non `/fonts/...`

---

## 🚀 Comandi Essenziali

```bash
# Dev
npm ci                  # Installa dipendenze (versioni esatte)
npm run dev            # Server sviluppo

# Build
npm run build          # Build produzione
npm run preview        # Preview build locale

# Verifica
npm run astro check    # TypeScript check
```

---

## 📚 Riferimenti Rapidi

- **Workflow collaborativo:** `TEAM_WORKFLOW.md`
- **Design guidelines:** `STILE.md`
- **Project overview:** `README.md`
