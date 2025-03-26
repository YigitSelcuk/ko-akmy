import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getUserData, clearAuth, saveUserData } from '../../api/auth/storage';
import { getUserJobs, createJob, requestJobDeletion, requestJobEdit } from '../../api/jobs';
import { getUserMessages, markMessageAsRead as markAsReadAPI } from '../../api/messages';
import { updateUserInfo, getUserProfile, getAgencyOptions } from '../../api/users';
import styles from './AgencyHome.style';
import { COLORS } from '../../theme/theme';
import { useToast } from '../../components/Toast';

const { width, height } = Dimensions.get('window');

// Kullanıcı veri tipi tanımı
interface UserData {
  token?: string;
  user?: string;
  email?: string;
  id?: string;
  agency?: string;
  firstName?: string;
  lastName?: string;
}

// İş veri tipi tanımı
interface Job {
  id: number;
  group_name: string;
  note: string;
  start_date: string;
  end_date: string;
  hotel_name: string;
  accommodation: string;
  male_outfit: string;
  female_outfit: string;
  delete_request: number;
  creator_name?: string;
  male_hosts?: number;
  female_hosts?: number;
}

// Mesaj veri tipi tanımı
interface Message {
  id: number;
  message_title: string;
  message_content: string;
  created_at: string;
  is_read: boolean;
}

// Host veri tipi tanımı
interface HostData {
  date: string;
  maleHosts: number;
  femaleHosts: number;
}

// Kullanıcı profil tip tanımı
interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  agency: string;
}

// Acenta seçenekleri tip tanımı
interface AgencyOptions {
  hotels: string[];
  accommodations: string[];
  male_outfits: string[];
  female_outfits: string[];
}

// Tab içerikleri için enum
enum TabContent {
  CreateJob = 'CreateJob',
  UpdateInfo = 'UpdateInfo',
  Messages = 'Messages',
  Logout = 'Logout'
}

// ApiError tipini tanımlıyorum
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    }
  }
}

