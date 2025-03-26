import api from '..';

/**
 * Kullanıcının mesajlarını getir
 * @returns {Promise<Object>} Mesaj listesi ve okunmamış mesaj sayısı
 */
export const getUserMessages = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.get('/agency/v1/messages');
    
    if (!response.data) {
      throw new Error('Mesaj verileri boş geldi');
    }
    
    return response.data.messages || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mesajı okundu olarak işaretle
 * @param {number} messageId - Mesaj ID'si
 * @returns {Promise<Object>} İşlem sonucu
 */
export const markMessageAsRead = async (messageId) => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.post(`/agency/v1/messages/read/${messageId}`);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Mesaj işaretleme başarısız');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Okunmamış mesajların sayısını getir
 * @returns {Promise<number>} Okunmamış mesaj sayısı
 */
export const getUnreadMessageCount = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan - aynı mesaj endpoint'inden alınabilir
    const response = await api.get('/agency/v1/messages');
    
    return response.data.unread_count || 0;
  } catch (error) {
    throw error;
  }
}; 