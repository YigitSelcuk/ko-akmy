import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { registerEmployee } from '../../api/auth';
import styles from './Register.style';
import { COLORS } from '../../theme/theme';
import { useToast } from '../../components/Toast';

const Register = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();

  // Form state
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  // Şifreyi değiştirdiğinde gücünü hesapla
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
    validatePasswordMatch();
  }, [password, passwordConfirm]);

  const handleBack = () => {
    navigation.goBack();
  };

  // Şifre gücünü hesaplama
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    // Uzunluk kontrolü
    if (password.length >= 7) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Karakter çeşitliliği kontrolleri
    if (/[0-9]/.test(password)) strength += 1; // Rakam
    if (/[a-z]/.test(password)) strength += 1; // Küçük harf
    if (/[A-Z]/.test(password)) strength += 1; // Büyük harf
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // Özel karakter
    
    return Math.min(5, strength); // 0-5 arası
  };

  // Şifre eşleşme kontrolü
  const validatePasswordMatch = () => {
    if (passwordConfirm === '') {
      setPasswordError('');
      return;
    }
    
    if (password !== passwordConfirm) {
      setPasswordError('Şifreler eşleşmiyor!');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Şifre kurallara uygun mu kontrolü
  const validatePassword = () => {
    // Uzunluk kontrolü
    if (password.length < 7) {
      setPasswordError('Şifre en az 7 karakter olmalıdır!');
      toast.showToast({
        message: 'Şifre en az 7 karakter olmalıdır!',
        type: 'error',
        position: 'top'
      });
      return false;
    }
    
    // Şifre gücü yeterli mi?
    if (passwordStrength < 3) {
      setPasswordError('Şifreniz çok zayıf. Rakam, büyük-küçük harf ve özel karakter kullanın.');
      toast.showToast({
        message: 'Şifreniz çok zayıf. Daha güçlü bir şifre seçin.',
        type: 'error',
        position: 'top'
      });
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    // Şifre kuralları kontrolü
    if (!validatePassword()) {
      return;
    }

    // Şifre eşleşme kontrolü
    if (password !== passwordConfirm) {
      setPasswordError('Şifreler eşleşmiyor!');
      toast.showToast({
        message: 'Şifreler eşleşmiyor!',
        type: 'error',
        position: 'top'
      });
      return;
    }

    // Form validasyonu
    if (!name.trim() || !surname.trim() || !phone.trim() || !email.trim()) {
      toast.showToast({
        message: 'Lütfen tüm zorunlu alanları doldurun',
        type: 'warning',
        position: 'top'
      });
      return;
    }

    try {
      setIsRegistering(true);
      // API isteği yap
      const response = await registerEmployee({
        name: name,
        surname: surname,
        phone: phone,
        email: email,
        password: password
      });
      
      // Başarılı olduğunda mesaj göster
      toast.showToast({
        message: 'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
        type: 'success',
        position: 'top',
        duration: 4000
      });
      
      // Başarılı kayıttan sonra giriş sayfasına dön
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Kayıt işlemi sırasında bir sorun oluştu. Lütfen tekrar deneyin.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.showToast({
        message: errorMessage,
        type: 'error',
        position: 'top',
        duration: 4000
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Şifre gücü göstergesi renkleri
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return COLORS.error;
    if (passwordStrength <= 3) return '#FFA500'; // Turuncu
    return COLORS.success;
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
            <Text style={styles.title}>Yeni Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Hesap oluşturmak için bilgilerinizi doldurun
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Ad <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Adınız"
                placeholderTextColor={COLORS.gray}
                value={name}
                onChangeText={setName}
                editable={!isRegistering}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Soyad <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Soyadınız"
                placeholderTextColor={COLORS.gray}
                value={surname}
                onChangeText={setSurname}
                editable={!isRegistering}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Telefon Numarası <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="05XX XXX XXXX"
                placeholderTextColor={COLORS.gray}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!isRegistering}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>E-posta Adresi <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isRegistering}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Parola <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Şifreniz (en az 7 karakter)"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isRegistering}
              />
              
              {password.length > 0 && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={[
                    styles.passwordStrengthBar, 
                    { 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }
                  ]} />
                  <Text style={styles.passwordStrengthText}>
                    {passwordStrength <= 1 ? 'Çok Zayıf' : 
                     passwordStrength <= 2 ? 'Zayıf' : 
                     passwordStrength <= 3 ? 'Orta' : 
                     passwordStrength <= 4 ? 'İyi' : 'Mükemmel'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Parola Tekrar <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                editable={!isRegistering}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isRegistering && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBack}
              disabled={isRegistering}
            >
              <Text style={styles.loginButtonText}>Zaten hesabınız var mı? Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register; 