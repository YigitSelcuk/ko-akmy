import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

export default StyleSheet.create({
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
}); 