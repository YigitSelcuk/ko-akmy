import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../../theme/theme';
import { ToastType, ToastPosition } from '../../components/Toast/Toast';
import styles from './Modals.style';

interface HostData {
  date: string;
  male_hosts: number;
  female_hosts: number;
}

// ToastConfig tipini tanımlayalım
interface ToastConfig {
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
  showIcon?: boolean;
}

interface CreateJobModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (jobData: any) => void;
  hotelOptions: string[];
  accommodationOptions: string[];
  maleOutfitOptions: string[];
  femaleOutfitOptions: string[];
  showToast: (config: ToastConfig) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  hotelOptions,
  accommodationOptions,
  maleOutfitOptions,
  femaleOutfitOptions,
  showToast
}) => {
  // Form değişkenleri
  const [jobName, setJobName] = useState('');
  const [jobNote, setJobNote] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [maleOutfit, setMaleOutfit] = useState('');
  const [femaleOutfit, setFemaleOutfit] = useState('');
  const [hostData, setHostData] = useState<HostData[]>([]);
  const [allMaleHosts, setAllMaleHosts] = useState(0);
  const [allFemaleHosts, setAllFemaleHosts] = useState(0);

  // Modal kapatıldığında formları sıfırla
  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  // Formu sıfırla
  const resetForm = () => {
    setJobName('');
    setJobNote('');
    setStartDate('');
    setEndDate('');
    setHotelName('');
    setAccommodation('');
    setMaleOutfit('');
    setFemaleOutfit('');
    setHostData([]);
    setAllMaleHosts(0);
    setAllFemaleHosts(0);
  };

  // Tarih değişikliği işleme
  const handleDateChange = (callback?: (hostData: HostData[]) => void) => {
    // Boş tarihleri kontrol et
    if (!startDate || !endDate) {
      showToast({
        message: 'Lütfen başlangıç ve bitiş tarihlerini belirleyin',
        type: 'warning',
        position: 'top',
      });
      return;
    }

    // Tüm boşlukları temizle
    const cleanStartDate = startDate.trim();
    const cleanEndDate = endDate.trim();

    // Tarih formatlarını kontrol et
    const dateRegexDash = /^\d{4}-\d{2}-\d{2}$/; // YYYY-AA-GG
    const dateRegexSlash = /^\d{2}\/\d{2}\/\d{4}$/; // GG/AA/YYYY
    const looseRegexSlash = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // daha esnek GG/AA/YYYY format kontrolü

    let startDateObj, endDateObj;
    let formattedStartDate = cleanStartDate;
    let formattedEndDate = cleanEndDate;

    try {
      // Önce esnek format kontrolünden geçer ve düzeltmeyi dene
      if (looseRegexSlash.test(cleanStartDate)) {
        let [day, month, year] = cleanStartDate.split('/');
        // Tek haneli gün ve ayları iki haneli formata dönüştür
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        formattedStartDate = `${day}/${month}/${year}`;
      }
      
      if (looseRegexSlash.test(cleanEndDate)) {
        let [day, month, year] = cleanEndDate.split('/');
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        formattedEndDate = `${day}/${month}/${year}`;
      }

      // Şimdi sıkı format kontrolü yap
      if (dateRegexDash.test(formattedStartDate)) {
        const [year, month, day] = formattedStartDate.split('-');
        startDateObj = new Date(`${year}-${month}-${day}`);
        formattedStartDate = `${day}/${month}/${year}`; // GG/AA/YYYY formatına dönüştür
      } 
      else if (dateRegexSlash.test(formattedStartDate)) {
        const [day, month, year] = formattedStartDate.split('/');
        startDateObj = new Date(`${year}-${month}-${day}`);
      } else {
        throw new Error('Geçersiz başlangıç tarihi formatı');
      }

      if (dateRegexDash.test(formattedEndDate)) {
        const [year, month, day] = formattedEndDate.split('-');
        endDateObj = new Date(`${year}-${month}-${day}`);
        formattedEndDate = `${day}/${month}/${year}`; // GG/AA/YYYY formatına dönüştür
      } 
      else if (dateRegexSlash.test(formattedEndDate)) {
        const [day, month, year] = formattedEndDate.split('/');
        endDateObj = new Date(`${year}-${month}-${day}`);
      } else {
        throw new Error('Geçersiz bitiş tarihi formatı');
      }

      // Tarih nesnelerinin geçerli olup olmadığını kontrol et
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new Error('Geçersiz tarih değerleri');
      }

      // Başlangıç tarihinin bitiş tarihinden önce olduğunu kontrol et
      if (startDateObj > endDateObj) {
        showToast({
          message: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
          type: 'warning',
          position: 'top',
        });
        return;
      }

      // Form alanlarını güncelle - düzeltilmiş formatla
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      // Geçici host veri dizisi oluştur
      const tempHostData: HostData[] = [];
      // Başlangıç tarihinden bitiş tarihine kadar tüm günleri dahil et
      for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
        // GG/AA/YYYY formatında tarih oluştur (veritabanı ile uyumlu)
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        // Eğer tüm günler için genel değerler kullanılmışsa, bunları her gün için ekle
        tempHostData.push({
          date: formattedDate,
          male_hosts: allMaleHosts,
          female_hosts: allFemaleHosts
        });
      }

      // Host verilerini güncelle
      setHostData(tempHostData);
      
      // Callback varsa çağır
      if (callback) {
        callback(tempHostData);
      }
      
      // Kullanıcı için bilgilendirme
      if (tempHostData.length > 0) {
        showToast({
          message: `${tempHostData.length} gün için host sayıları ayarlandı`,
          type: 'info',
          position: 'top',
        });
      }
    } catch (error: any) {
      console.error('Tarih işleme hatası:', error);
      showToast({
        message: `Tarih işleme hatası: ${error.message}`,
        type: 'error',
        position: 'top',
      });
    }
  };

  // Host sayılarını güncelle
  const applyHostCounts = (maleCount: number, femaleCount: number) => {
    if (hostData.length === 0) {
      // Eğer hostData henüz oluşturulmadıysa ve tarih bilgisi varsa, handleDateChange'i çağır
      if (startDate && endDate) {
        console.log('Host verisi oluşturuluyor, tarihler:', startDate, endDate);
        
        // Host verisi oluştur ve oluşturulduktan sonra host sayılarını güncelle
        handleDateChange((newHostData) => {
          console.log('Host verisi oluşturuldu:', newHostData.length, 'gün için');
          
          // Tüm hostData kayıtlarını güncelle
          const updatedHostData = newHostData.map(item => ({
            ...item,
            male_hosts: maleCount,
            female_hosts: femaleCount
          }));
          
          setHostData(updatedHostData);
          
          // Genel değerleri de güncelle
          setAllMaleHosts(maleCount);
          setAllFemaleHosts(femaleCount);
          
          showToast({
            message: 'Host sayıları tüm günlere uygulandı',
            type: 'success',
            position: 'top',
          });
        });
        
        return;
      }
      
      showToast({
        message: 'Lütfen önce tarih aralığı belirleyin',
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    console.log('Host verisi mevcut, doğrudan güncelleniyor:', maleCount, femaleCount);
    
    // Tüm hostData kayıtlarını güncelle
    setHostData(prevData => 
      prevData.map(item => ({
        ...item,
        male_hosts: maleCount,
        female_hosts: femaleCount
      }))
    );
    
    // Genel değerleri de güncelle
    setAllMaleHosts(maleCount);
    setAllFemaleHosts(femaleCount);
    
    showToast({
      message: 'Host sayıları tüm günlere uygulandı',
      type: 'success',
      position: 'top',
    });
  };

  // Formu doğrula ve gönder
  const handleSubmit = () => {
    // Form değerlerini konsola yazdır (hata ayıklama için)
    console.log('Form değerleri:', {
      jobName,
      jobNote,
      startDate,
      endDate,
      hotelName,
      accommodation,
      maleOutfit,
      femaleOutfit,
      allMaleHosts,
      allFemaleHosts,
      hostData: hostData.length,
    });
    
    // ----- YENİ VALİDASYON YAKLAŞIMI -----
    console.log('Validasyon başlıyor...');
    
    // Tüm alanları trim edelim
    const trimmedJobName = jobName.trim();
    const trimmedStartDate = startDate.trim();
    const trimmedEndDate = endDate.trim();
    const trimmedHotelName = hotelName.trim();
    const trimmedAccommodation = accommodation.trim();
    const trimmedMaleOutfit = maleOutfit.trim();
    const trimmedFemaleOutfit = femaleOutfit.trim();
    
    console.log('Trimlenmiş değerler:', {
      trimmedJobName, 
      trimmedStartDate, 
      trimmedEndDate, 
      trimmedHotelName, 
      trimmedAccommodation, 
      trimmedMaleOutfit, 
      trimmedFemaleOutfit
    });
    
    // Her bir alanın validasyon durumunu kontrol et
    const validations = {
      jobName: !!trimmedJobName,
      startDate: !!trimmedStartDate,
      endDate: !!trimmedEndDate,
      hotelName: !!trimmedHotelName,
      accommodation: !!trimmedAccommodation,
      maleOutfit: !!trimmedMaleOutfit,
      femaleOutfit: !!trimmedFemaleOutfit
    };
    
    console.log('Her alan için validasyon sonuçları:', validations);
    
    // Tüm validasyonların geçerli olup olmadığını kontrol et
    const isValid = Object.values(validations).every(value => value === true);
    console.log('Genel validasyon sonucu:', isValid);
    
    // Validasyon hatalarını topla
    const validationErrors = [];
    if (!validations.jobName) validationErrors.push('İş adı');
    if (!validations.startDate) validationErrors.push('Başlangıç tarihi');
    if (!validations.endDate) validationErrors.push('Bitiş tarihi');
    if (!validations.hotelName) validationErrors.push('Otel adı');
    if (!validations.accommodation) validationErrors.push('Konaklama');
    if (!validations.maleOutfit) validationErrors.push('Erkek kıyafet');
    if (!validations.femaleOutfit) validationErrors.push('Kadın kıyafet');
    
    // Hata varsa bildirim göster ve işlemi durdur
    if (!isValid) {
      console.log('Validasyon hataları:', validationErrors);
      showToast({
        message: `Lütfen eksik alanları doldurun: ${validationErrors.join(', ')}`,
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    console.log('Tüm validasyonlar başarılı, form gönderiliyor...');
    
    // Tarih doğrulama
    try {
      // Formatları kontrol et
      let formattedStartDate = trimmedStartDate;
      let formattedEndDate = trimmedEndDate;
      
      // YYYY-MM-DD formatını GG/AA/YYYY formatına dönüştür
      if (formattedStartDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = formattedStartDate.split('-');
        formattedStartDate = `${day}/${month}/${year}`;
      }
      
      if (formattedEndDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = formattedEndDate.split('-');
        formattedEndDate = `${day}/${month}/${year}`;
      }
      
      // GG/AA/YYYY formatı kontrolü için regex
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      
      // Formatlama kontrolü
      if (!dateRegex.test(formattedStartDate)) {
        console.log('Başlangıç tarihi format hatası:', formattedStartDate);
        // Tarih formatını düzeltmeyi dene
        if (formattedStartDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
          const [day, month, year] = formattedStartDate.split('/');
          formattedStartDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          console.log('Düzeltilmiş başlangıç tarihi:', formattedStartDate);
        }
      }
      
      if (!dateRegex.test(formattedEndDate)) {
        console.log('Bitiş tarihi format hatası:', formattedEndDate);
        // Tarih formatını düzeltmeyi dene
        if (formattedEndDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
          const [day, month, year] = formattedEndDate.split('/');
          formattedEndDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          console.log('Düzeltilmiş bitiş tarihi:', formattedEndDate);
        }
      }
      
      // Düzeltme sonrası tekrar kontrol
      if (!dateRegex.test(formattedStartDate) || !dateRegex.test(formattedEndDate)) {
        console.log('Tarih formatı düzeltme sonrası hala hatalı:', formattedStartDate, formattedEndDate);
        showToast({
          message: 'Lütfen tarihleri GG/AA/YYYY formatında girin. Örnek: 15/06/2023',
          type: 'warning',
          position: 'top',
        });
        return;
      }
      
      // Tarihin mantıksal kontrolü
      const [startDay, startMonth, startYear] = formattedStartDate.split('/');
      const [endDay, endMonth, endYear] = formattedEndDate.split('/');
      
      const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
      const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);
      
      // Geçerli tarihler mi?
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        console.log('Geçersiz tarih nesneleri:', startDateObj, endDateObj);
        throw new Error('Geçersiz tarih değerleri');
      }
      
      // Başlangıç bitiş kontrolü
      if (startDateObj > endDateObj) {
        console.log('Tarih mantık hatası: Başlangıç > Bitiş', startDateObj, endDateObj);
        showToast({
          message: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
          type: 'warning',
          position: 'top',
        });
        return;
      }
      
      console.log('Tarih doğrulamaları başarılı');
      
      // API isteği için veri hazırla
      const jobData = {
        group_name: trimmedJobName,
        note: jobNote.trim(),
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        hotel_name: trimmedHotelName,
        accommodation: trimmedAccommodation,
        male_outfit: trimmedMaleOutfit,
        female_outfit: trimmedFemaleOutfit,
        male_hosts: Number(allMaleHosts) || 0,
        female_hosts: Number(allFemaleHosts) || 0
      };
      
      console.log('Gönderilecek veri:', jobData);
      
      // Ana bileşene gönder
      onSubmit(jobData);
      
    } catch (error: any) {
      console.error('Form gönderimi sırasında hata:', error);
      showToast({
        message: `Hata: ${error.message}`,
        type: 'error',
        position: 'top',
      });
    }
  };

  // Modal içeriği
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni İş Oluştur</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>İş Adı</Text>
            </View>
            <TextInput
              style={[styles.modernFormInput, {marginBottom: 15}]}
              value={jobName}
              onChangeText={setJobName}
              placeholder="İş adını girin"
              placeholderTextColor={COLORS.gray}
            />
            
            <Text style={styles.formLabel}>Not (İsteğe bağlı)</Text>
            <TextInput
              style={[styles.modernFormInput, {height: 80, textAlignVertical: 'top', marginBottom: 15}]}
              value={jobNote}
              onChangeText={setJobNote}
              placeholder="İş ile ilgili notunuzu girin"
              placeholderTextColor={COLORS.gray}
              multiline
            />
            
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Başlangıç Tarihi</Text>
            </View>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.modernFormInput}
                value={startDate}
                onChangeText={(text) => {
                  // 0000-00-00 formatını reddet
                  if (text === '0000-00-00') {
                    showToast({
                      message: 'Geçersiz tarih formatı. Lütfen GG/AA/YYYY formatında girin.',
                      type: 'warning',
                      position: 'top',
                    });
                    return;
                  }
                  
                  // Tüm boşlukları temizle
                  text = text.trim().replace(/\s+/g, '');
                  
                  // Tarih formatı kontrolü - sadece geçerli girişlere izin ver
                  if (text && text.length > 0) {
                    // Sadece sayı ve '/' karakterine izin ver
                    if (!/^[0-9\/]*$/.test(text)) {
                      showToast({
                        message: 'Lütfen sadece sayı ve / karakteri kullanın',
                        type: 'warning',
                        position: 'top',
                      });
                      return;
                    }
                    
                    // Otomatik format ekleme
                    if (text.length === 2 && !text.includes('/') && startDate.length < 2) {
                      text = text + '/';
                    } else if (text.length === 5 && text.indexOf('/', 3) === -1 && startDate.length < 5) {
                      text = text + '/';
                    }
                  }
                  
                  setStartDate(text);
                  
                  // Tarih formatı tamamlandığında otomatik kontrol
                  if (text && text.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
                    // Tarihin geçerli olup olmadığını kontrol et
                    const [day, month, year] = text.split('/');
                    const dateObj = new Date(`${year}-${month}-${day}`);
                    
                    if (isNaN(dateObj.getTime())) {
                      showToast({
                        message: 'Geçersiz tarih. Lütfen gerçek bir tarih girin.',
                        type: 'warning',
                        position: 'top',
                      });
                    }
                  }
                }}
                placeholder="GG/AA/YYYY formatında girin"
                placeholderTextColor={COLORS.gray}
                maxLength={10}
                keyboardType="numeric"
              />
              <Text style={styles.dateFormatHint}>Örnek: 15/10/2023 (Gün/Ay/Yıl)</Text>
            </View>
            
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Bitiş Tarihi</Text>
            </View>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.modernFormInput}
                value={endDate}
                onChangeText={(text) => {
                  // 0000-00-00 formatını reddet
                  if (text === '0000-00-00') {
                    showToast({
                      message: 'Geçersiz tarih formatı. Lütfen GG/AA/YYYY formatında girin.',
                      type: 'warning',
                      position: 'top',
                    });
                    return;
                  }
                  
                  // Tüm boşlukları temizle
                  text = text.trim().replace(/\s+/g, '');
                  
                  // Tarih formatı kontrolü - sadece geçerli girişlere izin ver
                  if (text && text.length > 0) {
                    // Sadece sayı ve '/' karakterine izin ver
                    if (!/^[0-9\/]*$/.test(text)) {
                      showToast({
                        message: 'Lütfen sadece sayı ve / karakteri kullanın',
                        type: 'warning',
                        position: 'top',
                      });
                      return;
                    }
                    
                    // Otomatik format ekleme
                    if (text.length === 2 && !text.includes('/') && endDate.length < 2) {
                      text = text + '/';
                    } else if (text.length === 5 && text.indexOf('/', 3) === -1 && endDate.length < 5) {
                      text = text + '/';
                    }
                  }
                  
                  setEndDate(text);
                  
                  // Tarih formatı tamamlandığında otomatik kontrol
                  if (text && text.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
                    // Tarihin geçerli olup olmadığını kontrol et
                    const [day, month, year] = text.split('/');
                    const dateObj = new Date(`${year}-${month}-${day}`);
                    
                    if (isNaN(dateObj.getTime())) {
                      showToast({
                        message: 'Geçersiz tarih. Lütfen gerçek bir tarih girin.',
                        type: 'warning',
                        position: 'top',
                      });
                    } else if (startDate && startDate.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(startDate)) {
                      // Başlangıç tarihi de geçerliyse, başlangıç-bitiş mantığını kontrol et
                      const [startDay, startMonth, startYear] = startDate.split('/');
                      const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
                      
                      if (startDateObj > dateObj) {
                        showToast({
                          message: 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
                          type: 'warning',
                          position: 'top',
                        });
                      }
                    }
                  }
                }}
                placeholder="GG/AA/YYYY formatında girin"
                placeholderTextColor={COLORS.gray}
                maxLength={10}
                keyboardType="numeric"
              />
              <Text style={styles.dateFormatHint}>Örnek: 20/10/2023 (Gün/Ay/Yıl)</Text>
            </View>
            
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Otel Adı</Text>
            </View>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hotelOptions.map((hotel, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      hotelName === hotel && styles.pickerItemSelected
                    ]}
                    onPress={() => setHotelName(hotel)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      hotelName === hotel && styles.pickerItemTextSelected
                    ]}>
                      {hotel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.formLabel}>Konaklama</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {accommodationOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      accommodation === option && styles.pickerItemSelected
                    ]}
                    onPress={() => setAccommodation(option)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      accommodation === option && styles.pickerItemTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.formLabel}>Erkek Kıyafet Seçimi</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {maleOutfitOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      maleOutfit === option && styles.pickerItemSelected
                    ]}
                    onPress={() => setMaleOutfit(option)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      maleOutfit === option && styles.pickerItemTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.formLabel}>Kadın Kıyafet Seçimi</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {femaleOutfitOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      femaleOutfit === option && styles.pickerItemSelected
                    ]}
                    onPress={() => setFemaleOutfit(option)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      femaleOutfit === option && styles.pickerItemTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Host Sayıları Bölümü */}
            <View style={styles.hostCountSection}>
              <Text style={styles.sectionSubtitle}>Host Sayıları</Text>
              
              <View style={styles.bulkHostInputContainer}>
                <Text style={styles.bulkHostTitle}>Tüm günler için host sayılarını girin:</Text>
                
                <View style={styles.bulkHostInputRow}>
                  <View style={styles.bulkHostInputGroup}>
                    <Text style={styles.bulkHostLabel}>Erkek Host Sayısı:</Text>
                    <TextInput
                      style={styles.bulkHostInput}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={COLORS.gray}
                      value={allMaleHosts ? allMaleHosts.toString() : "0"}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setAllMaleHosts(value);
                        if (startDate && endDate) {
                          applyHostCounts(value, allFemaleHosts);
                        }
                      }}
                    />
                  </View>
                  
                  <View style={styles.bulkHostInputGroup}>
                    <Text style={styles.bulkHostLabel}>Kadın Host Sayısı:</Text>
                    <TextInput
                      style={styles.bulkHostInput}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={COLORS.gray}
                      value={allFemaleHosts ? allFemaleHosts.toString() : "0"}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setAllFemaleHosts(value);
                        if (startDate && endDate) {
                          applyHostCounts(allMaleHosts, value);
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modernUpdateButton}
                onPress={handleSubmit}
              >
                <Text style={styles.updateButtonText}>İş Oluştur</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateJobModal; 