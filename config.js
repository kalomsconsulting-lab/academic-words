// Konfiguracja synchronizacji postępu (Supabase).
// Klucz "anon public" jest z założenia publiczny — dostęp do danych chronią reguły RLS w bazie
// (supabase/schema.sql). Pusty klucz = synchronizacja wyłączona, aplikacja działa lokalnie.
window.AW_CONFIG = {
  supabaseUrl: 'https://angmnywcfdvfamssurcb.supabase.co',
  supabaseAnonKey: 'sb_publishable_3Gzijey2Y00BEQND0UCAYA_-HjDVlia',
};
