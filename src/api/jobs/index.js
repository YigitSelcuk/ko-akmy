import api from '..';

/**
 * Kullanıcının kendi işlerini ve acentasının işlerini getir
 * @returns {Promise<Object>} Kullanıcının işleri ve acenta işleri
 */
export const getUserJobs = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.get('/agency/v1/jobs');
    
    if (!response.data) {
      throw new Error('İş verileri boş geldi');
    }
    
    return {
      user_jobs: response.data.user_jobs || [],
      agency_jobs: response.data.agency_jobs || []
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Kullanıcının acentesine ait tüm işleri getir
 * @returns {Promise<Array>} İş listesi
 */
export const getAgencyJobs = async () => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.get('/agency/v1/jobs');
    
    // Sadece agency_jobs'ı döndür
    return response.data.agency_jobs || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Yeni iş oluştur
 * @param {Object} jobData - İş verileri
 * @returns {Promise<Object>} Oluşturulan iş
 */
export const createJob = async (jobData) => {
  try {
    // Başlangıç ve bitiş tarihlerini GG/AA/YYYY formatına dönüştür
    let start_date = jobData.start_date;
    let end_date = jobData.end_date;
    
    // Konsola gelen tarihleri yazdır
    console.log('createJob fonksiyonu - İstekten gelen tarihler:', start_date, end_date);
    
    // 0000-00-00 formatı kontrolü - bu formatta gelmesi durumunda hata fırlat
    if (start_date === '0000-00-00' || end_date === '0000-00-00') {
      console.error('Geçersiz tarih formatı tespit edildi:', start_date, end_date);
      throw new Error('Geçersiz tarih formatı. Tarihler GG/AA/YYYY formatında olmalıdır.');
    }
    
    // Boş veya undefined tarih kontrolü
    if (!start_date || !end_date) {
      console.error('Tarih alanı eksik veya boş:', start_date, end_date);
      throw new Error('Başlangıç ve bitiş tarihleri boş olamaz.');
    }
    
    // YYYY-MM-DD formatını kontrol et ve DD/MM/YYYY formatına dönüştür
    if (start_date && start_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = start_date.split('-');
      start_date = `${parts[2]}/${parts[1]}/${parts[0]}`;
      console.log('Başlangıç tarihi dönüştürüldü:', start_date);
    }
    
    if (end_date && end_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = end_date.split('-');
      end_date = `${parts[2]}/${parts[1]}/${parts[0]}`;
      console.log('Bitiş tarihi dönüştürüldü:', end_date);
    }
    
    // GG/AA/YYYY formatı kontrolü - tarih doğrulama
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      console.error('Tarih formatı geçersiz:', start_date, end_date);
      throw new Error('Tarih formatı geçersiz. Tarihler GG/AA/YYYY formatında olmalıdır. Örnek: 15/06/2023');
    }
    
    // API'ye gönderilecek verileri wpn2_jobs tablosuna uygun formatta hazırla
    const requestData = {
      group_name: jobData.group_name,
      note: jobData.note || '',
      start_date: start_date,
      end_date: end_date,
      hotel_name: jobData.hotel_name,
      accommodation: jobData.accommodation,
      male_outfit: jobData.male_outfit,
      female_outfit: jobData.female_outfit,
      male_hosts: Number(jobData.male_hosts) || 0,
      female_hosts: Number(jobData.female_hosts) || 0
    };
    
    console.log('API isteği: ', JSON.stringify(requestData));
    
    // Yeni Agency API endpoint'ini kullan
    const response = await api.post('/agency/v1/jobs/create', requestData);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'İş oluşturma başarısız');
    }
    
    return {
      id: response.data.job_id,
      ...requestData
    };
  } catch (error) {
    console.error('API hatası:', error);
    // Daha fazla hata detayı için
    if (error.response) {
      console.error('Yanıt verisi:', error.response.data);
      console.error('Durum kodu:', error.response.status);
      
      // Hata mesajını zenginleştir
      if (error.response.data && error.response.data.message) {
        error.message = `[${error.response.status}] ${error.response.data.message}`;
      }
    }
    throw error;
  }
};

/**
 * İş silme talebi gönder
 * @param {number} jobId - İş ID'si
 * @returns {Promise<Object>} Silme talebi sonucu
 */
export const requestJobDeletion = async (jobId) => {
  try {
    // Yeni Agency API endpoint'ini kullan
    const response = await api.delete(`/agency/v1/jobs/delete/${jobId}`);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'İş silme talebi başarısız');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * İş düzenleme talebi gönder
 * @param {number} jobId - İş ID'si
 * @param {Object} jobData - Güncellenecek iş verileri
 * @returns {Promise<Object>} Düzenleme talebi sonucu
 */
export const requestJobEdit = async (jobId, jobData) => {
  try {
    // Başlangıç ve bitiş tarihlerini GG/AA/YYYY formatına dönüştür
    let start_date = jobData.start_date;
    let end_date = jobData.end_date;
    
    // 0000-00-00 formatı kontrolü
    if (start_date === '0000-00-00' || end_date === '0000-00-00') {
      throw new Error('Geçersiz tarih formatı. Tarihler GG/AA/YYYY formatında olmalıdır.');
    }
    
    // YYYY-MM-DD formatını kontrol et ve DD/MM/YYYY formatına dönüştür
    if (start_date && start_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = start_date.split('-');
      start_date = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    if (end_date && end_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = end_date.split('-');
      end_date = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    // GG/AA/YYYY formatı kontrolü - tarih doğrulama
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      throw new Error('Tarih formatı geçersiz. Tarihler GG/AA/YYYY formatında olmalıdır. Örnek: 15/06/2023');
    }
    
    // API'ye gönderilecek verileri hazırla
    const requestData = {
      ...jobData,
      start_date: start_date,
      end_date: end_date,
      male_hosts: Number(jobData.male_hosts) || 0,
      female_hosts: Number(jobData.female_hosts) || 0
    };
    
    // Eski host verisi formatlarını temizle
    if (requestData.host_data) {
      delete requestData.host_data;
    }
    
    if (requestData.host_counts) {
      delete requestData.host_counts;
    }
    
    console.log('Düzenleme talebi verileri:', JSON.stringify(requestData));
    
    // Yeni Agency API endpoint'ini kullan
    const response = await api.post(`/agency/v1/jobs/update/${jobId}`, requestData);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'İş düzenleme talebi başarısız');
    }
    
    return response.data;
  } catch (error) {
    console.error('Düzenleme talebi hatası:', error);
    // Daha fazla hata detayı için
    if (error.response) {
      console.error('Yanıt verisi:', error.response.data);
      console.error('Durum kodu:', error.response.status);
      
      // Hata mesajını zenginleştir
      if (error.response.data && error.response.data.message) {
        error.message = `[${error.response.status}] ${error.response.data.message}`;
      }
    }
    throw error;
  }
}; 