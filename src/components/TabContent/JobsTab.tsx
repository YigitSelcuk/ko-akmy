import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/theme';
import styles from './TabContent.style';
import { Job } from '../../components/JobCard';
import JobCard from '../../components/JobCard';

interface JobsTabProps {
  userJobs: Job[];
  agencyJobs: Job[];
  onCreateJob: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: number) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({
  userJobs,
  agencyJobs,
  onCreateJob,
  onRefresh,
  refreshing,
  onEditJob,
  onDeleteJob
}) => {
  const renderItemForUserJobs = ({ item }: { item: Job }) => (
    <JobCard 
      item={item}
      isUserJob={true}
      onEdit={onEditJob}
      onDelete={onDeleteJob}
    />
  );

  const renderItemForAgencyJobs = ({ item }: { item: Job }) => (
    <JobCard 
      item={item}
      isUserJob={false}
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
        <Text style={styles.contentTitle}>İş Yönetimi</Text>
        <TouchableOpacity 
          style={styles.modernCreateButton}
          onPress={onCreateJob}
        >
          <Icon name="add" size={20} color={COLORS.background} />
          <Text style={styles.createButtonText}>Yeni İş</Text>
        </TouchableOpacity>
      </View>
      
      {/* Kullanıcı İşleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İşlerim</Text>
        {userJobs.length > 0 ? (
          <FlatList
            data={userJobs}
            renderItem={renderItemForUserJobs}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon name="clipboard-outline" size={50} color={COLORS.gray} />
            <Text style={styles.emptyStateText}>Henüz iş kaydınız bulunmamaktadır</Text>
          </View>
        )}
      </View>
      
      {/* Acenta İşleri */}
      {agencyJobs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acenta İşleri</Text>
          <FlatList
            data={agencyJobs}
            renderItem={renderItemForAgencyJobs}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default JobsTab; 