const AgencyHome = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<TabContent>(TabContent.CreateJob);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showErrorInfoModal, setShowErrorInfoModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '' });
  const [refreshing, setRefreshing] = useState(false);
  
  // Form verileri için state'ler
  const [jobName, setJobName] = useState('');
  const [jobNote, setJobNote] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [maleOutfit, setMaleOutfit] = useState('');
  const [femaleOutfit, setFemaleOutfit] = useState('');
  const [hostData, setHostData] = useState<HostData[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [allMaleHosts, setAllMaleHosts] = useState(0);
  const [allFemaleHosts, setAllFemaleHosts] = useState(0);
  
  // Kullanıcı bilgileri güncelleme formları için state'ler
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agency, setAgency] = useState('');
  const [password, setPassword] = useState('');
  
  // API'den gelecek veriler için state'ler
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [agencyJobs, setAgencyJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Hotel ve konuklama seçenekleri
  const hotelOptions = ['Acapulco Resort', 'Arkın', 'Chamada Prestige', 'Concorde B', 'Concorde L', 'Cratos', 'Elexus', 'Kaya Artemis ', 'Limak', 'Lord Palace ', 'Nuhun Gemisi', 'Salamis ', 'Diğer'];
  const accommodationOptions = ['Var', 'Yok'];
  const maleOutfitOptions = ['Takım Elbise', 'Siyah Pantolon-Staff Tişört'];
  const femaleOutfitOptions = ['Siyah Elbise-Topuklu Ayakkabı', 'Siyah Pantolon-Staff Tişört', 'Siyah Etek-Beyaz Gömlek'];
  
  // Düzenleme talebi için state
  const [editMaleHosts, setEditMaleHosts] = useState(0);
  const [editFemaleHosts, setEditFemaleHosts] = useState(0);
  
  // Kullanıcı verilerini ve diğer verileri al
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Kullanıcı verilerini al
        const data = await getUserData();
          const userData = data as UserData;
          setUserData(userData);
          
          // Kullanıcı profil bilgileri
          try {
            const userProfile = await getUserProfile() as UserProfile;
            setFirstName(userProfile.first_name || '');
            setLastName(userProfile.last_name || '');
            setEmail(userProfile.email || '');
            setAgency(userProfile.agency || '');
          } catch (error) {
            toast.showToast({
              message: 'Profil bilgileri yüklenirken hata oluştu',
              type: 'error',
              position: 'top',
            });
          }
          
          // İş verilerini getir
          try {
            const jobsResponse = await getUserJobs() as {user_jobs: Job[], agency_jobs: Job[]};
            setUserJobs(jobsResponse.user_jobs || []);
            setAgencyJobs(jobsResponse.agency_jobs || []);
          } catch (error) {
            toast.showToast({
              message: 'İşler yüklenirken hata oluştu',
              type: 'error',
              position: 'top',
            });
          }
          
          // Mesajları getir
          try {
            const messagesData = await getUserMessages() as Message[];
            setMessages(messagesData);
            
            // Okunmamış mesaj sayısını hesapla
            const unreadCount = messagesData.filter((msg: Message) => !msg.is_read).length;
            setUnreadMessages(unreadCount);
          } catch (error) {
            toast.showToast({
              message: 'Mesajlar yüklenirken hata oluştu',
              type: 'error',
              position: 'top',
            });
          }
          
          // Acenta ve otel seçeneklerini getir
          try {
            const options = await getAgencyOptions() as AgencyOptions;
            
            if (options.hotels && options.hotels.length > 0) {
              hotelOptions.splice(0, hotelOptions.length, ...options.hotels);
            }
            
            if (options.accommodations && options.accommodations.length > 0) {
              accommodationOptions.splice(0, accommodationOptions.length, ...options.accommodations);
            }
            
            if (options.male_outfits && options.male_outfits.length > 0) {
              maleOutfitOptions.splice(0, maleOutfitOptions.length, ...options.male_outfits);
            }
            
            if (options.female_outfits && options.female_outfits.length > 0) {
              femaleOutfitOptions.splice(0, femaleOutfitOptions.length, ...options.female_outfits);
            }
          } catch (error) {
            toast.showToast({
              message: 'Acenta seçenekleri yüklenirken hata oluştu',
              type: 'warning',
              position: 'top',
            });
          }
      } catch (error) {
        toast.showToast({
          message: 'Veriler yüklenirken hata oluştu',
          type: 'error',
          position: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
  
  // İş ve host verileri işleme
  useEffect(() => {
    // Tarih değiştiğinde host verilerini güncelle
    if (startDate && endDate) {
      handleDateChange();
    }
  }, [startDate, endDate]);
  
  // Tarih değişikliği işleme - host veri dizisini oluşturmak için kullanılacak
  const handleDateChange = () => {
    // Boş tarihleri kontrol et
    if (!startDate || !endDate) {
      toast.showToast({
        message: 'Lütfen başlangıç ve bitiş tarihlerini belirleyin',
        type: 'warning',
        position: 'top',
      });
      return;
    }

    // Tarih formatlarını kontrol et
    const dateRegexDash = /^\d{4}-\d{2}-\d{2}$/; // YYYY-AA-GG
    const dateRegexSlash = /^\d{2}\/\d{2}\/\d{4}$/; // GG/AA/YYYY

    let startDateObj, endDateObj;

    try {
      // YYYY-AA-GG formatını kontrol et
      if (dateRegexDash.test(startDate)) {
        startDateObj = new Date(startDate);
      } 
      // GG/AA/YYYY formatını kontrol et
      else if (dateRegexSlash.test(startDate)) {
        const [day, month, year] = startDate.split('/');
        startDateObj = new Date(`${year}-${month}-${day}`);
      } else {
        throw new Error('Geçersiz başlangıç tarihi formatı');
      }

      // YYYY-AA-GG formatını kontrol et
      if (dateRegexDash.test(endDate)) {
        endDateObj = new Date(endDate);
      } 
      // GG/AA/YYYY formatını kontrol et
      else if (dateRegexSlash.test(endDate)) {
        const [day, month, year] = endDate.split('/');
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
        toast.showToast({
          message: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
          type: 'warning',
          position: 'top',
        });
        return;
      }

      // Geçici host veri dizisi oluştur
      const tempHostData = [];
      // Başlangıç tarihinden bitiş tarihine kadar tüm günleri dahil et
      for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
        // GG/AA/YYYY formatında tarih oluştur (veritabanı ile uyumlu)
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        // Eğer tüm günler için genel değerler kullanılmışsa, bunları her gün için ekle
        const maleHosts = allMaleHosts;
        const femaleHosts = allFemaleHosts;
        
        tempHostData.push({
          date: formattedDate,
          maleHosts: maleHosts,
          femaleHosts: femaleHosts
        });
      }

      // Host verilerini güncelle
      setHostData(tempHostData);
      
      // Kullanıcı için bilgilendirme
      if (tempHostData.length > 0) {
        toast.showToast({
          message: `${tempHostData.length} gün için host sayıları ayarlandı`,
          type: 'info',
          position: 'top',
        });
      }
    } catch (error: any) {
      toast.showToast({
        message: `Tarih işleme hatası: ${error.message}`,
        type: 'error',
        position: 'top',
      });
    }
  };
  
  // Toplam host sayılarını ayarla
  const applyHostCounts = (maleCount: number, femaleCount: number) => {
    if (hostData.length === 0) {
      // Eğer hostData henüz oluşturulmadıysa ve tarih bilgisi varsa, handleDateChange'i çağır
      if (startDate && endDate) {
        handleDateChange();
        // Host verilerinin oluşturulması için bir süre bekle
        setTimeout(() => {
          if (hostData.length > 0) {
            applyHostCounts(maleCount, femaleCount);
          } else {
            toast.showToast({
              message: 'Host verileri oluşturulamadı, lütfen tekrar deneyin',
              type: 'warning',
              position: 'top',
            });
          }
        }, 500);
        return;
      }
      
      toast.showToast({
        message: 'Lütfen önce tarih aralığı belirleyin',
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    const updatedHostData = hostData.map(item => ({
      ...item,
      maleHosts: maleCount,
      femaleHosts: femaleCount
    }));
    
    setHostData(updatedHostData);
    
    toast.showToast({
      message: 'Host sayıları tüm günlere uygulandı',
      type: 'success',
      position: 'top',
    });
  };
  
  // İş oluşturma
  const handleCreateJob = () => {
    // Form doğrulama
    const validationErrors = [];
    
    if (!jobName) validationErrors.push('İş adı');
    if (!startDate) validationErrors.push('Başlangıç tarihi');
    if (!endDate) validationErrors.push('Bitiş tarihi');
    if (!hotelName) validationErrors.push('Otel adı');
    if (!accommodation) validationErrors.push('Konaklama');
    if (!maleOutfit) validationErrors.push('Erkek kıyafet');
    if (!femaleOutfit) validationErrors.push('Kadın kıyafet');
    
    if (validationErrors.length > 0) {
      toast.showToast({
        message: `Lütfen eksik alanları doldurun: ${validationErrors.join(', ')}`,
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    // 0000-00-00 formatını kontrol et ve reddet
    if (startDate === '0000-00-00' || endDate === '0000-00-00') {
      toast.showToast({
        message: 'Geçersiz tarih formatı. Lütfen tarihleri GG/AA/YYYY formatında girin.',
        type: 'warning',
        position: 'top',
      });
      console.error('Geçersiz tarih formatı tespit edildi - iş oluşturulamadı', startDate, endDate);
      return;
    }
    
    // Tarih formatı kontrolü ve dönüşümü - çok daha sıkı kontroller yapıyoruz
    let formattedStartDate = startDate;
    let formattedEndDate = endDate;
    
    console.log('Tarih dönüşümü öncesi:', formattedStartDate, formattedEndDate);
    
    // YYYY-MM-DD formatını GG/AA/YYYY formatına dönüştür
    if (formattedStartDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = formattedStartDate.split('-');
      formattedStartDate = `${day}/${month}/${year}`;
      console.log('Başlangıç tarihi dönüştürüldü:', formattedStartDate);
    }
    
    if (formattedEndDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = formattedEndDate.split('-');
      formattedEndDate = `${day}/${month}/${year}`;
      console.log('Bitiş tarihi dönüştürüldü:', formattedEndDate);
    }
    
    // GG/AA/YYYY formatı kontrolü - daha sıkı regex ile
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(formattedStartDate) || !dateRegex.test(formattedEndDate)) {
      toast.showToast({
        message: 'Lütfen tarihleri GG/AA/YYYY formatında girin. Örnek: 15/06/2023',
        type: 'warning',
        position: 'top',
      });
      console.error('Tarih format hatası:', formattedStartDate, formattedEndDate);
      return;
    }
    
    // Tarihlerin mantıksal doğruluğunu kontrol et
    try {
      // GG/AA/YYYY formatını Date nesnesine çevir
      const [startDay, startMonth, startYear] = formattedStartDate.split('/');
      const [endDay, endMonth, endYear] = formattedEndDate.split('/');
      
      const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
      const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);
      
      // Geçerli tarihler mi?
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new Error('Geçersiz tarih değerleri');
      }
      
      // Başlangıç tarihi bitiş tarihinden önce mi?
      if (startDateObj > endDateObj) {
        toast.showToast({
          message: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
          type: 'warning',
          position: 'top',
        });
        return;
      }
      
      console.log('Tarih doğrulaması başarılı. İş oluşturuluyor...');
    } catch (error: any) {
      toast.showToast({
        message: `Tarih doğrulama hatası: ${error.message}`,
        type: 'error',
        position: 'top',
      });
      console.error('Tarih doğrulama hatası:', error);
      return;
    }
    
    const submitJob = async () => {
      try {
        setIsLoading(true);
        
        // API isteği için veri hazırla
        const jobData = {
          group_name: jobName,
          note: jobNote,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          hotel_name: hotelName,
          accommodation: accommodation,
          male_outfit: maleOutfit,
          female_outfit: femaleOutfit,
          male_hosts: Number(allMaleHosts) || 0,
          female_hosts: Number(allFemaleHosts) || 0
        };
        
        console.log('Gönderilen veri:', JSON.stringify(jobData));
        
        // İş oluştur - API çağrısı
        const newJob = await createJob(jobData) as Job;
        
        // İş listesini güncelle
        if (newJob && newJob.id) {
          setUserJobs(prev => [...prev, newJob]);
          
          toast.showToast({
            message: 'İş başarıyla oluşturuldu',
            type: 'success',
            position: 'top',
          });
          
          setShowJobModal(false);
          
          // Formları sıfırla
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
        } else {
          throw new Error('İş oluşturma başarısız');
        }
      } catch (error: any) {
        console.error('İş oluşturma hatası:', error);
        
        let errorMessage = 'İş oluşturulurken hata oluştu';
        
        // Hata bilgilerini analiz et
        if (error.message) {
          errorMessage += ': ' + error.message;
        }
        
        // Sunucu yanıtında hata detaylarını kontrol et
        if (error.response && error.response.data) {
          console.error('Sunucu yanıt detayları:', error.response.data);
          
          // Veritabanı hatasını kontrol et
          if (error.response.data.message && error.response.data.message.includes('database error')) {
            // Veritabanı hatası detaylarını göster
            setErrorDetails({
              title: 'Veritabanı Hatası',
              message: `Sunucu veritabanında bir sorun oluştu. Lütfen sistem yöneticisiyle iletişime geçin. Hata: ${error.response.data.message}`
            });
            setShowErrorInfoModal(true);
            return;
          }
          
          if (error.response.data.message) {
            errorMessage += ' - ' + error.response.data.message;
          }
        }
        
        toast.showToast({
          message: errorMessage,
          type: 'error',
          position: 'top',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    submitJob();
  };
  
  // Kullanıcı bilgilerini güncelleme
  const handleUpdateUserInfo = () => {
    if (!firstName || !lastName) {
      toast.showToast({
        message: 'Lütfen ad ve soyad alanlarını doldurun',
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    const submitUserUpdate = async () => {
      try {
        // API isteği için veri hazırla
        const userUpdateData = {
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName}`,
          password: password || undefined
        };
        
        // Kullanıcı bilgilerini güncelle - Yeni API çağrısı
        await updateUserInfo(userUpdateData);
        
        // Kullanıcı verilerini güncelle
        if (userData) {
          const updatedUserData = {
            ...userData,
            firstName: firstName,
            lastName: lastName,
          };
          
          // AsyncStorage'a kaydet
          await saveUserData(updatedUserData);
          setUserData(updatedUserData);
        }
        
        toast.showToast({
          message: 'Bilgileriniz güncellendi',
          type: 'success',
          position: 'top',
        });
        
        setPassword('');
      } catch (error) {
        toast.showToast({
          message: 'Bilgileriniz güncellenirken hata oluştu',
          type: 'error',
          position: 'top',
        });
      }
    };
    
    submitUserUpdate();
  };
  
  // Mesajı okundu olarak işaretle
  const markMessageAsRead = (messageId: number) => {
    const markAsRead = async () => {
      try {
        // API isteği - Yeni API çağrısı
        await markAsReadAPI(messageId);
        
        // UI güncellemesi
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? {...msg, is_read: true} : msg
          )
        );
        
        // Okunmamış mesaj sayısını güncelle
        const unreadCount = messages.filter(msg => !msg.is_read && msg.id !== messageId).length;
        setUnreadMessages(unreadCount);
        
        toast.showToast({
          message: 'Mesaj okundu olarak işaretlendi',
          type: 'success',
          position: 'top',
        });
      } catch (error) {
        toast.showToast({
          message: 'Mesaj işaretlenirken hata oluştu',
          type: 'error',
          position: 'top',
        });
      }
    };
    
    markAsRead();
  };
  
  // İş düzenleme modalını aç
  const openEditJobModal = (job: Job) => {
    setSelectedJob(job);
    setEditMaleHosts(job.male_hosts || 0);
    setEditFemaleHosts(job.female_hosts || 0);
    setShowEditJobModal(true);
  };
  
  // İş silme talebi
  const requestDeleteJob = (jobId: number) => {
    Alert.alert(
      "İş Silme Talebi",
      "Bu işi silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        { 
          text: "Evet", 
          onPress: () => {
            const deleteJob = async () => {
              try {
                // API isteği - Gerçek API çağrısı
                await requestJobDeletion(jobId);
                
                // UI güncellemesi
                setUserJobs(prev => 
                  prev.map(job => 
                    job.id === jobId ? {...job, delete_request: 1} : job
                  )
                );
                
                toast.showToast({
                  message: 'Silme talebi gönderildi',
                  type: 'success',
                  position: 'top',
                });
              } catch (error) {
                toast.showToast({
                  message: 'Silme talebi gönderilirken hata oluştu',
                  type: 'error',
                  position: 'top',
                });
              }
            };
            
            deleteJob();
          }
        }
      ]
    );
  };
  
  // Düzenleme talebini gönder
  const handleEditJobRequest = async () => {
    if (!selectedJob) return;
    
    try {
      setIsLoading(true);
      
      // API isteği için veri hazırla
      const jobData = {
        group_name: selectedJob.group_name,
        note: selectedJob.note,
        start_date: selectedJob.start_date,
        end_date: selectedJob.end_date,
        hotel_name: selectedJob.hotel_name,
        accommodation: selectedJob.accommodation,
        male_outfit: selectedJob.male_outfit,
        female_outfit: selectedJob.female_outfit,
        male_hosts: Number(editMaleHosts),
        female_hosts: Number(editFemaleHosts)
      };
      
      // Düzenleme talebini gönder
      await requestJobEdit(selectedJob.id, jobData);
      
      toast.showToast({
        message: 'Düzenleme talebi başarıyla gönderildi',
        type: 'success',
        position: 'top',
      });
      
      setShowEditJobModal(false);
    } catch (error) {
      console.error('Düzenleme talebi hatası:', error);
      
      toast.showToast({
        message: `Düzenleme talebi gönderilemedi: ${error.message}`,
        type: 'error',
        position: 'top',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Oturumu kapat
  const handleLogout = async () => {
    try {
      await clearAuth();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };
  
  // Hata detay modalını göster
  const showErrorInfo = (title: string, message: string) => {
    setErrorDetails({ title, message });
    setShowErrorInfoModal(true);
  };
  
  // Yenileme fonksiyonu
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const jobsResponse = await getUserJobs() as {user_jobs: Job[], agency_jobs: Job[]};
      setUserJobs(jobsResponse.user_jobs || []);
      setAgencyJobs(jobsResponse.agency_jobs || []);
      
      const messagesData = await getUserMessages() as any;
      setMessages(messagesData.messages || []);
      setUnreadMessages(messagesData.unread_count || 0);
    } catch (error) {
      toast.showToast({
        message: 'Veri yenilenirken hata oluştu',
        type: 'error',
        position: 'top',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Ana işlev için renderItemForUserJobs
  const renderItemForUserJobs = ({ item }: { item: Job }) => (
    <LinearGradient 
      colors={[COLORS.tertiary, COLORS.secondary]} 
      start={{x: 0, y: 0}} 
      end={{x: 1, y: 1}} 
      style={styles.modernJobCard}
    >
      <View style={styles.jobCardContent}>
        <View style={styles.jobCardHeader}>
          <Text style={styles.modernJobTitle}>{item.group_name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.delete_request ? 'Silme Talebi Gönderildi' : 'Aktif'}
            </Text>
          </View>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="calendar-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Tarihler: </Text>
            {item.start_date} - {item.end_date}
          </Text>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="business-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Otel: </Text>
            {item.hotel_name}
          </Text>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="bed-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Konaklama: </Text>
            {item.accommodation}
          </Text>
        </View>
        
        {item.note ? (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item.note}</Text>
          </View>
        ) : null}
        
        {!item.delete_request && (
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
            style={styles.actionButtonsContainer}
          >
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openEditJobModal(item)}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.actionButtonGradient}
              >
                <Icon name="create-outline" size={18} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Düzenle</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => requestDeleteJob(item.id)}
            >
              <LinearGradient
                colors={[COLORS.error, '#FF7373']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.actionButtonGradient}
              >
                <Icon name="trash-outline" size={18} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Sil</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </LinearGradient>
  );

  // Acenta iş kartı
  const renderItemForAgencyJobs = ({ item }: { item: Job }) => (
    <LinearGradient 
      colors={[COLORS.tertiary, COLORS.primary]} 
      start={{x: 0, y: 0}} 
      end={{x: 1, y: 1}} 
      style={styles.modernJobCard}
    >
      <View style={styles.jobCardContent}>
        <View style={styles.jobCardHeader}>
          <Text style={styles.modernJobTitle}>{item.group_name}</Text>
          <View style={[styles.creatorBadge]}>
            <Text style={styles.creatorName}>{item.creator_name || 'Bilinmeyen'}</Text>
          </View>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="calendar-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Tarihler: </Text>
            {item.start_date} - {item.end_date}
          </Text>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="business-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Otel: </Text>
            {item.hotel_name}
          </Text>
        </View>
        
        <View style={styles.jobDetailRow}>
          <Icon name="bed-outline" size={16} color={COLORS.accent} />
          <Text style={styles.modernJobDetail}>
            <Text style={styles.detailLabel}>Konaklama: </Text>
            {item.accommodation}
          </Text>
        </View>
        
        {item.note ? (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item.note}</Text>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );

  // Mesaj kartı
  const renderMessageItem = ({ item }: { item: Message }) => (
    <LinearGradient 
      colors={item.is_read ? 
        [COLORS.tertiary, COLORS.secondary] : 
        [COLORS.secondary, COLORS.primary]}
      start={{x: 0, y: 0}} 
      end={{x: 1, y: 1}} 
      style={[styles.modernMessageCard, item.is_read ? null : styles.unreadIndicator]}
    >
      <View style={styles.messageCardHeader}>
        <Text style={styles.modernMessageTitle}>{item.message_title}</Text>
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
      
      <Text style={styles.modernMessageContent}>{item.message_content}</Text>
      
      <View style={styles.messageFooter}>
        <Text style={styles.messageDate}>{item.created_at}</Text>
        
        {!item.is_read && (
          <TouchableOpacity 
            style={styles.markReadButton}
            onPress={() => markMessageAsRead(item.id)}
          >
            <Text style={styles.markReadButtonText}>Okundu İşaretle</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.background]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.modernHeader}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.headerTitle}>{userData?.firstName || userData?.user}</Text>
            <Text style={styles.headerAgency}>{userData?.agency}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setSelectedTab(TabContent.UpdateInfo)}
          >
            <Icon name="person-circle" size={40} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Tabs */}
      <View style={styles.modernTabContainer}>
        <TouchableOpacity
          style={[styles.modernTab, selectedTab === TabContent.CreateJob && styles.activeModernTab]}
          onPress={() => setSelectedTab(TabContent.CreateJob)}
        >
          <Icon 
            name="briefcase-outline" 
            size={24} 
            color={selectedTab === TabContent.CreateJob ? COLORS.accent : COLORS.white} 
          />
          <Text style={[styles.modernTabText, selectedTab === TabContent.CreateJob && styles.activeModernTabText]}>
            İşler
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modernTab, selectedTab === TabContent.Messages && styles.activeModernTab]}
          onPress={() => setSelectedTab(TabContent.Messages)}
        >
          <View style={styles.tabIconContainer}>
            <Icon 
              name="mail-outline" 
              size={24} 
              color={selectedTab === TabContent.Messages ? COLORS.accent : COLORS.white} 
            />
            {unreadMessages > 0 && (
              <View style={styles.modernBadge}>
                <Text style={styles.modernBadgeText}>{unreadMessages}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.modernTabText, selectedTab === TabContent.Messages && styles.activeModernTabText]}>
            Mesajlar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modernTab, selectedTab === TabContent.UpdateInfo && styles.activeModernTab]}
          onPress={() => setSelectedTab(TabContent.UpdateInfo)}
        >
          <Icon 
            name="settings-outline" 
            size={24} 
            color={selectedTab === TabContent.UpdateInfo ? COLORS.accent : COLORS.white} 
          />
          <Text style={[styles.modernTabText, selectedTab === TabContent.UpdateInfo && styles.activeModernTabText]}>
            Profil
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modernTab, selectedTab === TabContent.Logout && styles.activeModernTab]}
          onPress={() => handleLogout()}
        >
          <Icon 
            name="log-out-outline" 
            size={24} 
            color={COLORS.error} 
          />
          <Text style={[styles.modernTabText, { color: COLORS.error }]}>
            Çıkış
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View style={styles.modernContent}>
        {selectedTab === TabContent.CreateJob && (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.accent]}
                tintColor={COLORS.accent}
              />
            }
          >
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>İş Yönetimi</Text>
              <TouchableOpacity 
                style={styles.modernCreateButton}
                onPress={() => setShowJobModal(true)}
              >
                <Icon name="add" size={20} color={COLORS.background} />
                <Text style={styles.createButtonText}>Yeni İş</Text>
              </TouchableOpacity>
            </View>
            
            {/* Kullanıcı İşleri */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>İşlerim</Text>
              {userJobs.length > 0 ? (
                <FlatList
                  data={userJobs}
                  renderItem={renderItemForUserJobs}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Icon name="clipboard-outline" size={50} color={COLORS.gray} />
                  <Text style={styles.emptyStateText}>Henüz iş kaydınız bulunmamaktadır</Text>
                </View>
              )}
            </View>
            
            {/* Acenta İşleri */}
            {agencyJobs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acenta İşleri</Text>
                <FlatList
                  data={agencyJobs}
                  renderItem={renderItemForAgencyJobs}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}
          </ScrollView>
        )}
        
        {selectedTab === TabContent.Messages && (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.accent]}
                tintColor={COLORS.accent}
              />
            }
          >
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Mesajlarım</Text>
              {unreadMessages > 0 && (
                <View style={styles.messageSummary}>
                  <Text style={styles.messageSummaryText}>{unreadMessages} okunmamış</Text>
                </View>
              )}
            </View>
            
            {messages.length > 0 ? (
              <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Icon name="mail-outline" size={50} color={COLORS.gray} />
                <Text style={styles.emptyStateText}>Henüz mesajınız bulunmamaktadır</Text>
              </View>
            )}
          </ScrollView>
        )}
        
        {selectedTab === TabContent.UpdateInfo && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Profil Bilgilerim</Text>
            </View>
            
            <View style={styles.modernProfileCard}>
              <View style={styles.profileHeader}>
                <Icon name="person-circle" size={60} color={COLORS.accent} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{firstName} {lastName}</Text>
                  <Text style={styles.profileAgency}>{agency}</Text>
                </View>
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Ad</Text>
                  <TextInput
                    style={styles.modernFormInput}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Adınız"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Soyad</Text>
                  <TextInput
                    style={styles.modernFormInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Soyadınız"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>E-posta</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={email}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Acenta</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={agency}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Şifre</Text>
                  <TextInput
                    style={styles.modernFormInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Şifrenizi değiştirmek için doldurun"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.modernUpdateButton}
                  onPress={handleUpdateUserInfo}
                >
                  <Text style={styles.updateButtonText}>Güncelle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Yeni İş Oluştur Modal */}
      <Modal
        visible={showJobModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJobModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni İş Oluştur</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowJobModal(false)}>
                <Icon name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>İş Adı</Text>
                <Text style={styles.requiredField}>*</Text>
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
                <Text style={styles.requiredField}>*</Text>
              </View>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.modernFormInput}
                  value={startDate}
                  onChangeText={(text) => {
                    // 0000-00-00 formatını reddet
                    if (text === '0000-00-00') {
                      toast.showToast({
                        message: 'Geçersiz tarih formatı. Lütfen GG/AA/YYYY formatında girin.',
                        type: 'warning',
                        position: 'top',
                      });
                      return;
                    }
                    
                    // Tarih formatı kontrolü - sadece geçerli girişlere izin ver
                    if (text && text.length > 0) {
                      // Sadece sayı ve '/' karakterine izin ver
                      if (!/^[0-9\/]*$/.test(text)) {
                        toast.showToast({
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
                        toast.showToast({
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
                <Text style={styles.requiredField}>*</Text>
              </View>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.modernFormInput}
                  value={endDate}
                  onChangeText={(text) => {
                    // 0000-00-00 formatını reddet
                    if (text === '0000-00-00') {
                      toast.showToast({
                        message: 'Geçersiz tarih formatı. Lütfen GG/AA/YYYY formatında girin.',
                        type: 'warning',
                        position: 'top',
                      });
                      return;
                    }
                    
                    // Tarih formatı kontrolü - sadece geçerli girişlere izin ver
                    if (text && text.length > 0) {
                      // Sadece sayı ve '/' karakterine izin ver
                      if (!/^[0-9\/]*$/.test(text)) {
                        toast.showToast({
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
                        toast.showToast({
                          message: 'Geçersiz tarih. Lütfen gerçek bir tarih girin.',
                          type: 'warning',
                          position: 'top',
                        });
                      } else if (startDate && startDate.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(startDate)) {
                        // Başlangıç tarihi de geçerliyse, başlangıç-bitiş mantığını kontrol et
                        const [startDay, startMonth, startYear] = startDate.split('/');
                        const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
                        
                        if (startDateObj > dateObj) {
                          toast.showToast({
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
                <Text style={styles.requiredField}>*</Text>
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
                          applyHostCounts(value, allFemaleHosts);
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
                          applyHostCounts(allMaleHosts, value);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowJobModal(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modernUpdateButton} 
                  onPress={handleCreateJob}
                >
                  <Text style={styles.updateButtonText}>İş Oluştur</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* İş Düzenleme Modalı */}
      <Modal
        visible={showEditJobModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditJobModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İş Düzenleme Talebi</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowEditJobModal(false)}>
                <Icon name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedJob && (
                <>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTextContent}>
                      Bu iş için düzenleme talebi göndermek üzeresiniz. Düzenleme talebiniz yönetici tarafından onaylandıktan sonra güncellenecektir.
                    </Text>
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>İş Adı</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={selectedJob.group_name}
                      editable={false}
                    />
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>Not</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={selectedJob.note}
                      editable={false}
                    />
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>Tarih Aralığı</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={`${selectedJob.start_date} - ${selectedJob.end_date}`}
                      editable={false}
                    />
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>Otel</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={selectedJob.hotel_name}
                      editable={false}
                    />
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>Konaklama</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={selectedJob.accommodation}
                      editable={false}
                    />
                  </View>
                  
                  <View style={styles.modernFormGroup}>
                    <Text style={styles.modernFormLabel}>Kıyafet</Text>
                    <TextInput
                      style={[styles.modernFormInput, styles.disabledInput]}
                      value={`Erkek: ${selectedJob.male_outfit}, Kadın: ${selectedJob.female_outfit}`}
                      editable={false}
                    />
                  </View>
                  
                  {/* Host Sayıları Düzenleme Bölümü */}
                  <View style={styles.hostCountSection}>
                    <Text style={styles.sectionSubtitle}>Host Sayılarını Düzenle</Text>
                    
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
                            value={editMaleHosts.toString()}
                            onChangeText={(text) => {
                              const value = parseInt(text) || 0;
                              setEditMaleHosts(value);
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
                            value={editFemaleHosts.toString()}
                            onChangeText={(text) => {
                              const value = parseInt(text) || 0;
                              setEditFemaleHosts(value);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={() => setShowEditJobModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>İptal</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.modernUpdateButton} 
                      onPress={handleEditJobRequest}
                    >
                      <Text style={styles.updateButtonText}>Güncelle</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Hata Bilgi Modalı */}
      <Modal 
        visible={showErrorInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {maxHeight: undefined, width: width * 0.85}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{errorDetails.title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowErrorInfoModal(false)}>
                <Icon name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={60} color={COLORS.error} style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorDetails.message}</Text>
              
              <TouchableOpacity 
                style={styles.okButton}
                onPress={() => setShowErrorInfoModal(false)}
              >
                <Text style={styles.okButtonText}>Anladım</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AgencyHome;
