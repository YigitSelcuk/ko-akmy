import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

export default StyleSheet.create({
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  contentTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  modernCreateButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  createButtonText: {
    ...FONTS.body3,
    color: COLORS.background,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.lightGray,
    marginBottom: 15,
    paddingLeft: 5,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  emptyStateText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: 15,
    textAlign: 'center',
  },
  
  // Mesaj özeti
  messageSummary: {
    backgroundColor: COLORS.error,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  messageSummaryText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  
  // Profil kartı
  modernProfileCard: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  profileAgency: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  formContainer: {
    width: '100%',
  },
  modernFormGroup: {
    marginBottom: 15,
  },
  modernFormLabel: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  modernFormInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  disabledInput: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderColor: 'rgba(255,255,255,0.05)',
    color: COLORS.gray,
  },
  modernUpdateButton: {
    backgroundColor: COLORS.accent,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  updateButtonText: {
    ...FONTS.body2,
    color: COLORS.background,
    fontWeight: 'bold',
  },
}); 