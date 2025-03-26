import axios from 'axios';
import { saveToken, removeToken, saveUserData, clearAuth } from './storage';
import { API_URL, ENDPOINTS, API_TIMEOUT, WORDPRESS_URL } from '../wordpress/config';

// API isteği için axios instance (baseURL ve yapılandırma düzeltildi)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT || 30000, // 30 saniye timeout
});

// SADECE DEVELOPMENT ORTAMINDA LOG GÖSTER
if (process.env.NODE_ENV === 'development') {
  // Axios instance debug loglama intercept'i
  api.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
}

/**
 * WordPress REST API kullanarak kullanıcı girişi
 * @param {string} email Kullanıcı e-posta adresi
 * @param {string} password Kullanıcı şifresi
 * @returns {Promise} Giriş yanıtı
 */
export const loginUser = async (email, password) => {
  try {
    console.log(`Giriş isteği yapılıyor: ${API_URL}${ENDPOINTS.AUTH.LOGIN}`);
    
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
      username: email, // WordPress'te username veya email kullanılabilir
      password,
    });

    console.log('Giriş API yanıtı:', response.status);
    console.log('Kullanıcı bilgileri:', response.data);

    // Token'ı AsyncStorage'a kaydedin
    if (response.data && response.data.token) {
      // Tokeni kaydet
      await saveToken(response.data.token);
      
      // Kullanıcı ID'sini token'dan çıkar
      let userId = null;
      try {
        const tokenParts = response.data.token.split('.');
        if (tokenParts.length === 3) {
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', tokenPayload);
          userId = tokenPayload.data?.user?.id || null;
        }
      } catch (tokenError) {
        console.error('Token çözümlenirken hata:', tokenError);
      }
      
      // Kullanıcı adı soyadını parçalara ayırma
      const fullName = response.data.user_display_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Kullanıcı bilgilerini kaydet
      const userData = {
        token: response.data.token,
        user: response.data.user_display_name,
        email: response.data.user_email,
        id: userId || response.data.user_id,
        firstName: firstName,
        lastName: lastName
      };
      
      console.log('Kaydedilen kullanıcı bilgileri:', userData);
      await saveUserData(userData);
      
      // API'den kullanıcının profil bilgilerini almak için ek istek
      if (userId) {
        try {
          const userResponse = await api.get(ENDPOINTS.USERS.BY_ID(userId), {
            headers: {
              'Authorization': `Bearer ${response.data.token}`,
            },
          });
          
          // Eğer kullanıcı meta verisi varsa, bunları güncelle
          if (userResponse.data && userResponse.data.first_name && userResponse.data.last_name) {
            userData.firstName = userResponse.data.first_name;
            userData.lastName = userResponse.data.last_name;
            
            // Güncellenmiş bilgilerle userData'yı tekrar kaydet
            await saveUserData(userData);
          }
        } catch (profileError) {
          console.error('Kullanıcı profil bilgileri alınamadı:', profileError);
          // Ana işleve devam etmek için hata fırlatmıyoruz
        }
      } else {
        console.log('Kullanıcı ID bulunamadı, profil bilgileri alınamayacak');
      }
      
      // Kullanıcı bilgilerini döndür
      return userData;
    }
    
    throw new Error('Geçersiz kimlik bilgileri');
  } catch (error) {
    console.error('Giriş hatası detayları:', error);
    
    // Hata detaylarını kontrol et
    if (error.response) {
      console.error('Sunucu yanıtı:', error.response.status, error.response.data);
      // Sunucu yanıtı var ama hata kodu döndü
      const errorMessage = error.response.data?.message || 'Giriş işlemi başarısız oldu';
      throw new Error(errorMessage);
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('İstek yapıldı ancak yanıt alınamadı');
      throw new Error('Sunucuya bağlanılamadı, bağlantınızı kontrol edin');
    }
    
    // Diğer hatalar için orijinal hatayı fırlat
    throw error;
  }
};

/**
 * WordPress REST API kullanarak kullanıcı kaydı
 * @param {Object} userData Kullanıcı verileri
 * @returns {Promise} Kayıt yanıtı
 */
export const registerEmployee = async (userData) => {
  try {
    // Özel WordPress endpoint'ine kullanıcı kaydı isteği
    const response = await api.post(ENDPOINTS.USERS.REGISTER, {
      email: userData.email,
      password: userData.password,
      first_name: userData.name,
      last_name: userData.surname,
      phone: userData.phone,
    });

    return response.data;
  } catch (error) {
    // Daha anlamlı hata mesajları için hata yanıtını kontrol et
    if (error.response) {
      // Sunucu yanıtı var ama hata kodu döndü
      const errorMessage = error.response.data?.message || 'Kayıt işlemi başarısız oldu';
      throw new Error(errorMessage);
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      throw new Error('Sunucuya bağlanılamadı, bağlantınızı kontrol edin');
    }
    // Diğer hatalar için orijinal hatayı fırlat
    throw error;
  }
};

