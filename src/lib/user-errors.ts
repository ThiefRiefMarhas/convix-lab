import type { Locale } from '../i18n/ui';

export interface UserFacingError {
  title: string;
  message: string;
  hint?: string;
}

const MESSAGES = {
  en: {
    genericTitle: 'Something went wrong',
    networkTitle: 'Connection problem',
    networkMessage: 'Could not reach the server. Check your internet connection and try again.',
    networkHintMobile: 'On mobile, open the same address as on your computer (e.g. http://192.168.x.x:3000), not localhost.',
    authTitle: 'Sign in required',
    authMessage: 'Your session expired or you are not signed in. Please log in again.',
    rateLimitTitle: 'Limit reached',
    rateLimitMessage: 'You have reached today\'s usage limit. Try again tomorrow or upgrade your plan.',
    serverTitle: 'Server error',
    serverMessage: 'The server encountered an error. Please try again in a moment.',
    sendFailed: 'Failed to send message. Please try again.',
    apiConfigTitle: 'Service Maintenance',
    apiConfigMessage: 'Our AI engine is currently undergoing maintenance or configuration updates. Please try again shortly.',
    apiConfigHint: 'Developer note: Ensure the required API keys (OPENROUTER_API_KEY, TAVILY_API_KEY) are set correctly in your environment (.env file).',
    creditDepletedTitle: 'Quota Depleted',
    creditDepletedMessage: 'The AI service provider has reached its API limit or has insufficient credits. Please contact the administrator.',
    creditDepletedHint: 'Developer note: Check your OpenRouter / Tavily billing settings and ensure your API account has sufficient funds.',
  },
  id: {
    genericTitle: 'Terjadi kesalahan',
    networkTitle: 'Masalah koneksi',
    networkMessage: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.',
    networkHintMobile: 'Di HP, buka alamat yang sama dengan komputer (mis. http://192.168.x.x:3000), bukan localhost.',
    authTitle: 'Perlu masuk',
    authMessage: 'Sesi Anda habis atau belum masuk. Silakan masuk kembali.',
    rateLimitTitle: 'Batas tercapai',
    rateLimitMessage: 'Anda telah mencapai batas penggunaan hari ini. Coba lagi besok atau upgrade paket.',
    serverTitle: 'Kesalahan server',
    serverMessage: 'Server mengalami gangguan. Silakan coba lagi sebentar.',
    sendFailed: 'Gagal mengirim pesan. Silakan coba lagi.',
    apiConfigTitle: 'Pemeliharaan Sistem',
    apiConfigMessage: 'Mesin kecerdasan buatan (AI) kami sedang dalam pemeliharaan atau pembaruan konfigurasi. Silakan coba lagi nanti.',
    apiConfigHint: 'Catatan Developer: Pastikan API key yang dibutuhkan (OPENROUTER_API_KEY, TAVILY_API_KEY) terpasang dengan benar di lingkungan server Anda (file .env).',
    creditDepletedTitle: 'Kuota Habis',
    creditDepletedMessage: 'Penyedia layanan AI telah melampaui batas kuota atau tidak memiliki saldo kredit yang cukup. Silakan hubungi admin.',
    creditDepletedHint: 'Catatan Developer: Periksa pengaturan penagihan OpenRouter / Tavily Anda dan pastikan akun API Anda memiliki saldo kredit yang cukup.',
  },
} as const;

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = String((err as Error)?.message || err || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('network error') ||
    msg.includes('load failed') ||
    msg.includes('the internet connection appears to be offline') ||
    msg.includes('aborted') ||
    msg.includes('timed out') ||
    msg.includes('timeout') ||
    msg.includes('connection lost') ||
    msg.includes('connection refused') ||
    msg.includes('network') ||
    msg.includes('offline')
  );
}

function isAuthError(status?: number, message?: string): boolean {
  if (status === 401 || status === 403) return true;
  const m = (message || '').toLowerCase();
  return m.includes('unauthorized') || m.includes('log in') || m.includes('authentication');
}

export function formatUserError(
  err: unknown,
  locale: Locale = 'id',
  options?: { status?: number; rawMessage?: string }
): UserFacingError {
  const t = MESSAGES[locale];
  const raw = options?.rawMessage || (err instanceof Error ? err.message : String(err || ''));
  const status = options?.status;
  const rawLower = raw.toLowerCase();

  // Intercept API key / Env / configuration issues
  if (
    rawLower.includes('api key') ||
    rawLower.includes('api_key') ||
    rawLower.includes('env') ||
    rawLower.includes('config') ||
    rawLower.includes('tavily') ||
    rawLower.includes('openrouter')
  ) {
    return {
      title: t.apiConfigTitle,
      message: t.apiConfigMessage,
      hint: t.apiConfigHint
    };
  }

  // Intercept insufficient credits / balance / billing issues
  if (
    rawLower.includes('credit') ||
    rawLower.includes('insufficient') ||
    rawLower.includes('balance') ||
    rawLower.includes('quota') ||
    rawLower.includes('billing')
  ) {
    return {
      title: t.creditDepletedTitle,
      message: t.creditDepletedMessage,
      hint: t.creditDepletedHint
    };
  }

  if (isAuthError(status, raw)) {
    return { title: t.authTitle, message: t.authMessage };
  }

  if (status === 429 || rawLower.includes('rate limit') || rawLower.includes('max ')) {
    return { title: t.rateLimitTitle, message: raw || t.rateLimitMessage };
  }

  if (isNetworkError(err) || rawLower.includes('failed to fetch')) {
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return {
      title: t.networkTitle,
      message: t.networkMessage,
      hint: isMobile ? t.networkHintMobile : undefined,
    };
  }

  if (status && status >= 500) {
    return { title: t.serverTitle, message: t.serverMessage };
  }

  if (raw && raw !== 'Failed to send message') {
    return { title: t.genericTitle, message: raw };
  }

  return { title: t.genericTitle, message: t.sendFailed };
}

export function parseHttpErrorBody(text: string): string {
  try {
    const data = JSON.parse(text);
    return data.error || data.message || text;
  } catch {
    return text.slice(0, 200) || 'Request failed';
  }
}
