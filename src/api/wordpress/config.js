/**
 * WordPress REST API yapılandırma dosyası
 * Bu dosya WordPress sitenize bağlanmak için gerekli ayarları içerir
 */

// WordPress site URL'i (kendi WordPress sitenizin URL'i ile değiştirilmeli)
export const WORDPRESS_URL = 'https://mykocakstaff.com';

// WordPress REST API endpoint'i (base URL)
export const API_URL = `${WORDPRESS_URL}/wp-json`;

// JWT Auth endpoint'i
export const JWT_AUTH_ENDPOINT = '/jwt-auth/v1/token';

// WordPress API sürümü
export const WP_API_VERSION = '/wp/v2';

// Kullanıcı işleri endpoint'i
export const USER_JOBS_ENDPOINT = '/myapp/v1/user-jobs';

// API Endpoint'leri
export const ENDPOINTS = {
  // Kimlik doğrulama
  AUTH: {
    LOGIN: JWT_AUTH_ENDPOINT,
    VALIDATE: `${JWT_AUTH_ENDPOINT}/validate`,
    // WordPress'in doğru şifre sıfırlama endpoint'i
    LOST_PASSWORD: '/myapp/v1/reset-password',
    // WordPress şifre sıfırlama sayfası URL'si (tarayıcıya yönlendirme için)
    LOST_PASSWORD_PAGE: `${WORDPRESS_URL}/giris-yap/lost-password/?show-reset-form=true`,
  },
  
  // Kullanıcılar
  USERS: {
    ME: `${WP_API_VERSION}/users/me`,
    REGISTER: '/myapp/v1/register-employee', // Özel kayıt endpoint'i
    BY_ID: (id) => `${WP_API_VERSION}/users/${id}`,
    JOBS: USER_JOBS_ENDPOINT, // Kullanıcıya atanmış işleri getiren endpoint
  },
  
  // Özel Alanlar
  CUSTOM: {
    AGENCY: '/acf/v3/agencies',
    AGENCY_BY_ID: (id) => `/acf/v3/agencies/${id}`,
    EMPLOYEE: '/acf/v3/employees',
    EMPLOYEE_BY_ID: (id) => `/acf/v3/employees/${id}`,
  },
  
  POSTS: {
    LIST: `${WP_API_VERSION}/posts`,
    BY_ID: (id) => `${WP_API_VERSION}/posts/${id}`,
  },
};

// API istek zaman aşımı süresi (ms)
export const API_TIMEOUT = 30000; // 30 saniye

// Token önbellek süresi (ms)
export const TOKEN_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 saat 