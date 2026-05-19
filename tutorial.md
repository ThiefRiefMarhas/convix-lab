# Panduan Lengkap Integrasi Autentikasi Supabase & OAuth

Tutorial ini menjelaskan **alur (flow)** autentikasi, **ke mana user akan diarahkan (redirect)**, dan **cara setting** Google Cloud Console serta Supabase Dashboard untuk environment *Development* dan *Production*.

---

## 1. Memahami Alur Redirect (Ke Mana User Diarahkan?)

Pada sistem Convix Idea Lab saat ini (berdasarkan `src/context/AuthContext.tsx`), alurnya adalah sebagai berikut:

1. User berada di halaman depan (`/`) dan menekan tombol **"Continue with Google"**.
2. Frontend (lewat fungsi `signInWithOAuth`) akan melempar user ke **Server Supabase**.
3. **Supabase** akan melempar user ke **Google** untuk login.
4. Setelah berhasil login di Google, Google akan mengembalikan user ke **Supabase** (lewat *Callback URI*).
5. **Supabase** akan mengembalikan user ke **Aplikasi Frontend Kamu**.
   * 👉 Di kode kita, redirect sudah diatur secara eksplisit ke: `window.location.origin + '/app'`
   * Artinya:
     - Di Local/Development, user akan dikembalikan ke: `http://localhost:5173/app`
     - Di Production (jika rilis), user akan dikembalikan ke: `https://domain-kamu.com/app`

**Kesimpulan:** Kamu tidak perlu pusing memikirkan *logic* redirect manual. Selama pengaturan di Google dan Supabase benar, Supabase akan otomatis melempar user ke `/app` setelah berhasil login.

---

## 2. Pengaturan di Google Cloud Console

Google hanya butuh berkomunikasi dengan **Supabase**, bukan dengan `localhost` kamu secara langsung.

Masuk ke [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials** > Buka OAuth 2.0 Client ID milikmu.

*   **Authorized JavaScript origins**
    *   *Bisa dibiarkan kosong*, atau jika wajib diisi, masukkan URL project Supabase kamu: `https://[PROJECT_ID].supabase.co`
*   **Authorized redirect URIs** (Ini yang wajib persis!)
    *   Masukkan URL Callback Supabase kamu: `https://[PROJECT_ID].supabase.co/auth/v1/callback`
    *   *(Ganti `[PROJECT_ID]` dengan ID asli dari dashboard Supabase-mu).*

> ❌ Jangan memasukkan `http://localhost:5173` di pengaturan Google! Google tidak peduli dengan localhost-mu, dia hanya peduli dengan Supabase.

---

## 3. Pengaturan di Supabase Dashboard

Supabase yang bertugas mengembalikan user ke aplikasimu (localhost atau domain asli). Oleh karena itu, Supabase harus tahu URL mana saja yang "aman" dan diizinkan.

Masuk ke **Supabase Dashboard** > **Authentication** > **URL Configuration**.

### A. Site URL (URL Utama Aplikasi)
Ini adalah URL *default* di mana aplikasimu hidup.
*   **Saat Development (Lokal):** `http://localhost:5173`
*   **Saat Production (Live):** `https://convix.id` (Contoh domainmu)

### B. Redirect URLs (URL yang diizinkan untuk tujuan redirect)
Karena di kode kita meminta Supabase untuk mengarahkan user ke `/app` (lihat `AuthContext.tsx`), maka kita harus mendaftarkan URL tersebut di Supabase agar tidak diblokir.

Tambahkan *Wildcard* agar aman:
*   **Saat Development:** `http://localhost:5173/**`
*   **Saat Production:** `https://convix.id/**`

*(Tanda `/**` memberitahu Supabase: "Izinkan redirect ke semua halaman di bawah domain ini, termasuk /app, /dashboard, dll")*

---

## 4. Cara Mengetes Apakah Sudah Benar?

1. Pastikan `.env` kamu sudah berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` yang benar.
2. Di Supabase Dashboard > **Authentication** > **Providers**, pastikan provider Google sudah **Enabled**.
3. Masukkan `Client ID` dan `Client Secret` dari Google Cloud Console ke dalam settingan provider Google di Supabase.
4. Jalankan `npm run dev`.
5. Klik **"Continue with Google"**.
6. Jika berhasil, kamu akan login dengan akun Google dan langsung berpindah ke halaman kosong/dashboard di rute `http://localhost:5173/app`.

---

### Catatan Penting Saat Pindah ke Production Nanti:
Ketika kamu mau *deploy* website ke Vercel atau Netlify (Production):
1. Ubah **Site URL** di Supabase menjadi domain asli kamu (misal: `https://convix.id`).
2. Tambahkan domain asli kamu ke daftar **Redirect URLs** di Supabase (`https://convix.id/**`).
3. Di Google Cloud Console, kamu **TIDAK PERLU MENGUBAH APAPUN** (karena Callback URL Supabase `https://[PROJECT_ID].supabase.co/auth/v1/callback` tidak akan pernah berubah, meskipun nama domain frontend kamu berubah).
