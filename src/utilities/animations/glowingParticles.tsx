import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const NUM_PARTICLES = 30;

const generateParticles = () =>
  new Array(NUM_PARTICLES).fill(0).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    startX: Math.random() * width, // Random horizontal position
    startY: Math.random() * height, // Random vertical position
    size: Math.random() * 15 + 10, // Random size between 10-25
    delay: Math.random() * 1000, // Random delay for staggered animation
  }));

const GlowingParticle = ({ startX, startY, size, delay }: any) => {
  const yPos = useSharedValue(startY);
  const opacity = useSharedValue(1);

  useEffect(() => {
    yPos.value = withDelay(
      delay,
      withTiming(startY - height, { duration: 4000, easing: Easing.linear })
    );
    opacity.value = withDelay(
      delay + 2000,
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: yPos.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          width: size,
          height: size,
          backgroundColor: "yellow",
          borderRadius: size / 2,
          shadowColor: "yellow",
          shadowOpacity: 1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
        },
        animatedStyle,
      ]}
    />
  );
};

const GlowingParticlesScreen = () => {
  const particles = generateParticles();

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {particles.map((particle) => (
        <GlowingParticle key={particle.id} {...particle} />
      ))}
    </View>
  );
};

export default GlowingParticlesScreen;
