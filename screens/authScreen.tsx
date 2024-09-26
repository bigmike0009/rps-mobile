import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AuthScreen = () => {
  const [timeUntilNextGame, setTimeUntilNextGame] = useState<string>(getTimeUntilNextGame());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNextGame(getTimeUntilNextGame());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getTimeUntilNextGame() {
    const now = new Date();
    const nextGameTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0); // 9pm
    if (now.getHours() >= 21) {
      nextGameTime.setDate(nextGameTime.getDate() + 1);
    }
    const diff = nextGameTime.valueOf() - now.valueOf();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rock Paper Scissors</Text>
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>Time until next game:</Text>
        <Text style={styles.countdownTimer}>{timeUntilNextGame}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 16,
    marginBottom: 5,
  },
  countdownTimer: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4267B2', // Facebook blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
