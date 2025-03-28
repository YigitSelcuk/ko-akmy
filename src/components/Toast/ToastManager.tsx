import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';
import Toast, { ToastType, ToastPosition } from './Toast';

// Toast ayarları için arayüz
interface ToastConfig {
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
  showIcon?: boolean;
}

// Toast Manager için context arayüzü
interface ToastContextProps {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
}

// Context'in varsayılan değerleri
const defaultContext: ToastContextProps = {
  showToast: () => {},
  hideToast: () => {},
};

// Context oluşturuluyor
const ToastContext = createContext<ToastContextProps>(defaultContext);

// Toast Manager Provider bileşeni
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [position, setPosition] = useState<ToastPosition>('top');
  const [duration, setDuration] = useState(3000);
  const [showIcon, setShowIcon] = useState(true);
  
  // Aktif zamanlayıcı referansı
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toast'u gizleme fonksiyonu - memoize edildi
  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  // Toast'u gösterme fonksiyonu - memoize edildi
  const showToast = useCallback((config: ToastConfig) => {
    // Önceki zamanlayıcıyı temizle
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Yeni Toast ayarlarını uygula
    setMessage(config.message);
    setType(config.type);
    setPosition(config.position || 'top');
    setDuration(config.duration || 3000);
    setShowIcon(config.showIcon !== undefined ? config.showIcon : true);
    
    // Görünürlüğü ayarla
    setVisible(true);
  }, []);

  // Zamanlayıcıyı visible değeri değiştiğinde yönet
  useEffect(() => {
    // Eğer toast görünür duruma geldiyse, zamanlayıcıyı başlat
    if (visible) {
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    }
    
    // Temizleme fonksiyonu
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, duration, hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        position={position}
        duration={duration}
        onClose={hideToast}
        showIcon={showIcon}
      />
    </ToastContext.Provider>
  );
};

// Toast kullanımı için custom hook
export const useToast = () => useContext(ToastContext);

// Kısayol fonksiyonları
export const showSuccessToast = (message: string, duration?: number) => {
  const { showToast } = useToast();
  showToast({
    message,
    type: 'success',
    duration,
  });
};

export const showErrorToast = (message: string, duration?: number) => {
  const { showToast } = useToast();
  showToast({
    message,
    type: 'error',
    duration,
  });
};

export const showInfoToast = (message: string, duration?: number) => {
  const { showToast } = useToast();
  showToast({
    message,
    type: 'info',
    duration,
  });
};

export const showWarningToast = (message: string, duration?: number) => {
  const { showToast } = useToast();
  showToast({
    message,
    type: 'warning',
    duration,
  });
}; 