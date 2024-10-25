import { MD3DarkTheme as DarkTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';

const customFonts = {
  regular: {
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'Roboto',
    fontWeight: '300',
  },
  thin: {
    fontFamily: 'Roboto',
    fontWeight: '100',
  },
};

export const theme = {
  ...DarkTheme,
  roundness: 12, // Makes everything rounded for that sleek look
  surfaceDisabled: '#121212',
  pnSurfaceDisabled: '#121212',

  
  colors: {
    ...DarkTheme.colors,
    
    primary: '#00CFFF', // Light blue accent
    // accent: '#FF69B4',  // Light pink accent
    surface: '#002B36', // Dark surface for depth
    background: '#00171F', // Deep dark background
    // text: '#E0E0E0', // Light grey text for contrast
    // error: '#FF4500', // Fluorescent orange for errors
    // onSurface: '#E0E0E0', // Text on dark surfaces
    // notification: '#FF4500', // Same as error, makes it stand out
    // border: '#424242', // Border color for subtle division
  },
  //fonts: configureFonts({ customFonts }),
  elevation: {
    level1: 4,
    level2: 8,
    level3: 12,
    level4: 16,
    level5: 24, // 3D effects with higher elevation levels
  },
  shadows: {
    // Custom shadow for 3D effects
    level1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    level2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
  },
};

export const navigationTheme = {
  ...DefaultTheme,
  
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
    card: '#212121', // Card surfaces will also have a 3D effect
    text: '#E0E0E0',
    border: '#424242',
  },
};
