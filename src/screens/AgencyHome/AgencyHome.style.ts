import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // Modern Header
  modernHeader: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 5,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: 5,
  },
  headerAgency: {
    ...FONTS.body2,
    color: COLORS.accent,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modern Tabs
  modernTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modernTab: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  activeModernTab: {
    backgroundColor: COLORS.tertiary,
    elevation: 3,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modernTabText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginTop: 5,
    fontSize: 12,
  },
  activeModernTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  tabIconContainer: {
    position: 'relative',
  },
  modernBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Modern Content
  modernContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
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
  
  // Modern Job Cards
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
  
  // Yeni aksiyon butonları
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
  
  // Eski aksiyon butonları (referans için tutuldu)
  modernJobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modernEditButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 10,
  },
  modernDeleteButton: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  
  // Empty States
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
  
  // Modern Message Cards
  modernMessageCard: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    overflow: 'hidden',
  },
  unreadIndicator: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  messageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modernMessageTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
  },
  modernMessageContent: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 15,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageDate: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  markReadButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  markReadButtonText: {
    ...FONTS.body4,
    color: COLORS.background,
    fontWeight: 'bold',
  },
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
  
  // Modern Profile
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    flex: 1,
    elevation: 3,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  updateButtonText: {
    ...FONTS.h4,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Mevcut stiller - Modal için gerekli olanlar
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: 10,
  },
  tabNavigation: {
    marginVertical: 10,
  },
  tabScrollContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tertiary,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: 5,
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tabContent: {
    paddingBottom: 20,
  },
  createJobButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  createJobButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
  },
  createJobButtonText: {
    ...FONTS.h4,
    color: COLORS.background,
  },
  jobListSection: {
    marginTop: 20,
  },
  jobCard: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: width * 0.45,
  },
  jobTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 10,
  },
  jobDetail: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginBottom: 5,
  },
  jobLabel: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  pendingText: {
    ...FONTS.body4,
    color: COLORS.error,
  },
  noDataText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    marginTop: 10,
  },
  formLabel: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: COLORS.tertiary,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    ...FONTS.h4,
    color: COLORS.background,
  },
  messageGrid: {
    marginTop: 10,
  },
  messageCard: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  readMessage: {
    backgroundColor: COLORS.tertiary,
  },
  unreadMessage: {
    backgroundColor: COLORS.secondary,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.error,
  },
  messageTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 10,
  },
  messageContent: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 10,
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  logoutButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  
  // Modern Modal stilleri
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    width: width * 0.92,
    maxHeight: height * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  modalHeader: {
    backgroundColor: COLORS.tertiary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  
  // Picker stilleri
  pickerContainer: {
    marginBottom: 20,
  },
  pickerItem: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pickerItemSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pickerItemText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  pickerItemTextSelected: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Tarih giriş stilleri
  dateInputContainer: {
    marginBottom: 15,
  },
  dateFormatHint: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: 5,
    marginLeft: 5,
  },
  
  // Gerekli alan işareti
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requiredField: {
    color: COLORS.error,
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  
  // Host sayıları bölümü
  hostCountSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  sectionSubtitle: {
    ...FONTS.h4,
    color: COLORS.accent,
    marginBottom: 15,
  },
  bulkHostInputContainer: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bulkHostTitle: {
    ...FONTS.body3,
    color: COLORS.white,
    marginBottom: 15,
  },
  bulkHostInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bulkHostInputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  bulkHostLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  bulkHostInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    color: COLORS.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  // Buton stilleri
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 50,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    height: 50,
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  
  // Bilgi metni container
  infoTextContainer: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  infoTextContent: {
    ...FONTS.body3,
    color: COLORS.white,
    lineHeight: 20,
  },
  
  // Hata modal stilleri
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 150,
  },
  okButtonText: {
    ...FONTS.body3,
    color: COLORS.background,
    fontWeight: 'bold',
  },
});

