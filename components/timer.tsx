// TimerComponent.tsx
import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAssets } from 'utilities/assetProvider';

interface TimerProps {
  initialTime: number; // in seconds
  onClockExpires: () => void;
}

const TimerComponent: React.FC<TimerProps> = ({ initialTime, onClockExpires }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [expired, setExpired] = useState(false);

  const theme = useTheme()
  const {retrieveAsset} = useAssets()


  useEffect(() => {


    const intervalId = setInterval(() => {
        if (timeLeft > 0 && !expired){
            setTimeLeft((prevTime) => prevTime - 1);
        }
        else{
            console.log('HUHH')
            setExpired(true)
            onClockExpires();

            clearInterval(intervalId)
        }

    }, 1000);
    return () => clearInterval(intervalId);



  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  

  return <ImageBackground source={{ uri: retrieveAsset('alarm_clock_icon_white') }} style={styles.timerBackground} resizeMode="contain">
            <Text style={[styles.timerText, {color: timeLeft > 10 ? theme.colors.onBackground : theme.colors.error}]}>{timeLeft}</Text>
         </ImageBackground>;
};
const styles = StyleSheet.create({
timerBackground: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  }
})

export default TimerComponent;
