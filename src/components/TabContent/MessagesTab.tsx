import React from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/theme';
import styles from './TabContent.style';
import { Message } from '../../components/MessageCard';
import MessageCard from '../../components/MessageCard';

interface MessagesTabProps {
  messages: Message[];
  unreadMessages: number;
  onRefresh: () => void;
  refreshing: boolean;
  onMarkAsRead: (id: number) => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  unreadMessages,
  onRefresh,
  refreshing,
  onMarkAsRead
}) => {
  const renderMessageItem = ({ item }: { item: Message }) => (
    <MessageCard 
      item={item}
      onMarkAsRead={onMarkAsRead}
    />
  );

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.accent]}
          tintColor={COLORS.accent}
        />
      }
    >
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>Mesajlarım</Text>
        {unreadMessages > 0 && (
          <View style={styles.messageSummary}>
            <Text style={styles.messageSummaryText}>{unreadMessages} okunmamış</Text>
          </View>
        )}
      </View>
      
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="mail-outline" size={50} color={COLORS.gray} />
          <Text style={styles.emptyStateText}>Henüz mesajınız bulunmamaktadır</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MessagesTab; 