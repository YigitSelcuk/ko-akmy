import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Modal temel stilleri
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 15,
    width: width * 0.9,
    maxHeight: height * 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  
  // Form stilleri
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
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  formLabel: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  requiredField: {
    color: COLORS.error,
    marginLeft: 5,
    fontSize: 16,
  },
  modernFormGroup: {
    marginBottom: 15,
  },
  modernFormLabel: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  
  // Tarih seçimi stilleri
  dateInputContainer: {
    marginBottom: 15,
  },
  dateFormatHint: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: 5,
    fontStyle: 'italic',
  },
  
  // Seçici stilleri
  pickerContainer: {
    marginBottom: 15,
  },
  pickerItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
  },
  pickerItemSelected: {
    backgroundColor: COLORS.accent,
  },
  pickerItemText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
  pickerItemTextSelected: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Host sayıları bölümü
  hostCountSection: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 15,
  },
  sectionSubtitle: {
    ...FONTS.h4,
    color: COLORS.accent,
    marginBottom: 15,
  },
  bulkHostInputContainer: {
    marginBottom: 10,
  },
  bulkHostTitle: {
    ...FONTS.body3,
    color: COLORS.white,
    marginBottom: 10,
  },
  bulkHostInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bulkHostInputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  bulkHostLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginBottom: 5,
  },
  bulkHostInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    textAlign: 'center',
  },
  
  // Buton stilleri
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
  },
  modernUpdateButton: {
    flex: 2,
    backgroundColor: COLORS.accent,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    
  },
  updateButtonText: {
    ...FONTS.body2,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Hata modalı stilleri
  infoTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTextContent: {
    ...FONTS.body3,
    color: COLORS.white,
    lineHeight: 22,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 15,
  },
  errorText: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  okButtonText: {
    ...FONTS.body2,
    color: COLORS.background,
    fontWeight: 'bold',
  },
}); 