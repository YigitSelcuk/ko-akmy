import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useToast } from './ToastManager';
import { COLORS, FONTS } from '../../theme/theme';

const ToastExample = () => {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.showToast({
      message: 'İşlem başarıyla tamamlandı!',
      type: 'success',
    });
  };

  const showErrorToast = () => {
    toast.showToast({
      message: 'Bir hata oluştu, lütfen tekrar deneyin.',
      type: 'error',
    });
  };

  const showWarningToast = () => {
    toast.showToast({
      message: 'Bu işlem geri alınamaz, dikkatli olun!',
      type: 'warning',
    });
  };

  const showInfoToast = () => {
    toast.showToast({
      message: 'Yeni güncellemeler mevcut.',
      type: 'info',
    });
  };

  const showBottomToast = () => {
    toast.showToast({
      message: 'Bu bildirim altta görünür!',
      type: 'info',
      position: 'bottom',
    });
  };

  const showLongToast = () => {
    toast.showToast({
      message: 'Bu bildirim daha uzun süre görünür (7 saniye).',
      type: 'success',
      duration: 7000,
    });
  };

  const showNoIconToast = () => {
    toast.showToast({
      message: 'Bu bildirimde ikon yok.',
      type: 'success',
      showIcon: false,
    });
  };

  const showAuthToast = () => {
    toast.showToast({
      message: 'Kullanıcı girişi başarılı! Hoş geldiniz.',
      type: 'success',
    });
  };

  const showLoginErrorToast = () => {
    toast.showToast({
      message: 'Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.',
      type: 'error',
    });
  };

  const showPasswordResetToast = () => {
    toast.showToast({
      message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.',
      type: 'info',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Toast Bildirimleri</Text>
        <Text style={styles.subtitle}>
          Farklı durumlarda kullanılabilecek toast bildirimleri
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temel Tipler</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.successButton]}
              onPress={showSuccessToast}
            >
              <Text style={styles.buttonText}>Başarılı</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.errorButton]}
              onPress={showErrorToast}
            >
              <Text style={styles.buttonText}>Hata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.warningButton]}
              onPress={showWarningToast}
            >
              <Text style={styles.buttonText}>Uyarı</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.infoButton]}
              onPress={showInfoToast}
            >
              <Text style={styles.buttonText}>Bilgi</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konumlandırma</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.positionButton]}
              onPress={showBottomToast}
            >
              <Text style={styles.buttonText}>Alt Bildirim</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özel Ayarlar</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.customButton]}
              onPress={showLongToast}
            >
              <Text style={styles.buttonText}>Uzun Süre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.customButton]}
              onPress={showNoIconToast}
            >
              <Text style={styles.buttonText}>İkonsuz</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kimlik Doğrulama</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.authButton]}
              onPress={showAuthToast}
            >
              <Text style={styles.buttonText}>Giriş Başarılı</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.authButton]}
              onPress={showLoginErrorToast}
            >
              <Text style={styles.buttonText}>Giriş Hatası</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.authButton]}
              onPress={showPasswordResetToast}
            >
              <Text style={styles.buttonText}>Şifre Sıfırlama</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.lightGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    minWidth: '48%',
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: COLORS.success,
  },
  errorButton: {
    backgroundColor: COLORS.error,
  },
  warningButton: {
    backgroundColor: '#FFC107',
  },
  infoButton: {
    backgroundColor: '#2196F3',
  },
  positionButton: {
    backgroundColor: COLORS.tertiary,
    flex: 1,
  },
  customButton: {
    backgroundColor: COLORS.accent,
    flex: 1,
    marginHorizontal: 4,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  buttonText: {
    ...FONTS.body2,
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default ToastExample; 