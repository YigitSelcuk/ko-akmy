import axios from 'axios';
import { getToken } from './auth/storage';
import { API_URL, API_TIMEOUT } from './wordpress/config';

// API temel istekleri için yapılandırılmış Axios instance'ı
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT || 30000, // 30 saniye timeout
});

// İstek göndermeden önce token ekleyen interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // İstek URL ve parametrelerini konsola yazdır (geliştirme aşamasında)
      console.log(`API İSTEĞİ: ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
      
      return config;
    } catch (error) {
      console.error('API istek interceptor hatası:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('API istek hatası:', error);
    return Promise.reject(error);
  }
);

// Yanıtları işleyen interceptor
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıt durumunda veriyi konsola yazdır (geliştirme aşamasında)
    console.log(`API YANITI: ${response.status} ${response.config.url}`, {
      data: response.data
    });
    
    return response;
  },
  (error) => {
    // Hata durumunda detaylı bilgi göster
    if (error.response) {
      // Sunucudan yanıt geldi ama hata kodu ile
      console.error('API yanıt hatası:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // İstek yapıldı ama yanıt gelmedi
      console.error('API yanıt alınamadı:', {
        url: error.config?.url,
        request: error.request
      });
    } else {
      // İstek oluşturulurken bir hata oluştu
      console.error('API istek yapılandırma hatası:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 