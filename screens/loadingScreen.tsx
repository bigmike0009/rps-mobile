import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { useTheme, ProgressBar } from 'react-native-paper';
import { cleverPhrases } from 'utilities/common'; // Assuming your cleverPhrases array is imported from utilities
import { LinearGradient } from 'expo-linear-gradient'; // If you plan to use gradient background
import { theme } from 'components/theme';

const LoadingScreen = () => {
  const [currentPhrase, setCurrentPhrase] = useState(cleverPhrases[0]);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState<string>('');

  const progressInterval = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {

    // Dot animation updating every 500ms
    const dotInterval = setInterval(() => {
      if (dots.length === 3){
        const randomIndex = Math.floor(Math.random() * cleverPhrases.length);
      setCurrentPhrase(cleverPhrases[randomIndex]);
      }
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
      
    }, 500);

    return () => clearInterval(dotInterval);  // Clean up the interval on unmount
  }, []);

  // Simulate loading progress
  useEffect(() => {
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.01;
        if (next >= 1) {
          clearInterval(progressInterval.current!);
          return 1;
        }
        return next;
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assets/loading.jpg')} // Your custom background image
      style={styles.background}
      resizeMode="cover"
    >
      {/* Display Logo at the top center */}
      <View style={styles.overlay}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/Title-logo.png')} // Your logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Loading Bar & Witty Phrase at the bottom center */}
      <View style={styles.bottomContainer}>
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
          {currentPhrase}{dots}
        </Text>
        
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    backgroundColor: 'rgba(0,0,0,0.45)', // Optional overlay over the background image
    padding: 20,
  },
  logoContainer: {
    position: 'absolute',
    top: 100, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  logo: {
    width: 400, // Adjust size as needed
    height: 200, // Adjust size as needed
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50, // Adjust for how far from the bottom you want the elements
    alignItems: 'center',

  },
  loadingText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    margin: 10,
    width: 280
  },
});

export default LoadingScreen;
