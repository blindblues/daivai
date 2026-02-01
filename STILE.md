# GUIDA DI STILE E SPECIFICHE TECNICHE

## 1. Filosofia di Design
- **Mobile First**: L'identità e l'usabilità su dispositivi mobili hanno la priorità assoluta.
- **Scroll-Driven Storytelling**: L'esperienza utente è guidata dallo scorrimento della pagina. Ogni elemento deve reagire in modo fluido allo scroll.
- **Immersivo**: Uso di sezioni a schermo intero (100vh) e layout puliti.

## 2. Palette Colori
I colori principali definiscono l'identità del brand:
- **Rosso Primario**: `#FB6068`
- **Giallo Secondario**: `#f5e590`
- **Gradienti**: Ampio uso di sfumature tra il rosso e il giallo, sia per i fondi che per i testi (tramite `background-clip: text`).

## 3. Tipografia
- **Testi di Default / Corpo**: `Poppins` (sostitutivo preferito per la leggibilità).
- **Titoli / Display**: 
  - `Condenso` (per testi grandi, impattanti e spesso ridimensionati al viewport).
  - `Integral CF` (per un look tecnico/sportivo).
  - `Whyte` (supporto).
- **Dimensionamento**: 
  - I testi principali (titoli e paragrafi chiave) devono occupare il **90% della larghezza del viewport (`90vw`)** per garantire allineamento perfetto tra elementi diversi indipendentemente dal padding del contenitore.

## 4. Animazioni e Interazioni
- **Libreria**: **GSAP (GreenSock Animation Platform)** è lo standard obbligatorio.
- **Plugin**: **ScrollTrigger** per gestire tutte le animazioni basate sullo scroll.
- **Comportamento**: 
  - Le animazioni devono avere "scrubbing" (collegate direttamente alla barra di scorrimento) o trigger precisi.
  - **Parallasse**: Effetti di sfocatura e scorrimento differenziale sugli elementi in background (es. logo).
- **Performance**: Utilizzare `gsap.quickSetter` o proprietà `transform` per garantire i 60fps, specialmente su mobile.

## 5. Layout e Struttura
- **Unità Viewport**: Uso estensivo di `vw` e `vh` per layout responsivi.
- **Overlay**: Sovrapposizione di elementi (testi su immagini) gestiti con posizionamento assoluto e z-index.
