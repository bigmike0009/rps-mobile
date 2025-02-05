import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Text, useTheme } from 'react-native-paper';
import { FlashingLight } from '../utilities/animations/flashingLight';
import GlowingParticlesScreen from '../utilities/animations/glowingParticles';
import { AuthContext } from './authProvider';

interface OverlayContextProps {
  showLoading: () => void;
  hideLoading: () => void;
  triggerAnimation: (anim: string) => void;
}

const OverlayContext = createContext<OverlayContextProps | undefined>(undefined);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [visibleAnimation, setVisibleAnimation] = useState<string>('');

  

  const authContext = useContext(AuthContext);
  const {playerDataLoading} = authContext!

  //useEffect(()=>{
  //  if (playerDataLoading){
  //    setTimeout(()=>{if (playerDataLoading) showLoading()})
  //  }
  //},[playerDataLoading])


  const showLoading = () => setLoadingVisible(true);
  const hideLoading = () => setLoadingVisible(false);

  const triggerAnimation = (anim: string) => {
    switch (anim) {
      case 'confetti':
        triggerConfetti()
        // code block 1
        break;
      case 'light':
        triggerFlashingLight()
        // code block 2
        break;

      case 'particles':
          triggerParticles()
          // code block 2
          break;
      // ...more cases
      default:
        triggerFlashingLight()

        // default code block
    }
  };


  const triggerFlashingLight = () => {
    setVisibleAnimation('light');
    setTimeout(() => setVisibleAnimation(''), 1000); // Hide after 1s
  };
  const triggerConfetti = () => {
    setVisibleAnimation('confetti');
    setTimeout(() => setVisibleAnimation('confetti'), 7000); // Hide after 1s
  };
  const triggerParticles = () => {
    setVisibleAnimation('particles');
    setTimeout(() => setVisibleAnimation('particles'), 7000); // Hide after 1s
  };

  const explosion = useRef<ConfettiCannon | null>(null); // Create a ref for the confetti
  const theme = useTheme();

  return (
    <OverlayContext.Provider
      value={{
        showLoading,
        hideLoading,
        triggerAnimation
      }}
    >
      {children}
      {/* Render global overlays */}
      {loadingVisible && (
        <View style={[styles.overlay, styles.loading]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {visibleAnimation === 'particles' && <GlowingParticlesScreen />}
      {visibleAnimation === 'light' && <FlashingLight />}
      {visibleAnimation === 'confetti' &&  <ConfettiCannon
        count={500}
        origin={{ x: -10, y: 0 }}
        autoStart={true} // Don't start automatically
        ref={explosion}   // Attach the ref to the confetti cannon
        fallSpeed={5000}
        colors={[theme.colors.primary, theme.colors.tertiary, "#FFBF00"]}
        fadeOut={true}


      />}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  loading: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
