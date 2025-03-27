import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../../theme/theme';
import { ToastType, ToastPosition } from '../../components/Toast/Toast';
import styles from './Modals.style';

// ToastConfig tipini tanımlayalım
interface ToastConfig {
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
  showIcon?: boolean;
}

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

interface EditJobModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (jobId: number, maleHosts: number, femaleHosts: number) => void;
  selectedJob: Job | null;
  showToast: (config: ToastConfig) => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  selectedJob,
  showToast
}) => {
  const [editMaleHosts, setEditMaleHosts] = useState(0);
  const [editFemaleHosts, setEditFemaleHosts] = useState(0);

  // Seçili iş değiştiğinde host sayılarını güncelle
  useEffect(() => {
    if (selectedJob) {
      setEditMaleHosts(selectedJob.male_hosts || 0);
      setEditFemaleHosts(selectedJob.female_hosts || 0);
    }
  }, [selectedJob]);

  // Formu gönder
  const handleSubmit = () => {
    if (!selectedJob) return;

    // Sayı kontrolü
    const maleHosts = Number(editMaleHosts);
    const femaleHosts = Number(editFemaleHosts);

    if (isNaN(maleHosts) || isNaN(femaleHosts)) {
      showToast({
        message: 'Geçersiz host sayısı.',
        type: 'warning',
        position: 'top',
      });
      return;
    }
    
    // Ana bileşene gönder - burada direkt olarak id'yi geçiyoruz
    onSubmit(selectedJob.id, maleHosts, femaleHosts);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>İş Düzenleme Talebi</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {selectedJob && (
              <>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTextContent}>
                    Bu iş için düzenleme talebi göndermek üzeresiniz. Düzenleme talebiniz yönetici tarafından onaylandıktan sonra güncellenecektir.
                  </Text>
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>İş Adı</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={selectedJob.group_name}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Not</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={selectedJob.note}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Tarih Aralığı</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={`${selectedJob.start_date} - ${selectedJob.end_date}`}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Otel</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={selectedJob.hotel_name}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Konaklama</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={selectedJob.accommodation}
                    editable={false}
                  />
                </View>
                
                <View style={styles.modernFormGroup}>
                  <Text style={styles.modernFormLabel}>Kıyafet</Text>
                  <TextInput
                    style={[styles.modernFormInput, styles.disabledInput]}
                    value={`Erkek: ${selectedJob.male_outfit}, Kadın: ${selectedJob.female_outfit}`}
                    editable={false}
                  />
                </View>
                
                {/* Host Sayıları Düzenleme Bölümü */}
                <View style={styles.hostCountSection}>
                  <Text style={styles.sectionSubtitle}>Host Sayılarını Düzenle</Text>
                  
                  <View style={styles.bulkHostInputContainer}>
                    <Text style={styles.bulkHostTitle}>Tüm günler için host sayılarını girin:</Text>
                    
                    <View style={styles.bulkHostInputRow}>
                      <View style={styles.bulkHostInputGroup}>
                        <Text style={styles.bulkHostLabel}>Erkek Host Sayısı:</Text>
                        <TextInput
                          style={styles.bulkHostInput}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.gray}
                          value={editMaleHosts.toString()}
                          onChangeText={(text) => {
                            const value = parseInt(text) || 0;
                            setEditMaleHosts(value);
                          }}
                        />
                      </View>
                      
                      <View style={styles.bulkHostInputGroup}>
                        <Text style={styles.bulkHostLabel}>Kadın Host Sayısı:</Text>
                        <TextInput
                          style={styles.bulkHostInput}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={COLORS.gray}
                          value={editFemaleHosts.toString()}
                          onChangeText={(text) => {
                            const value = parseInt(text) || 0;
                            setEditFemaleHosts(value);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modernUpdateButton} 
                    onPress={handleSubmit}
                  >
                    <Text style={styles.updateButtonText}>Güncelle</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditJobModal; 