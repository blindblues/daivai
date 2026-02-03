---
description: Linee guida rapide per modifiche di stile
---

# Workflow per il Grafico: Modifiche di Stile

## Prima di iniziare

1. Fai sempre il pull dell'ultimo codice: `git pull origin main`
2. Testa in dev: `npm run dev`

## Regole d'Oro

### ✅ FAI
- Lavora principalmente in `src/styles/global.css` per stili base
- Usa CSS variables per colori (`--primary-color`, `#ff3b30` per errori/danger)
- Per input readonly: usa `background: transparent; border: none;` (Design "Clean")
- Per input editabili: usa background semi-trasparente e border visible
- Usa `:global(.classe)` nei componenti Astro se devi stilare elementi generati dinamicamente via JS

### ❌ NON FARE
- Non aggiungere `background-color` o `font-family` negli `<style>` delle pagine (eredita da global)
- Non hardcodare colori (usa variabili)
- Non toccare la logica JS in `src/components/features/`
- Non modificare le classi funzionali (es. `editable-field`, `danger-zone`) senza coordinarsi


## Workflow Standard

1. **Modifica stili globali**
   ```bash
   # Apri global.css
   code src/styles/global.css
   ```

2. **Testa in dev**
   ```bash
   npm run dev
   # Visita http://localhost:4321/daivai/tua-pagina
   ```

3. **Testa in build**
   ```bash
   npm run build
   npm run preview
   # Visita http://localhost:4321/daivai/tua-pagina
   ```

4. **Se dev e build sono identici → Commit**
   ```bash
   git add src/styles/global.css
   git commit -m "feat(styles): descrizione modifiche"
   git push
   ```

## File di tua Competenza

- `src/styles/global.css` → Il tuo file principale per variabili e reset
- `src/components/ui/*.astro` → Componenti UI puri (Card, Bottoni generici)
- `public/fonts/` & `public/images/` → Assets statici

## File da NON Toccare (o con cautela)

- `src/components/features/*.astro` → Contengono logica complessa (Auth, Form Profilo, Upload). Modifica SOLO riferimenti CSS `:global` o wrapper esterni.
- `src/lib/*.ts` → Utilities e database (Supabase)
- `src/pages/profile.astro` → Contiene logica sensibile (Delete Account, RLS). Tocca solo la sezione `<style>`.

## Esempio Pagina Corretta

```astro
---
import "../styles/global.css";
---

<html>
<body>
    <main class="my-page">
        <!-- Contenuto -->
    </main>
</body>
</html>

<style>
    /* SOLO positioning/layout */
    .my-page {
        display: flex;
        justify-content: center;
        min-height: 100vh;
        /* NO background, NO font-family! */
    }
</style>
```

## Troubleshooting

| Problema | Soluzione |
|----------|-----------|
| Font non si vedono in dev | Controlla che i path abbiano `/daivai/` |
| Colori diversi in dev vs build | Hai un override in una pagina, rimuovilo |
| Il CSS non si applica | Controlla che `global.css` sia importato |

## Domande?

Controlla il file completo: `CONTRIBUTING.md` sezione "Styling Guidelines"
