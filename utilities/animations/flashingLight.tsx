import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface FlashingLightProps {
  duration?: number;
  position?: { x: number; y: number }; // Position for the glow effect
  onComplete?: () => void;
}

export const FlashingLight = ({
  duration = 1000,
  position = { x: 200, y: 400 }, // Default position
  onComplete,
}: FlashingLightProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.8, // Glow reaches max opacity (partially transparent)
        duration: duration / 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.4, // Slightly fades but still visible
        duration: duration / 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, // Fully fades out
        duration: duration / 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.glow,
        {
          opacity,
          left: position.x - 75, // Center the glow around x
          top: position.y - 75, // Center the glow around y
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: 150, // Glow size
    height: 150,
    borderRadius: 75, // Circular glow effect
    backgroundColor: 'rgba(248, 248, 219, 0.8)', // Yellowish glow
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 50, // Creates a soft glow effect
  },
});
