import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../theme/theme';
import styles from './MessageCard.style';

export interface Message {
  id: number;
  message_title: string;
  message_content: string;
  created_at: string;
  is_read: boolean;
}

interface MessageCardProps {
  item: Message;
  onMarkAsRead: (id: number) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ item, onMarkAsRead }) => {
  return (
    <LinearGradient 
      colors={item.is_read ? 
        [COLORS.tertiary, COLORS.secondary] : 
        [COLORS.secondary, COLORS.primary]}
      start={{x: 0, y: 0}} 
      end={{x: 1, y: 1}} 
      style={[styles.modernMessageCard, item.is_read ? null : styles.unreadIndicator]}
    >
      <View style={styles.messageCardHeader}>
        <Text style={styles.modernMessageTitle}>{item.message_title}</Text>
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
      
      <Text style={styles.modernMessageContent}>{item.message_content}</Text>
      
      <View style={styles.messageFooter}>
        <Text style={styles.messageDate}>{item.created_at}</Text>
        
        {!item.is_read && (
          <TouchableOpacity 
            style={styles.markReadButton}
            onPress={() => onMarkAsRead(item.id)}
          >
            <Text style={styles.markReadButtonText}>Okundu İşaretle</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default MessageCard; 