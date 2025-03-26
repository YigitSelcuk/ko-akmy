import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#0C1533', // Daha koyu lacivert
  secondary: '#1E2740', // Koyu mavi
  tertiary: '#2E3854', // Orta mavi
  accent: '#D4AF37', // Altın/Premium aksan rengi
  accentSecondary: '#C8A951', // İkincil altın rengi
  background: '#050A1A', // Çok koyu arka plan
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8D8D8D',
  lightGray: '#D9D9D9',
  error: '#FF4D4F',
  success: '#52C41A',
  transparent: 'transparent',
};

// Font boyutları sabitlenir
const FONT_SIZES = {
  h1: 32,
  h2: 26,
  h3: 22,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
};

export const FONTS = {
  h1: {
    fontFamily: 'Outfit-Bold',
    fontSize: FONT_SIZES.h1,
    lineHeight: 38,
  },
  h2: {
    fontFamily: 'Outfit-Bold',
    fontSize: FONT_SIZES.h2,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'Outfit-Bold',
    fontSize: FONT_SIZES.h3,
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'Outfit-Medium',
    fontSize: FONT_SIZES.h4,
    lineHeight: 24,
  },
  h5: {
    fontFamily: 'Outfit-Medium',
    fontSize: FONT_SIZES.h5,
    lineHeight: 22,
  },
  body1: {
    fontFamily: 'Outfit-Regular',
    fontSize: FONT_SIZES.body1,
    lineHeight: 22,
  },
  body2: {
    fontFamily: 'Outfit-Regular',
    fontSize: FONT_SIZES.body2,
    lineHeight: 20,
  },
  body3: {
    fontFamily: 'Outfit-Regular',
    fontSize: FONT_SIZES.body3,
    lineHeight: 18,
  },
  body4: {
    fontFamily: 'Outfit-Regular',
    fontSize: FONT_SIZES.body4,
    lineHeight: 14,
  },
};

const appTheme = {COLORS, FONTS};

export default appTheme;
