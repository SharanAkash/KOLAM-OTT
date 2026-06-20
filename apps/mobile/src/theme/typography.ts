import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
    fontWeight: '700',
  },
  displayLgMobile: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  headlineMd: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  labelSm: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontWeight: '600',
  },
};
