import api from '..';

/**
 * Kullanıcı bilgilerini güncelle
 * @param {Object} userData - Güncellenecek kullanıcı verileri
 * @returns {Promise<Object>} Güncelleme sonucu
 */
export const updateUserInfo = async (userData) => {
  try {
    // API'ye gönderilecek veriyi hazırla
    const requestData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      display_name: userData.display_name,
      password: userData.password
    };
    
    // Yeni Agency API endpoint'ini kullan
    const response = await api.post('/agency/v1/user/update', requestData);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Kullanıcı bilgileri güncellenemedi');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Kullanıcı profilini getir
 * @returns {Promise<Object>} Kullanıcı profil verisi
 */
export const getUserProfile = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.get('/agency/v1/user/profile');
    
    if (!response.data) {
      throw new Error('Kullanıcı profil verisi boş geldi');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Acenta ve otel seçeneklerini getir
 * @returns {Promise<Object>} Seçenekler
 */
export const getAgencyOptions = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.get('/agency/v1/options');
    
    if (!response.data) {
      throw new Error('Acenta seçenekleri verisi boş geldi');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}; 