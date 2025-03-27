import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

export default StyleSheet.create({
  modernJobCard: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  jobCardContent: {
    padding: 15,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modernJobTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  creatorBadge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  creatorName: {
    ...FONTS.body4,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modernJobDetail: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginLeft: 8,
  },
  detailLabel: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  noteText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.gray,
  },
  deleteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
}); 