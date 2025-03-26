import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './EmployeeLogin.style';
import { COLORS } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginUser, registerEmployee, forgotPassword } from '../../api/auth';
import { useToast } from '../../components/Toast';

const { height } = Dimensions.get('window');

// Yaygın kelimeler listesi
const COMMON_WORDS = [
  'parola', 'sifre', '123456', 'qwerty', 'password', 'admin', '12345',
  'welcome', 'abc123', '123abc', 'test123', '123test', 'mykocak'
];

// Şifre gücünü hesapla (0-100 arası)
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Uzunluk kontrolü
  if (password.length >= 7) {
    strength += 25;
  } else {
    return 10; // 7 karakterden kısa şifreler için direkt zayıf
  }
  
  // Büyük harf kontrolü
  if (/[A-Z]/.test(password)) {
    strength += 25;
  }
  
  // Sayı kontrolü
  if (/[0-9]/.test(password)) {
    strength += 25;
  }
  
  // Özel karakter kontrolü
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 15;
  }
  
  // Karakter çeşitliliği kontrolü
  if (/^(?!.*(.)\1{2,})/.test(password)) {
    strength += 10;
  }
  
  // Yaygın kelime kontrolü
  const lowerPassword = password.toLowerCase();
  for (const word of COMMON_WORDS) {
    if (lowerPassword.includes(word)) {
      strength -= 25;
      break;
    }
  }
  
  return Math.max(0, Math.min(100, strength));
};

// Şifre gücü seviyesini belirle
const getPasswordStrengthLevel = (strength: number): 'zayıf' | 'orta' | 'güçlü' => {
  if (strength < 40) return 'zayıf';
  if (strength < 70) return 'orta';
  return 'güçlü';
};

// Şifre gücü rengi
const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 40) return '#F44336'; // Kırmızı
  if (strength < 70) return '#FFC107'; // Sarı
  return '#4CAF50'; // Yeşil
};

const EmployeeLogin = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // API istekleri için yükleniyor durum değişkenleri
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    // Form validasyonu
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
      // API isteği yap
      const response = await loginUser(email, password);
      
      toast.showToast({
        message: 'Giriş başarılı! Yönlendiriliyorsunuz...',
        type: 'success',
        position: 'top',
        duration: 2000
      });
      
      // Giriş başarılıysa çalışan ana ekranına yönlendir
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'EmployeeHome' }],
        });
      }, 1000);
    } catch (error) {
      // Hata mesajını kullanıcıya göster
      console.error('Giriş hatası:', error);
      toast.showToast({
        message: 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.',
        type: 'error',
        position: 'top',
        duration: 4000
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
            <Text style={styles.title}>Çalışan Girişi</Text>
            <Text style={styles.subtitle}>Çalışan bilgilerinizi girerek devam edin</Text>
          </View>

          {/* Giriş Formu */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>E-posta Adresi</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

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

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>Hesabınız yok mu? Kayıt Olun</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Kayıt Modal */}
      
    </SafeAreaView>
  );
};

export default EmployeeLogin;
