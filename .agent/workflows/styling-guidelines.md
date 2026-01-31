---
description: Linee guida rapide per modifiche di stile
---

# Workflow per il Grafico: Modifiche di Stile

## Prima di iniziare

1. Fai sempre il pull dell'ultimo codice: `git pull origin main`
2. Testa in dev: `npm run dev`

## Regole d'Oro

### ✅ FAI
- Lavora principalmente in `src/styles/global.css`
- Usa CSS variables per colori e font
- Testa in dev E in build (`npm run build && npm run preview`)
- Lascia che le pagine ereditino da global.css

### ❌ NON FARE
- Non aggiungere `background-color` o `font-family` negli `<style>` delle pagine
- Non hardcodare colori nei componenti
- Non usare `font-family: inherit` sul body
- Non toccare file in `src/components/features/` (logica del dev)

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

- `src/styles/global.css` → Il tuo file principale
- `src/components/ui/*.astro` → Solo stili, NO logica
- `public/fonts/` → Font assets
- `public/images/` → Immagini

## File da NON Toccare

- `src/components/features/*.astro` → Logica applicazione
- `src/lib/*.ts` → Utilities e database
- `src/pages/*.astro` → Solo layout positioning, mai colori/font

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
