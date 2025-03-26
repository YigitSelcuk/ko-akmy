import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './AgencyLogin.style';
import { COLORS } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginAgency } from '../../api/auth';
import { useToast } from '../../components/Toast';

const { height } = Dimensions.get('window');

// WordPress'te tanımlanan gerçek acenta listesi
const agencies = [
  { id: 'cyprus_global', name: 'Cyprus Global' },
  { id: 'dream_of_cyprus', name: 'Dream Of Cyprus' },
  { id: 'gala_cyprus', name: 'Gala Cyprus' },
  { id: 'hiltur_turizm', name: 'Hiltur Turizm' },
  { id: 'maestro_dmc', name: 'Maestro DMC' },
  { id: 'mastercyprus', name: 'Mastercyprus' },
  { id: 'travel_time', name: 'Travel Time' }
];

interface Agency {
  id: string;
  name: string;
}

const AgencyLogin = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Acente listesi filtreleme
  const filteredAgencies = searchQuery
    ? agencies.filter(agency =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : agencies;

  // Acente seçme işlevi
  const selectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowAgencyModal(false);
  };

  // Giriş işlemi
  const handleLogin = async () => {
    // Form validasyonu
    if (!selectedAgency) {
      toast.showToast({
        message: 'Lütfen bir acente seçin',
        type: 'warning',
        position: 'top'
      });
      return;
    }
    
    if (!email.trim()) {
      toast.showToast({
        message: 'Lütfen e-posta adresinizi girin',
        type: 'warning',
        position: 'top'
      });
      return;
    }
    
    if (!password) {
      toast.showToast({
        message: 'Lütfen şifrenizi girin',
        type: 'warning',
        position: 'top'
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      
      // API isteği yap - acente adını gönderiyoruz
      const response = await loginAgency(selectedAgency.name, email, password);
      
      toast.showToast({
        message: 'Giriş başarılı! Yönlendiriliyorsunuz...',
        type: 'success',
        position: 'top',
        duration: 2000
      });
      
      // Giriş başarılıysa ana ekrana yönlendir
      setTimeout(() => {
        navigation.navigate('AgencyHome');
      }, 1000);
    } catch (error) {
      // Hata mesajını kullanıcıya göster
      toast.showToast({
        message: error instanceof Error 
          ? error.message 
          : 'E-posta, şifre veya acente bilgisi hatalı. Lütfen bilgilerinizi kontrol edin.',
        type: 'error',
        position: 'top',
        duration: 4000
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Geri dönme
  const handleBack = () => {
    navigation.goBack();
  };

  // Acente öğesi renderlama
  const renderAgencyItem = ({ item }: { item: Agency }) => {
    const isSelected = selectedAgency && selectedAgency.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.agencyItem, 
          isSelected && styles.selectedAgencyItem
        ]}
        onPress={() => selectAgency(item)}
      >
        <Text style={[
          styles.agencyName, 
          isSelected && styles.selectedAgencyName
        ]}>
          {item.name}
        </Text>
        {isSelected ? (
          <Icon name="checkmark-circle" style={styles.checkIcon} />
        ) : (
          <Icon name="chevron-forward" style={styles.modalCloseIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" style={styles.backIcon} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content}>
          {/* Başlık ve Logo */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Acente Girişi</Text>
            <Text style={styles.subtitle}>Acente bilgilerinizi girerek devam edin</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Acente Seçimi */}
            <Text style={styles.inputLabel}>Acente Seçin:</Text>
            <TouchableOpacity
              style={styles.selectAgencyButton}
              onPress={() => setShowAgencyModal(true)}
              disabled={isLoggingIn}
            >
              <Text style={styles.selectAgencyButtonText}>
                {selectedAgency ? selectedAgency.name : 'Acente Seçiniz'}
              </Text>
              <Icon name="chevron-down" style={styles.agencyIcon} />
            </TouchableOpacity>

            {/* E-posta ve Şifre */}
            <Text style={styles.inputLabel}>E-posta Adresi:</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoggingIn}
            />

            <Text style={styles.inputLabel}>Şifre:</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoggingIn}
            />

            {/* Giriş Butonu */}
            <TouchableOpacity
              style={[styles.loginButton, isLoggingIn && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Acente Seçim Modalı */}
      <Modal
        visible={showAgencyModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowAgencyModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAgencyModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAgencyModal(false)}
                >
                  <Icon name="close" style={styles.modalCloseIcon} />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Acente Seçimi</Text>
                
                {/* Arama Alanı */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="Acente ara..."
                  placeholderTextColor={COLORS.gray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                
                {/* Acente Listesi */}
                {filteredAgencies.length > 0 ? (
                  <FlatList
                    data={filteredAgencies}
                    renderItem={renderAgencyItem}
                    keyExtractor={(item) => item.id}
                    style={{ maxHeight: height * 0.5 }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                  />
                ) : (
                  <Text style={{ color: COLORS.lightGray, textAlign: 'center', marginTop: 20 }}>
                    Aradığınız kriterlere uygun acente bulunamadı.
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default AgencyLogin;
