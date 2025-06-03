import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { G, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { BarChartSegment } from "./PieChartSegment";
import { SCREEN_WIDTH } from "../constants/window";
import { generatePieChartSegment } from "../utils/pieChart";

const days = [
  { day: "Rock", value: 50 },
  { day: "Paper", value: 33 },
  { day: "Scissors", value: 20 },
];

// Utility function to format numbers with thousands separator
const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

export const PieChart = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const opacity = useSharedValue(1);

  const selectedSegmentAnimatedIndex = useSharedValue(0);

  const handleOnPress = (index: number) => {
    selectedSegmentAnimatedIndex.value = index; // Update the index immediately
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setSelectedIndex)(index);
      opacity.value = withTiming(1);
    });
  };
  

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Throw Splits</Text>
          </View>
          <Text style={{ color: "#dd6c85" }}>Percentages %</Text>
        </View>
        <Svg width={SCREEN_WIDTH} height={SCREEN_WIDTH}>
          <G x={SCREEN_WIDTH / 2} y={SCREEN_WIDTH / 2}>
            {generatePieChartSegment(days).map((segmentData, index) => {
              return (
                <BarChartSegment
                  onPress={() => handleOnPress(index)}
                  key={index}
                  index={index}
                  segment={segmentData}
                  selectedSegmentAnimatedIndex={selectedSegmentAnimatedIndex}
                />
              );
            })}
            <AnimatedSvgText
              x={0}
              y={-10}
              textAnchor="middle"
              fontSize={24}
              fontWeight="bold"
              fill="#fff"
              animatedProps={animatedTextStyle}
            >
              {days[selectedIndex].day}
            </AnimatedSvgText>
            <AnimatedSvgText
              x={0}
              y={20}
              textAnchor="middle"
              fontSize={18}
              fill="#666"
              animatedProps={animatedTextStyle}
            >
              {days[selectedIndex].value}%
            </AnimatedSvgText>
          </G>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 10,
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
