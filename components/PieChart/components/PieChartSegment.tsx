import React from "react";
import { G, Path } from "react-native-svg";
import Animated, {
  createAnimatedPropAdapter,
  processColor,
  SharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const Group = Animated.createAnimatedComponent(G);

type SegmentData = {
  pathData: string;
  centroid: [number, number];
  rotationAngle: number;
  day: any;
};

type PieChartSegmentProps = {
  segment: SegmentData;
  selectedSegmentAnimatedIndex: SharedValue<number>;
  index: number;
  onPress: () => void;
};

const colors = [
  { win:"#FF8C42", lose: "#D19A75" }, //rock

  { win: "#FFF4D4", lose: "#E6D5B8" }, //paper

  { win: "#3A7CA5", lose: "#A2C1D6" }, //scissors






];

export const BarChartSegment: React.FC<PieChartSegmentProps> = ({
  segment,
  selectedSegmentAnimatedIndex,
  index,
  onPress,
}) => {


  const animatedGroupProps = useAnimatedProps(() => ({
    scale: withTiming(selectedSegmentAnimatedIndex.value === index ? 1.05 : 1),
  }));

  const animatedPathProps = useAnimatedProps(() => ({
    fill: processColor(
      selectedSegmentAnimatedIndex.value === index ? colors[index].win : colors[index].lose
    ),
  }));

  return (
    <Group animatedProps={animatedGroupProps}>
      <AnimatedPath
        onPress={onPress}
        d={segment.pathData}
        stroke={"#D2ABC0"}
        animatedProps={animatedPathProps} // Move fill animation here
      />
    </Group>
  );
};
