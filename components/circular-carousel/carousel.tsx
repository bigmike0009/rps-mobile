import React from 'react';
import { ImageProps } from 'react-native';
import { CircularCarouselListItem, ListItemWidth } from './list-item';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';

type CircularCarouselProps = {
  data: ImageProps['source'][];
  onCurrentIndexChange?: (index: number) => void;
};

const CircularCarousel: React.FC<CircularCarouselProps> = ({ data, onCurrentIndexChange }) => {
  const contentOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      contentOffset.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.min(Math.round(event.nativeEvent.contentOffset.x / ListItemWidth),data.length-1)
    if (onCurrentIndexChange) {
      onCurrentIndexChange(newIndex);
    }
  };

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      scrollEventThrottle={16} // 60fps -> 16ms (1000ms / 60fps)
      onScroll={scrollHandler}
      onMomentumScrollEnd={handleMomentumScrollEnd} // Updates only when scrolling stops
      pagingEnabled
      snapToInterval={ListItemWidth}
      style={{
        height: 200,
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 1.5 * ListItemWidth,
      }}
      horizontal
      renderItem={({ item, index }) => (
        <CircularCarouselListItem contentOffset={contentOffset} imageSrc={item} index={index} />
      )}
    />
  );
};

export { CircularCarousel };
