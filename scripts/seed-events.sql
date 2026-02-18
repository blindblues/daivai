-- Script SQL per popolare la tabella events con i dati placeholder
-- Eseguire nell'SQL Editor di Supabase (bypassa RLS)
-- Supabase Dashboard → SQL Editor → New Query → Incolla e Run

INSERT INTO public.events (title, description, event_date, departure_time, return_time, location, cost, max_participants, image_url)
VALUES

-- EVENTI FUTURI (da prossimi-eventi.astro)
(
    'Torneo Estivo',
    'Preparati per il più grande torneo di beach volley dell''estate.',
    '2026-07-15 09:00:00+02',
    '09:00',
    '18:00',
    'Spiaggia di Jesolo',
    '€25,00',
    50,
    NULL
),
(
    'Padel Challenge',
    'Sfida i tuoi amici nel nuovo torneo di padel aperto a tutti i livelli.',
    '2026-07-22 14:00:00+02',
    '14:00',
    '20:00',
    'Centro Sportivo Verona',
    '€20,00',
    32,
    NULL
),
(
    'Notte Bianca dello Sport',
    'Una serata dedicata a diverse discipline sportive sotto le stelle.',
    '2026-08-05 18:00:00+02',
    '18:00',
    '02:00',
    'Arena di Verona',
    'Gratuito',
    200,
    NULL
),
(
    'Corsa Campestre',
    'Un percorso mozzafiato tra le colline veronesi per amatori e professionisti.',
    '2026-09-12 07:00:00+02',
    '07:00',
    '13:00',
    'Valpolicella',
    '€15,00',
    100,
    NULL
),

-- EVENTI PASSATI (da index.astro - carosello)
(
    'Torneo di Beach Volley',
    'Un weekend all''insegna dello sport sulla spiaggia con tornei e attività per tutti.',
    '2025-07-20 09:00:00+02',
    '09:00',
    '18:00',
    'Spiaggia di Jesolo',
    '€20,00',
    48,
    NULL
),
(
    'Corso di Yoga',
    'Sessioni settimanali di yoga per rilassarsi e migliorare il benessere fisico e mentale.',
    '2025-09-01 08:00:00+02',
    '08:00',
    '10:00',
    'Parco Adige, Verona',
    'Gratuito',
    30,
    NULL
),
(
    'Maratona Cittadina',
    'La corsa più attesa dell''anno attraverso le vie storiche di Verona.',
    '2025-10-05 07:30:00+02',
    '07:30',
    '13:00',
    'Centro Storico, Verona',
    '€15,00',
    500,
    NULL
),
(
    'Torneo di Calcetto',
    'Sfide avvincenti tra squadre locali per conquistare il titolo di campione.',
    '2025-11-08 15:00:00+01',
    '15:00',
    '20:00',
    'Campo Sportivo Verona Est',
    '€10,00',
    60,
    NULL
),
(
    'Workshop Fitness',
    'Allenamenti funzionali e lezioni di gruppo per restare in forma divertendosi.',
    '2025-12-06 10:00:00+01',
    '10:00',
    '13:00',
    'Palestra Centrale, Verona',
    '€8,00',
    40,
    NULL
),
(
    'Escursione in Montagna',
    'Una giornata immersi nella natura con trekking e attività outdoor.',
    '2026-01-18 07:00:00+01',
    '07:00',
    '18:00',
    'Monte Baldo, Malcesine',
    '€12,00',
    25,
    NULL
);
