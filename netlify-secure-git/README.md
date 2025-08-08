# Netlify + Supabase (Secure via Git)

## Yapı
- `edge-functions/protect.js`: Oturumsuz kullanıcıyı `/login`'a yönlendirir (HTML servis edilmeden).
- `netlify/functions/signal.js`: TwelveData proxy + Supabase JWT zorunlu.
- `public/index.html`: Uygulama; veri çağrısını `/.netlify/functions/signal` üzerinden yapar.
- `public/login.html`: Supabase email/password login.

## Deploy (Git üzerinden)
1. Bu klasörü GitHub'a yükle (main branch).
2. Netlify → Add new site → Import from Git → repo'yu seç.
3. Build command boş; **Publish directory = `public`**.
4. **Environment Variables** ekle:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
   - `TWELVE_API_KEY`
5. Deploy tamamlandığında site `/login`'a yönlenecek.

## Notlar
- `%%SUPABASE_URL%%` ve `%%SUPABASE_ANON_KEY%%` stringleri HTML içinde bırakıldı; Netlify env değerleriyle kullanılır (client tarafında okunur). 
- Service role **sadece server** env'de kullanılır.
