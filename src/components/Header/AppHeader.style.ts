import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme/theme';

export default StyleSheet.create({
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
}); 