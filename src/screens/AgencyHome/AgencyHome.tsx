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
import JobCard from '../../components/JobCard';
import MessageCard from '../../components/MessageCard';
import { Job as JobType } from '../../components/JobCard';
import { Message as MessageType } from '../../components/MessageCard';
import TabBar, { TabContent as TabContentEnum } from '../../components/TabBar';
import { JobsTab, MessagesTab, ProfileTab } from '../../components/TabContent';
import AppHeader from '../../components/Header';
import { CreateJobModal, EditJobModal, ErrorInfoModal } from '../../components/Modals';
import { ToastType, ToastPosition } from '../../components/Toast/Toast';

// ToastConfig tipini lokalde tanımlayalım
interface ToastConfig {
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
  showIcon?: boolean;
}

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
  const [selectedTab, setSelectedTab] = useState<TabContentEnum>(TabContentEnum.CreateJob);
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
  
  // Yeni iş oluşturma
  const handleCreateJob = (jobData: any) => {
    console.log('Yeni iş oluşturuluyor:', jobData);
    
    // Geçersiz verileri kontrol et
    const requiredFields = [
      'group_name', 'start_date', 'end_date', 'hotel_name', 
      'accommodation', 'male_outfit', 'female_outfit'
    ];
    
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      console.error('Eksik alanlar:', missingFields);
      
      // Kullanıcıya hata bildir
      toast.showToast({
        message: `Eksik bilgiler var: ${missingFields.join(', ')}`,
        type: 'error',
        position: 'top',
      });
      
      return;
    }
    
    // Host verileri kontrolü
    const maleHosts = Number(jobData.male_hosts) || 0;
    const femaleHosts = Number(jobData.female_hosts) || 0;
    
    if (maleHosts === 0 && femaleHosts === 0) {
      toast.showToast({
        message: 'En az bir erkek veya kadın host sayısı belirtmelisiniz',
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    // Formu gönder
    const submitJob = async () => {
      try {
        setIsLoading(true);
        
        // API isteği
        const response = await createJob(jobData);
        
        // Kullanıcı işlerine ekle
        if (response && typeof response === 'object' && 'job' in response) {
          const newJob = response.job as Job;
          setUserJobs(prev => [newJob, ...prev]);
        }
        
        // Formu kapat
        setShowJobModal(false);
        
        // Başarı mesajı
        toast.showToast({
          message: 'İş başarıyla oluşturuldu',
          type: 'success',
          position: 'top',
        });
      } catch (error: any) {
        console.error('İş oluşturma hatası:', error);
        
        // Hata mesajını hazırla
        let errorMessage = 'İş oluşturulurken hata oluştu';
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
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
  const handleEditJobRequest = async (jobId: number, maleHosts: number, femaleHosts: number) => {
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
        male_hosts: maleHosts,
        female_hosts: femaleHosts
      };
      
      // Düzenleme talebini gönder
      await requestJobEdit(jobId, jobData);
      
      toast.showToast({
        message: 'Düzenleme talebi başarıyla gönderildi',
        type: 'success',
        position: 'top',
      });
      
      setShowEditJobModal(false);
    } catch (error: any) {
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
      <AppHeader 
        userName={userData?.firstName || userData?.user || ''}
        agency={userData?.agency || ''}
        onProfilePress={() => setSelectedTab(TabContentEnum.UpdateInfo)}
      />
      
      {/* Tabs */}
      <TabBar 
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        unreadMessages={unreadMessages}
        onLogout={handleLogout}
      />
      
      {/* Content */}
      <View style={styles.modernContent}>
        {selectedTab === TabContentEnum.CreateJob && (
          <JobsTab 
            userJobs={userJobs}
            agencyJobs={agencyJobs}
            onCreateJob={() => setShowJobModal(true)}
                onRefresh={onRefresh}
            refreshing={refreshing}
            onEditJob={openEditJobModal}
            onDeleteJob={requestDeleteJob}
          />
        )}
        
        {selectedTab === TabContentEnum.Messages && (
          <MessagesTab 
            messages={messages}
            unreadMessages={unreadMessages}
                onRefresh={onRefresh}
            refreshing={refreshing}
            onMarkAsRead={markMessageAsRead}
          />
        )}
        
        {selectedTab === TabContentEnum.UpdateInfo && (
          <ProfileTab 
            firstName={firstName}
            lastName={lastName}
            email={email}
            agency={agency}
            password={password}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onPasswordChange={setPassword}
            onUpdateProfile={handleUpdateUserInfo}
          />
        )}
      </View>

      {/* Yeni İş Oluştur Modal */}
      <CreateJobModal 
        isVisible={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSubmit={handleCreateJob}
        hotelOptions={hotelOptions}
        accommodationOptions={accommodationOptions}
        maleOutfitOptions={maleOutfitOptions}
        femaleOutfitOptions={femaleOutfitOptions}
        showToast={toast.showToast}
      />
      
      {/* İş Düzenleme Modalı */}
      <EditJobModal 
        isVisible={showEditJobModal}
        onClose={() => setShowEditJobModal(false)}
        onSubmit={(jobId, maleHosts, femaleHosts) => handleEditJobRequest(jobId, maleHosts, femaleHosts)}
        selectedJob={selectedJob}
        showToast={toast.showToast}
      />
      
      {/* Hata Bilgi Modalı */}
      <ErrorInfoModal 
        isVisible={showErrorInfoModal}
        onClose={() => setShowErrorInfoModal(false)}
        title={errorDetails.title}
        message={errorDetails.message}
      />
    </SafeAreaView>
  );
};

export default AgencyHome;
