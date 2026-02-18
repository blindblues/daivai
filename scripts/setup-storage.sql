-- ============================================================
-- SETUP STORAGE BUCKET: event-images
-- Esegui questo script nel Supabase SQL Editor
-- ============================================================

-- 1. Crea il bucket pubblico (se non esiste già)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-images',
    'event-images',
    true,                          -- bucket pubblico (URL accessibili senza auth)
    5242880,                       -- 5MB max per file
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Policy: chiunque può LEGGERE le immagini (necessario per visualizzarle)
DROP POLICY IF EXISTS "Public read event images" ON storage.objects;
CREATE POLICY "Public read event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- 3. Policy: solo utenti autenticati con ruolo admin possono CARICARE immagini
DROP POLICY IF EXISTS "Admin upload event images" ON storage.objects;
CREATE POLICY "Admin upload event images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- 4. Policy: solo admin possono AGGIORNARE immagini (upsert)
DROP POLICY IF EXISTS "Admin update event images" ON storage.objects;
CREATE POLICY "Admin update event images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- 5. Policy: solo admin possono ELIMINARE immagini
DROP POLICY IF EXISTS "Admin delete event images" ON storage.objects;
CREATE POLICY "Admin delete event images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);
