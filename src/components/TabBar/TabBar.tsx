import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/theme';
import styles from './TabBar.style';

// Tab içerikleri için enum
export enum TabContent {
  CreateJob = 'CreateJob',
  UpdateInfo = 'UpdateInfo',
  Messages = 'Messages',
  Logout = 'Logout'
}

interface TabBarProps {
  selectedTab: TabContent;
  onSelectTab: (tab: TabContent) => void;
  unreadMessages: number;
  onLogout: () => void;
}

const TabBar: React.FC<TabBarProps> = ({
  selectedTab,
  onSelectTab,
  unreadMessages,
  onLogout
}) => {
  return (
    <View style={styles.modernTabContainer}>
      <TouchableOpacity
        style={[styles.modernTab, selectedTab === TabContent.CreateJob && styles.activeModernTab]}
        onPress={() => onSelectTab(TabContent.CreateJob)}
      >
        <Icon 
          name="briefcase-outline" 
          size={24} 
          color={selectedTab === TabContent.CreateJob ? COLORS.accent : COLORS.white} 
        />
        <Text style={[styles.modernTabText, selectedTab === TabContent.CreateJob && styles.activeModernTabText]}>
          İşler
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modernTab, selectedTab === TabContent.Messages && styles.activeModernTab]}
        onPress={() => onSelectTab(TabContent.Messages)}
      >
        <View style={styles.tabIconContainer}>
          <Icon 
            name="mail-outline" 
            size={24} 
            color={selectedTab === TabContent.Messages ? COLORS.accent : COLORS.white} 
          />
          {unreadMessages > 0 && (
            <View style={styles.modernBadge}>
              <Text style={styles.modernBadgeText}>{unreadMessages}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.modernTabText, selectedTab === TabContent.Messages && styles.activeModernTabText]}>
          Mesajlar
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modernTab, selectedTab === TabContent.UpdateInfo && styles.activeModernTab]}
        onPress={() => onSelectTab(TabContent.UpdateInfo)}
      >
        <Icon 
          name="settings-outline" 
          size={24} 
          color={selectedTab === TabContent.UpdateInfo ? COLORS.accent : COLORS.white} 
        />
        <Text style={[styles.modernTabText, selectedTab === TabContent.UpdateInfo && styles.activeModernTabText]}>
          Profil
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modernTab, selectedTab === TabContent.Logout && styles.activeModernTab]}
        onPress={onLogout}
      >
        <Icon 
          name="log-out-outline" 
          size={24} 
          color={COLORS.error} 
        />
        <Text style={[styles.modernTabText, { color: COLORS.error }]}>
          Çıkış
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar; 