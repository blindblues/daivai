---
description: Panoramica del progetto, ruoli del team e decisioni tecniche
---

# Project Context: Dai Vai (Astro Project)

Questo documento serve per allineare l'AI Coding Assistant sulla struttura e le regole del progetto.

## 👥 Team e Ruoli
- **USER (Michelio)**: Si occupa della logica, funzioni semi-dinamiche (eventi, form, content collections).
- **COLLABORATORE**: Si occupa della parte grafica (CSS, layout, estetica).
- **REGOLA**: Dividere sempre le funzioni in componenti in `src/components/` per isolare il CSS del grafico dalla logica del dev.

## 🛠 Tech Stack & Setup
- **Framework**: Astro 5.
- **Scroll**: Lenis 1.3.17+ (Attenzione all'API: usa `orientation`, `syncTouch`, `smoothWheel`).
- **Auth**: Supabase Auth con Google OAuth e Row Level Security (RLS) policies.
- **Database**: Supabase Postgres (tabelle `profiles`, `events`, `participations`).
- **Storage**: Supabase Storage (bucket `user-documents`) per file PDF degli utenti.
- **UI & Layout**: Navbar dinamica (`NavbarAuth.astro`) e design system basato su variabili CSS globali.
- **Environment**: Variabili d'ambiente `.env` (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY).
- **Pathing**: Base URL `/daivai` attiva. Tutte le risorse devono rispettare questo prefisso.

## 📝 Decisioni Architetturali
1. **Separazione UI/Logica**:
   - `src/components/ui/` -> Componenti puramente presentazionali (es. Card, Button).
   - `src/components/features/` -> Componenti con logica di business (es. Auth, ProfileForm, DocumentUpload).
2. **Profile Management**:
   - `profile.astro` gestisce sia visualizzazione (readonly) che modifica.
   - Design "Clean": Input trasparenti in view mode, box visible solo in edit mode.
   - "Danger Zone" separata per azioni distruttive (es. delete account).
3. **Autenticazione**:
   - Google OAuth come metodo principale.
   - Tabella `profiles` estende i dati utente (`auth.users`) tramite trigger o upsert.
   - RLS policies proteggono i dati (ogni utente vede/modifica solo il suo).
4. **Stile**:
   - Uso intensivo di variabili CSS (`--primary-color`, `var(--font-heading)`).
   - CSS Scoped nei componenti, ma con `:global()` quando si manipolano elementi dinamici (es. input creati via JS o readonly).

## 🔍 Problemi Noti & Soluzioni
- **Errori TypeScript**: Se compaiono errori sui moduli Astro, eseguire `npx astro sync`.
- **Favicon/Manifest**: I percorsi nel `site.webmanifest` devono essere relativi alle icone nella stessa cartella.

## 🔄 Come usare questo workflow
Ogni volta che si inizia una nuova sessione o un task importante, l'assistente deve leggere questo file per riprendere il contesto corretto.
