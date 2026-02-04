import { supabase } from '../client';

/**
 * Upload documento PDF per l'utente
 */
export async function uploadDocument(userId: string, file: File) {
    // Validazione
    if (file.type !== 'application/pdf') {
        return { data: null, error: new Error('Il file deve essere un PDF') };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
        return { data: null, error: new Error('Il file non può superare 5MB') };
    }

    // Path: user-documents/{userId}/document.pdf
    const filePath = `${userId}/document.pdf`;

    // Upload (sovrascrive se esiste già)
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
            upsert: true,
            contentType: 'application/pdf'
        });

    if (uploadError) {
        return { data: null, error: uploadError };
    }

    // Ottieni URL pubblico (signed per 1 anno)
    const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(filePath);

    // Aggiorna profilo con URL documento
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ document_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        return { data: null, error: updateError };
    }

    return { data: { url: publicUrl, path: filePath }, error: null };
}

/**
 * Elimina documento PDF dell'utente
 */
export async function deleteDocument(userId: string) {
    const filePath = `${userId}/document.pdf`;

    // Rimuovi da storage
    const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([filePath]);

    if (storageError) {
        return { error: storageError };
    }

    // Aggiorna profilo
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ document_url: null })
        .eq('id', userId);

    return { error: updateError };
}
