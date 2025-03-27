import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

export default StyleSheet.create({
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
}); 