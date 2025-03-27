import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../theme/theme';
import styles from './AppHeader.style';
import { TabContent } from '../../components/TabBar';

interface AppHeaderProps {
  userName: string;
  agency: string;
  onProfilePress: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  userName,
  agency,
  onProfilePress
}) => {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.background]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.modernHeader}
    >
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
          <Text style={styles.headerTitle}>{userName}</Text>
          <Text style={styles.headerAgency}>{agency}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <Icon name="person-circle" size={40} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AppHeader; 