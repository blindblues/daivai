# Dai Vai 🚀

Piattaforma web per gestione eventi e profili utente con autenticazione Supabase.

## 📋 Descrizione

**Dai Vai** è un'applicazione web statica costruita con Astro che permette agli utenti di:
- Registrarsi e autenticarsi (email/password o Google OAuth)
- Gestire il proprio profilo personale
- Visualizzare e partecipare a eventi
- Caricare documenti personali (PDF)

## 🏗️ Architettura

Il progetto segue una separazione rigida tra **Backend** e **Frontend** per permettere sviluppo parallelo senza conflitti.

### Struttura Directory

```
src/
├── lib/
│   ├── client.ts              # Client Supabase condiviso
│   └── database/              # Funzioni backend (Backend Developer)
│       ├── profiles.ts        # Gestione profili utente
│       ├── events.ts          # CRUD eventi e partecipazioni
│       └── storage.ts         # Upload/delete documenti
│
├── components/
│   ├── features/              # Componenti con logica (condivisi)
│   │   ├── Auth.astro
│   │   ├── ProfileForm.astro
│   │   └── DocumentUpload.astro
│   └── ui/                    # Componenti UI puri (Frontend Developer)
│       ├── EventCard.astro
│       ├── NavbarAuth.astro
│       └── ScrollArrow.astro
│
├── pages/                     # Pagine del sito (Frontend Developer)
├── scripts/                   # JavaScript client-side (Frontend Developer)
└── styles/                    # CSS globale (Frontend Developer)
```

## 🛠️ Stack Tecnologico

- **Framework:** [Astro 5](https://astro.build/) (static output)
- **Database:** [Supabase](https://supabase.com/)
- **Autenticazione:** Supabase Auth (email + Google OAuth)
- **Styling:** CSS vanilla con animazioni GSAP
- **Hosting:** GitHub Pages / Cloudflare Pages
- **Runtime:** Node.js 18+

## 🚀 Quick Start

### Installazione

```bash
# Clona il repository
git clone https://github.com/blindblues/daivai.git
cd daivai

# Installa dipendenze (usa npm ci per versioni esatte)
npm ci
```

### Configurazione

Crea un file `.env` nella root:

```env
PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Sviluppo

```bash
# Avvia dev server
npm run dev

# Apri http://localhost:4321/daivai/
```

### Build Produzione

```bash
# Build statico
npm run build

# Preview build locale
npm run preview
```

## 👥 Collaborazione

Questo progetto è sviluppato da un team di 2 persone:

- **Backend Developer (MikeFrank99):** Logica, database, API
- **Frontend Developer (blindblues):** UI, animazioni, user experience

### Workflow "Mock-First"

1. **Frontend** crea componenti UI con dati placeholder
2. **Backend** crea funzioni database in `src/lib/database/`
3. **Frontend** sostituisce i mock con chiamate alle funzioni backend
4. **Zero conflitti!** 🎉

📚 **Leggi la guida completa:** [`TEAM_WORKFLOW.md`](./TEAM_WORKFLOW.md)

## 🎨 Design Guidelines

Per convenzioni di stile, palette colori, tipografia e animazioni:

📖 **Consulta:** [`STILE.md`](./STILE.md)

## 📦 Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm ci` | Installa dipendenze esatte |
| `npm run dev` | Avvia server di sviluppo |
| `npm run build` | Build produzione |
| `npm run preview` | Preview build locale |
| `npm run astro check` | Verifica TypeScript |
| `npm run astro -- --help` | Help CLI Astro |

## 🔐 Configurazione Supabase

### Database Tables

- **`profiles`** - Profili utente estesi
- **`events`** - Eventi disponibili
- **`participations`** - Partecipazioni eventi
- **`user-documents`** (Storage) - Documenti PDF utente

### Row Level Security (RLS)

Tutte le tabelle hanno policy RLS attive per proteggere i dati utente.

## 📄 Licenza

ISC

## 🤝 Contributing

Per contribuire al progetto:

1. Leggi [`TEAM_WORKFLOW.md`](./TEAM_WORKFLOW.md) per capire le convenzioni
2. Crea un branch per la tua feature
3. Fai commit con messaggi chiari
4. Apri una Pull Request

## 📞 Supporto

Per domande o problemi, apri una [issue](https://github.com/blindblues/daivai/issues).

---

**Fatto con ❤️ dal team Dai Vai**
