import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle
} from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

// Ekran boyutları
const { width } = Dimensions.get('window');

// Toast tipleri
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast pozisyonları
export type ToastPosition = 'top' | 'bottom';

// Toast component için props
interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type,
  position = 'top',
  duration = 3000, // varsayılan gösterim süresi: 3 saniye
  onClose,
  showIcon = true
}) => {
  // Toast'un ekranda görünürlüğünü animasyonla kontrol etmek için
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toast tiplerine göre renk ve ikon seçimi
  const getToastTypeInfo = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: COLORS.success,
          iconName: 'checkmark-circle',
          iconColor: COLORS.white
        };
      case 'error':
        return {
          backgroundColor: COLORS.error,
          iconName: 'alert-circle',
          iconColor: COLORS.white
        };
      case 'warning':
        return {
          backgroundColor: '#FFC107', // Sarı
          iconName: 'warning',
          iconColor: COLORS.white
        };
      case 'info':
        return {
          backgroundColor: '#2196F3', // Mavi
          iconName: 'information-circle',
          iconColor: COLORS.white
        };
      default:
        return {
          backgroundColor: COLORS.success,
          iconName: 'checkmark-circle',
          iconColor: COLORS.white
        };
    }
  };

  // Animasyonu başlat
  const startAnimation = (toValue: number, callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(callback);
  };

  // isVisible state'ini güncelle - animasyon durumunda değil, sadece görünürlük değiştiğinde
  useLayoutEffect(() => {
    if (visible && !isVisible) {
      setIsVisible(true);
    }
  }, [visible, isVisible]);

  // Toast görünürlüğünü yönet
  useEffect(() => {
    // Görünürlük değiştiğinde
    if (visible) {
      // Önceki zamanlayıcıyı temizle
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Animasyonu başlat
      startAnimation(1);

      // Otomatik kapanma zamanlayıcısı
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    } else if (isVisible) {
      // Toast açıkken kapatılırsa
      hideToast();
    }

    // Temizleme fonksiyonu
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, duration, isVisible]);

  // Toast'u gizleme fonksiyonu
  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Kapanma animasyonunu başlat
    startAnimation(0, () => {
      setIsVisible(false);
      if (onClose) onClose();
    });
  };

  // Toast görünür değilse hiçbir şey render etme
  if (!visible && !isVisible) return null;

  const { backgroundColor, iconName, iconColor } = getToastTypeInfo();

  // Y ekseninde kaydırma animasyonu
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [position === 'top' ? -100 : 100, 0],
  });

  // Opaklık animasyonu
  const opacity = slideAnim;

  // JSX
  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
        position === 'top' ? styles.topPosition : styles.bottomPosition
      ]}
    >
      {showIcon && (
        <Icon name={iconName} size={24} color={iconColor} style={styles.icon} />
      )}
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Icon name="close" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    width: width - 40,
    minHeight: 60,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topPosition: {
    top: 20,
  },
  bottomPosition: {
    bottom: 20,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    ...FONTS.body2,
    color: COLORS.white,
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default Toast; 