/**
 * WordPress REST API kullanarak şifre sıfırlama
 * @param {string} userLogin Kullanıcı adı veya e-posta adresi
 * @returns {Promise} Şifre sıfırlama yanıtı
 */
export const forgotPassword = async (userLogin) => {
  try {
    // WordPress özel şifre sıfırlama endpoint'ine istek gönder
    console.log(`Şifre sıfırlama isteği yapılıyor: ${API_URL}${ENDPOINTS.AUTH.LOST_PASSWORD}`);
    
    const response = await api.post(ENDPOINTS.AUTH.LOST_PASSWORD, {
      user_login: userLogin, // WordPress'in beklediği parametre adı: user_login
    });

    console.log('Şifre sıfırlama API yanıtı:', response.status);
    
    // Yanıt kontrolü
    if (response && response.data && (response.data.success || response.status === 200)) {
      return {
        success: true,
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
      };
    } else {
      // API yanıt verse bile başarısız olabilir
      throw new Error(response.data?.message || 'Şifre sıfırlama başarısız oldu');
    }
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    
    // Hata nesnesi kontrolü ve daha anlamlı hata mesajı
    if (error.response) {
      // Sunucu yanıtı var ama hata kodu döndü
      throw new Error(
        error.response.data?.message || 
        'Sunucu şifre sıfırlama isteğini kabul etmedi'
      );
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      throw new Error('Sunucudan yanıt alınamadı, bağlantınızı kontrol edin');
    } else {
      // İstek hazırlanırken hata oluştu
      throw error; 
    }
  }
};

/**
 * WordPress sitesinden çıkış yapma
 * @returns {Promise} Çıkış yanıtı
 */
export const logoutUser = async () => {
  try {
    // Tüm kimlik bilgilerini temizle
    await clearAuth();
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Acente girişi için özel endpoint
 * @param {string} agencyName Acente adı
 * @param {string} email E-posta
 * @param {string} password Şifre
 * @returns {Promise} Giriş yanıtı
 */
export const loginAgency = async (agencyName, email, password) => {
  try {
    // Önce normal login işlemi
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
      username: email,
      password,
    });
    
    // Token kontrolü
    if (response.data && response.data.token) {
      // Tokeni kaydet
      await saveToken(response.data.token);
      
      // Kullanıcı bilgilerini al
      const userResponse = await api.get(ENDPOINTS.USERS.ME, {
        headers: {
          'Authorization': `Bearer ${response.data.token}`,
        },
      });
      
      // Kullanıcı bilgilerini kaydet (seçilen acenteyi kullanıcıya atayarak)
      const userData = {
        token: response.data.token,
        user: response.data.user_display_name,
        email: response.data.user_email,
        id: response.data.user_id,
        agency: agencyName, // Seçilen acenteyi kullanıyoruz
      };
      
      await saveUserData(userData);
      return userData;
    }
    
    throw new Error('Geçersiz kimlik bilgileri');
  } catch (error) {
    // Hata detaylarını kontrol et
    if (error.response) {
      // Sunucu yanıtı var ama hata kodu döndü
      const errorMessage = error.response.data?.message || 'Giriş işlemi başarısız oldu';
      throw new Error(errorMessage);
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      throw new Error('Sunucuya bağlanılamadı, bağlantınızı kontrol edin');
    }
    
    // Diğer hatalar için orijinal hatayı fırlat
    throw error;
  }
};

/**
 * Kullanıcıya atanmış işleri getiren fonksiyon
 * @param {string} userId - Kullanıcı ID
 * @param {string} token - JWT token
 * @returns {Promise<{total_unpaid_amount: number, jobs: Array}>} - Toplam ödenmemiş tutar ve iş listesi
 */
export const getUserJobs = async (userId, token) => {
  try {
    console.log('İş verileri isteniyor - Kullanıcı ID:', userId);
    
    // API_URL + endpoint ile doğru URL'yi oluştur
    const url = `${API_URL}${ENDPOINTS.USERS.JOBS}?user_id=${userId}`;
    console.log('API isteği yapılıyor:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API yanıtı başarılı, durum kodu:', response.status);
    console.log('API yanıt içeriği:', JSON.stringify(response.data, null, 2));
    
    // Veri dönüşümü
    let result = response.data;
    
    // Yanıt boşsa veya beklenen formatta değilse varsayılan değer döndür
    if (!result || !result.jobs) {
      console.log('API yanıtı beklenen formatta değil, varsayılan değer döndürülüyor');
      result = {
        total_unpaid_amount: 0,
        jobs: []
      };
    }
    
    return result;
  } catch (error) {
    console.error('İş verileri alınırken hata:', error.message);
    if (error.response) {
      console.error('API yanıtı:', error.response.status, error.response.data);
    }
    // Hata durumunda boş veri döndür
    return {
      total_unpaid_amount: 0,
      jobs: []
    };
  }
}; 