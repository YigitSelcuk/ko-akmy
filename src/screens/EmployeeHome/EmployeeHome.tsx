import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './EmployeeHome.style';
import { COLORS } from '../../theme/theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser, getUserJobs } from '../../api/auth';
import { WORDPRESS_URL } from '../../api/wordpress/config';

// İş verisi için arayüz
interface Job {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  price: number;
  payment_date: string;
  is_paid: boolean;
}

const EmployeeHome = () => {
  const navigation = useNavigation<any>();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Kullanıcı bilgilerini ve işleri yükle
  const loadUserData = async () => {
    try {
      // AsyncStorage'dan kullanıcı bilgilerini ve token'ı al
      const userData = await AsyncStorage.getItem('user_data');
      const token = await AsyncStorage.getItem('auth_token');
      
      console.log("Kullanıcı verisi:", userData);
      console.log("Token:", token);
      
      if (userData && token) {
        const parsedData = JSON.parse(userData);
        console.log("Kullanıcı bilgileri:", parsedData);
        
        // Kullanıcı adını gösterme
        if (parsedData.firstName || parsedData.lastName) {
          setUserName(`${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim());
        } else if (parsedData.user) {
          setUserName(parsedData.user);
        } else {
          setUserName("Kullanıcı");
        }
        
        // JWT token'dan kullanıcı ID'sini al
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            console.log("Token payload:", tokenPayload);
            
            // WordPress token formatında kullanıcı ID'si genellikle data.user.id içinde bulunur
            const userId = tokenPayload.data?.user?.id || parsedData.id;
            console.log("User ID:", userId);
            
            if (userId) {
              // Kullanıcının işlerini yükle
              await loadJobs(userId, token);
              return;
            }
          }
        } catch (tokenError) {
          console.error("Token çözümlenirken hata:", tokenError);
        }
        
        // Token'dan ID alınamazsa, kullanıcı verilerinden almayı dene
        if (parsedData.id) {
          await loadJobs(parsedData.id, token);
        } else {
          console.error("Kullanıcı ID'si bulunamadı");
          // Hata durumunu göster
        }
      } else {
        console.log("Kullanıcı verisi veya token bulunamadı");
        // Kullanıcı verisi yoksa giriş ekranına yönlendir
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcının işlerini WordPress'ten yükle
  const loadJobs = async (userId: string, token: string) => {
    try {
      // Kullanıcı iş verilerini çek
      const response = await getUserJobs(userId, token);
      console.log('Gelen iş verileri:', response);
      
      if (response && response.jobs && Array.isArray(response.jobs)) {
        console.log(`${response.jobs.length} adet iş yüklendi`);
        
        if (response.jobs.length > 0) {
          // Veri formatını kontrol et ve düzelt
          const formattedJobs = response.jobs.map((job: any) => {
            return {
              id: job.id || Math.random().toString(),
              title: job.title || 'İsimsiz İş',
              start_date: job.start_date || '',
              end_date: job.end_date || '',
              price: typeof job.price === 'number' ? job.price : 0,
              payment_date: job.payment_date || '',
              is_paid: job.is_paid === true || job.is_paid === 1
            };
          });
          
          setJobs(formattedJobs);
        } else {
          console.log('İş bulunamadı');
          setJobs([]);
        }
        
        if (typeof response.total_unpaid_amount === 'number') {
          setTotalUnpaidAmount(response.total_unpaid_amount);
        } else {
          setTotalUnpaidAmount(0);
        }
      } else {
        console.log('Geçersiz API yanıtı');
        setJobs([]);
        setTotalUnpaidAmount(0);
      }
    } catch (error) {
      console.error('İşler yüklenirken hata oluştu:', error);
      setJobs([]);
      setTotalUnpaidAmount(0);
    }
  };

  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Yenileme fonksiyonu
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    loadUserData();
  }, []);

  // Modal görünürlüğünü izle
  useEffect(() => {
    console.log('Modal görünürlük durumu:', modalVisible);
    console.log('Seçilen iş:', selectedJob);
  }, [modalVisible, selectedJob]);

  // İş detaylarını gösterme fonksiyonu - useCallback ile performansı iyileştirme
  const showJobDetails = useCallback((job: Job) => {
    console.log('İş detayları gösteriliyor:', job);
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  // Modal kapatma fonksiyonu
  const closeModal = useCallback(() => {
    console.log('Modal kapatılıyor');
    setModalVisible(false);
  }, []);

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // İş öğesi render fonksiyonu
  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.tableRow}
      onPress={() => {
        console.log('Satıra tıklandı:', item.id);
        showJobDetails(item);
      }}
      activeOpacity={0.6}
    >
      <Text style={[styles.tableCell, styles.columnJob]} numberOfLines={2} ellipsizeMode="tail">
        {item.title || 'İsimsiz İş'}
      </Text>
      <Text style={[styles.tableCell, styles.columnDate]} numberOfLines={2} ellipsizeMode="tail">
        {item.start_date ? `${item.start_date}` : 'Tarih Yok'}{item.end_date ? `\n${item.end_date}` : ''}
      </Text>
      <Text style={[styles.tableCell, styles.columnPrice]}>
        {typeof item.price === 'number' ? `${item.price.toLocaleString('tr-TR')}₺` : '0₺'}
      </Text>
      <Text style={[styles.tableCell, styles.columnPaymentDate]} numberOfLines={2} ellipsizeMode="tail">
        {item.payment_date || 'Belirtilmemiş'}
      </Text>
      <Text 
        style={[
          styles.tableCell, 
          styles.columnStatus, 
          item.is_paid ? styles.statusPaid : styles.statusUnpaid
        ]}
      >
        {item.is_paid ? 'Ödendi' : 'Ödenmedi'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İşlerim</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" style={styles.logoutIcon} />
          </TouchableOpacity>
        </View>

        {/* Kullanıcı bilgileri */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Hoş geldiniz,</Text>
          <Text style={styles.userName}>{userName}</Text>
          {totalUnpaidAmount > 0 && (
            <Text style={styles.totalAmount}>
              Toplam Ödenmemiş Alacağınız: {totalUnpaidAmount.toLocaleString('tr-TR')}₺
            </Text>
          )}
        </View>

        {/* İş tablosu */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Tanımlanmış İşleriniz</Text>
          
          {/* Tablo başlığı */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.columnJob]}>İşin Adı</Text>
            <Text style={[styles.tableHeaderText, styles.columnDate]}>Başlangıç{'\n'}Bitiş</Text>
            <Text style={[styles.tableHeaderText, styles.columnPrice]}>Fiyat</Text>
            <Text style={[styles.tableHeaderText, styles.columnPaymentDate]}>Ödeme{'\n'}Tarihi</Text>
            <Text style={[styles.tableHeaderText, styles.columnStatus]}>Ödeme{'\n'}Durumu</Text>
          </View>

          {/* İş listesi */}
          {jobs.length > 0 ? (
            <FlatList
              data={jobs}
              renderItem={renderJobItem}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.accent]}
                  tintColor={COLORS.accent}
                />
              }
            />
          ) : (
            <Text style={styles.noJobsText}>
              Henüz size atanmış bir iş bulunmamaktadır.
            </Text>
          )}
        </View>
      </View>

      {/* İş Detayları Modal */}
      {modalVisible && selectedJob && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
          statusBarTranslucent
        >
          <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={closeModal}
          >
            <TouchableOpacity 
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()} // İçeri tıklandığında kapanmasın
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>İş Detayları</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <Icon name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScroll}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>İş Başlığı:</Text>
                  <Text style={styles.detailValue}>{selectedJob.title || 'İsimsiz İş'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Başlangıç Tarihi:</Text>
                  <Text style={styles.detailValue}>{selectedJob.start_date || 'Belirtilmemiş'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bitiş Tarihi:</Text>
                  <Text style={styles.detailValue}>{selectedJob.end_date || 'Belirtilmemiş'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ücret:</Text>
                  <Text style={styles.detailValue}>
                    {typeof selectedJob.price === 'number' 
                      ? `${selectedJob.price.toLocaleString('tr-TR')}₺` 
                      : '0₺'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ödeme Tarihi:</Text>
                  <Text style={styles.detailValue}>{selectedJob.payment_date || 'Belirtilmemiş'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ödeme Durumu:</Text>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusIndicator,
                      selectedJob.is_paid ? styles.paidIndicator : styles.unpaidIndicator
                    ]} />
                    <Text style={[
                      styles.detailValue,
                      selectedJob.is_paid ? styles.statusPaid : styles.statusUnpaid
                    ]}>
                      {selectedJob.is_paid ? 'Ödendi' : 'Ödenmedi'}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActionContainer}>
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalActionText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default EmployeeHome;