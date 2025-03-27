import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../theme/theme';
import styles from './JobCard.style';

export interface Job {
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

interface JobCardProps {
  item: Job;
  isUserJob?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  item, 
  isUserJob = true, 
  onEdit, 
  onDelete 
}) => {
  if (isUserJob) {
    // Kullanıcının kendi işleri
    return (
      <LinearGradient 
        colors={[COLORS.tertiary, COLORS.secondary]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}} 
        style={styles.modernJobCard}
      >
        <View style={styles.jobCardContent}>
          <View style={styles.jobCardHeader}>
            <Text style={styles.modernJobTitle}>{item.group_name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {item.delete_request ? 'Silme Talebi Gönderildi' : 'Aktif'}
              </Text>
            </View>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="calendar-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Tarihler: </Text>
              {item.start_date} - {item.end_date}
            </Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="business-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Otel: </Text>
              {item.hotel_name}
            </Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="bed-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Konaklama: </Text>
              {item.accommodation}
            </Text>
          </View>
          
          {item.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{item.note}</Text>
            </View>
          ) : null}
          
          {!item.delete_request && onEdit && onDelete && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onEdit(item)}
              >
                <View style={styles.actionButtonGradient}>
                  <Icon name="create-outline" size={18} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Düzenle</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onDelete(item.id)}
              >
                <View style={styles.deleteButtonGradient}>
                  <Icon name="trash-outline" size={18} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Sil</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    );
  } else {
    // Acenta işleri
    return (
      <LinearGradient 
        colors={[COLORS.tertiary, COLORS.primary]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}} 
        style={styles.modernJobCard}
      >
        <View style={styles.jobCardContent}>
          <View style={styles.jobCardHeader}>
            <Text style={styles.modernJobTitle}>{item.group_name}</Text>
            <View style={[styles.creatorBadge]}>
              <Text style={styles.creatorName}>{item.creator_name || 'Bilinmeyen'}</Text>
            </View>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="calendar-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Tarihler: </Text>
              {item.start_date} - {item.end_date}
            </Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="business-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Otel: </Text>
              {item.hotel_name}
            </Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Icon name="bed-outline" size={16} color={COLORS.accent} />
            <Text style={styles.modernJobDetail}>
              <Text style={styles.detailLabel}>Konaklama: </Text>
              {item.accommodation}
            </Text>
          </View>
          
          {item.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{item.note}</Text>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    );
  }
};

export default JobCard; 