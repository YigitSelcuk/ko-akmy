import React, { useState } from 'react';
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
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { forgotPassword } from '../../api/auth';
import styles from './ForgotPassword.style';
import { COLORS } from '../../theme/theme';
import { useToast } from '../../components/Toast';

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [userLogin, setUserLogin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleResetPassword = async () => {
    // Kullanıcı adı/email validasyonu
    if (!userLogin.trim()) {
      toast.showToast({
        message: 'Lütfen kullanıcı adınızı veya e-posta adresinizi girin',
        type: 'warning',
        position: 'top'
      });
      return;
    }

    try {
      setIsProcessing(true);
      // API isteği yap
      const response = await forgotPassword(userLogin);
      
      // Başarılı mesajı göster
      toast.showToast({
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        type: 'success',
        position: 'top',
        duration: 4000
      });

      // Başarılı olduğunda giriş sayfasına geri dön
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
      
    } catch (error) {
      // Hata mesajını göster
      let errorMessage = 'Şifre sıfırlama bağlantısı gönderilirken bir sorun oluştu.';
      
      // Eğer belirli bir hata mesajı varsa, onu göster
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
      setIsProcessing(false);
    }
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
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              Şifrenizi mi unuttunuz? Lütfen kullanıcı adınızı veya e-posta adresinizi girin. 
              E-posta adresinize yeni bir şifre oluşturmak için bir bağlantı alacaksınız.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Kullanıcı Adı veya E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adınızı veya e-postanızı girin"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={userLogin}
              onChangeText={setUserLogin}
              editable={!isProcessing}
            />

            <TouchableOpacity
              style={[styles.resetButton, isProcessing && { opacity: 0.7 }]}
              onPress={handleResetPassword}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.resetButtonText}>Şifreyi Sıfırla</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBack}
              disabled={isProcessing}
            >
              <Text style={styles.loginButtonText}>Giriş Sayfasına Dön</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword; 