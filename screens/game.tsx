

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, ImageBackground } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function RockPaperScissors() {
  const router = useRoute<DetailsSreenRouteProp>();

  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [selectionAnimation, setSelectionAnimation] = useState(new Animated.Value(0));
  const [timer, setTimer] = useState<number>(3);

  useEffect(() => {
    let interval: any;
    if (timer > 0 && !result) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      return () => clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, result]);

  const choices = ['rock', 'paper', 'scissors'];

  const handlePlayerChoice = (choice: string) => {
    setPlayerChoice(choice);
    playSelectionAnimation();
    setTimeout(() => {
      const computerChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerChoice);
      setTimeout(() => {
        calculateResult(choice, computerChoice);
      }, 500); // Adjust the delay as needed
    }, 1000); // Adjust the delay as needed
  };

  const playSelectionAnimation = () => {
    Animated.timing(selectionAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(selectionAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const calculateResult = (playerChoice: string, computerChoice: string) => {
    if (playerChoice === computerChoice) {
      setResult('tie');
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      setResult('win');
    } else {
      setResult('lose');
    }
  };

  const getResultText = () => {
    if (result === 'tie') {
      return 'It\'s a tie!';
    } else if (result === 'win') {
      return 'You win!';
    } else if (result === 'lose') {
      return 'You lose!';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <ImageBackground
         source={{ uri: `https://zak-rentals.s3.amazonaws.com/alarm_clock_icon.png` }} // Replace with your clock background image
          style={styles.timerBackground}
          resizeMode="contain"
        >
          <Text style={styles.timerText}>{timer}</Text>
        </ImageBackground>
      </View>
      <Text style={styles.title}>Rock Paper Scissors</Text>
      <View style={styles.choicesContainer}>
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice}
            onPress={() => handlePlayerChoice(choice)}
            style={styles.choiceButton}
          >
            <Image
              source={{ uri: `https://zak-rentals.s3.amazonaws.com/${choice}.png` }} // Replace with your own image URLs
              style={styles.choiceImage}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.resultContainer}>
        {playerChoice && (
          <Animated.Image
            source={{ uri: `https://zak-rentals.s3.amazonaws.com/${playerChoice}.png` }} // Replace with your own image URLs
            style={[
              styles.choiceImage,
              styles.playerChoiceImage,
              {
                transform: [
                  {
                    scale: selectionAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        {computerChoice && (
          <Animated.Image
            source={{ uri: `https://zak-rentals.s3.amazonaws.com/${computerChoice}.png` }} // Replace with your own image URLs
            style={[
              styles.choiceImage,
              styles.computerChoiceImage,
              {
                transform: [
                  {
                    scale: selectionAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
      </View>
      {result && (
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultText}>{getResultText()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  timerBackground: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  choiceButton: {
    padding: 10,
  },
  choiceImage: {
    width: 100,
    height: 100,
  },
  playerChoiceImage: {
    marginRight: 20,
  },
  computerChoiceImage: {
    marginLeft: 20,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTextContainer: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})