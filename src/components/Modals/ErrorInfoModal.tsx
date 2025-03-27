import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/theme';
import styles from './Modals.style';

const { width } = Dimensions.get('window');

interface ErrorInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const ErrorInfoModal: React.FC<ErrorInfoModalProps> = ({
  isVisible,
  onClose,
  title,
  message
}) => {
  return (
    <Modal 
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, {maxHeight: undefined, width: width * 0.85}]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={60} color={COLORS.error} style={styles.errorIcon} />
            <Text style={styles.errorText}>{message}</Text>
            
            <TouchableOpacity 
              style={styles.okButton}
              onPress={onClose}
            >
              <Text style={styles.okButtonText}>Anladım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorInfoModal; 