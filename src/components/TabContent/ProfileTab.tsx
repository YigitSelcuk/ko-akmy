import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/theme';
import styles from './TabContent.style';

interface ProfileTabProps {
  firstName: string;
  lastName: string;
  email: string;
  agency: string;
  password: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onUpdateProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  firstName,
  lastName,
  email,
  agency,
  password,
  onFirstNameChange,
  onLastNameChange,
  onPasswordChange,
  onUpdateProfile
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>Profil Bilgilerim</Text>
      </View>
      
      <View style={styles.modernProfileCard}>
        <View style={styles.profileHeader}>
          <Icon name="person-circle" size={60} color={COLORS.accent} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{firstName} {lastName}</Text>
            <Text style={styles.profileAgency}>{agency}</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.modernFormGroup}>
            <Text style={styles.modernFormLabel}>Ad</Text>
            <TextInput
              style={styles.modernFormInput}
              value={firstName}
              onChangeText={onFirstNameChange}
              placeholder="Adınız"
              placeholderTextColor={COLORS.gray}
            />
          </View>
          
          <View style={styles.modernFormGroup}>
            <Text style={styles.modernFormLabel}>Soyad</Text>
            <TextInput
              style={styles.modernFormInput}
              value={lastName}
              onChangeText={onLastNameChange}
              placeholder="Soyadınız"
              placeholderTextColor={COLORS.gray}
            />
          </View>
          
          <View style={styles.modernFormGroup}>
            <Text style={styles.modernFormLabel}>E-posta</Text>
            <TextInput
              style={[styles.modernFormInput, styles.disabledInput]}
              value={email}
              editable={false}
            />
          </View>
          
          <View style={styles.modernFormGroup}>
            <Text style={styles.modernFormLabel}>Acenta</Text>
            <TextInput
              style={[styles.modernFormInput, styles.disabledInput]}
              value={agency}
              editable={false}
            />
          </View>
          
          <View style={styles.modernFormGroup}>
            <Text style={styles.modernFormLabel}>Şifre</Text>
            <TextInput
              style={styles.modernFormInput}
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Şifrenizi değiştirmek için doldurun"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.modernUpdateButton}
            onPress={onUpdateProfile}
          >
            <Text style={styles.updateButtonText}>Güncelle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileTab; 