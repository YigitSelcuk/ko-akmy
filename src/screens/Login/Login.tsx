import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import styles from './Login.style';
import { COLORS } from '../../theme/theme';

// RootStackParamList tipi
type RootStackParamList = {
  EmployeeLogin: undefined;
  AgencyLogin: undefined;
};

const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Çalışan girişi fonksiyonu
  const handleEmployeeLogin = () => {
    navigation.navigate('EmployeeLogin');
  };

  // Acente girişi fonksiyonu
  const handleAgencyLogin = () => {
    navigation.navigate('AgencyLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        {/* Logo ve Başlık */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>MyKoçak</Text>
          <Text style={styles.subtitle}>
            İnsan Kaynakları Uygulamasına {"\n"}Hoş Geldiniz
          </Text>

        </View>

        {/* Giriş Butonları */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.employeeButton}
            onPress={handleEmployeeLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Çalışan Girişi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.agencyButton}
            onPress={handleAgencyLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.agencyButtonText}>Acente Girişi</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0</Text>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;