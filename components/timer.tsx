// TimerComponent.tsx
import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';

interface TimerProps {
  initialTime: number; // in seconds
  onClockExpires: () => void;
}

const TimerComponent: React.FC<TimerProps> = ({ initialTime, onClockExpires }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [expired, setExpired] = useState(false);


  useEffect(() => {


    const intervalId = setInterval(() => {
        if (timeLeft > 0 && !expired){
            setTimeLeft((prevTime) => prevTime - 1);
        }
        else{
            console.log('HUH')
            setExpired(true)
            onClockExpires();

            clearInterval(intervalId)
        }

    }, 1000);
    return () => clearInterval(intervalId);



  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  

  return <ImageBackground source={{ uri: `https://zak-rentals.s3.amazonaws.com/alarm_clock_icon.png` }} style={styles.timerBackground} resizeMode="contain">
            <Text style={styles.timerText}>{timeLeft}</Text>
         </ImageBackground>;
};
const styles = StyleSheet.create({
timerBackground: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  }
})

export default TimerComponent;