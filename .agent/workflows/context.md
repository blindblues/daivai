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
- **Auth & Database**: Supabase (Gestione account tramite `src/lib/supabase.ts` e componente `src/components/Auth.astro`).
- **UI & Layout**: Navbar dinamica tramite `src/components/NavbarAuth.astro` con icona floating e modal per l'accesso.
- **Environment**: Variabili d'ambiente in `.env` con prefisso `PUBLIC_` obbligatorio per l'uso lato client (Supabase URL e Anon Key).
- **Pathing**: Base URL `/daivai` attiva. Tutte le risorse devono rispettare questo prefisso.

## 📝 Decisioni Architetturali
1. **Componentizzazione**: Ogni macro-funzione (Eventi, Auth, Navbar) ha il suo file in `src/components/`. Questo isola la logica di Michelio dallo stile del Collaboratore.
2. **Dati Semi-Dinamici**: Eventi gestiti via Markdown in `src/content/events/` con schema TypeScript.
3. **Autenticazione**: Sistema di login/registrazione integrato in un modal accessibile dall'icona profilo in alto a destra. Non servono tabelle manuali su Supabase per l'auth base.
4. **Stile**: Incoraggiare l'uso di variabili CSS e mantenere il CSS nei componenti (`<style>` scoped) per evitare conflitti.

## 🔍 Problemi Noti & Soluzioni
- **Errori TypeScript**: Se compaiono errori sui moduli Astro, eseguire `npx astro sync`.
- **Favicon/Manifest**: I percorsi nel `site.webmanifest` devono essere relativi alle icone nella stessa cartella.

## 🔄 Come usare questo workflow
Ogni volta che si inizia una nuova sessione o un task importante, l'assistente deve leggere questo file per riprendere il contesto corretto.
