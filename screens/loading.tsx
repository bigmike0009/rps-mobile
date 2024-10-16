import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { Tournament } from 'types/types';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { StackScreenProps } from '@react-navigation/stack';


// Clever phrases for the waiting screen
const cleverPhrases = [
  "Polishing the rocks",
  "Picking him up at Kevin Hart's house",
  "Sharpening the scissors",
  "Stealing paper from the library printer",
  "Taking the safety off (the scissors)",
  "Getting this paper",
  "Chopping it up",
  "Switching from Alternative to Classic",
  "Simone Biles wants a picture with Rocco",
  "Having a Scissophrenic episode",
  "Contacting David Wallace",
  "Signing a supermax with Staples"
];

type GameProps = StackScreenProps<DefaultStackParamList, 'WaitingScreen'>;


const WaitingScreen: React.FC<GameProps> = (props) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string>(cleverPhrases[0]);
  const [dots, setDots] = useState<string>('');
  
  const { navigation } = props;

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    // Mock API call for fetching tournament data
    const fetchTournament = async () => {
        try {
            const response = await tournamentService.getLatestTournament();  // Call to the actual API
            if (response.data){
                setTournament(response.data)
                if (response.data.roundActiveFlag) {
                    navigation.replace('RockPaperScissors', {tournament: response.data});  // Adjust to your actual screen name
                  }
            }
      
            // Check if the round is active and navigate to matchup screen
            
          } catch (error) {
            console.error("Error fetching tournament data", error);
          }
    };

    // Set up periodic fetch every 5 seconds
    const intervalId = setInterval(fetchTournament, 5000);

    return () => clearInterval(intervalId);  // Clean up the interval on unmount
  }, [navigation]);

  useEffect(() => {
    // Rotate phrases every 3 seconds
    const phraseInterval = setInterval(() => {
      setCurrentPhrase(prevPhrase => {
        return cleverPhrases[getRandomInt(cleverPhrases.length)];
      });
    }, 3001);

    return () => clearInterval(phraseInterval);  // Clean up the interval on unmount
  }, []);

  useEffect(() => {
    // Dot animation updating every 500ms
    const dotInterval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(dotInterval);  // Clean up the interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Right Corner */}
      {tournament ? 
      <Card style={styles.topRight}>
        <Text>Round: {tournament.currentRoundId ? tournament.currentRoundId : 1}</Text>
        <Text>{(tournament.playersRemaining && tournament.playersRemaining) > 0 ? tournament.playersRemaining : tournament.numPlayersRegistered!} players remaining</Text>
      </Card> :
      <Card style={styles.topRight}>
        <Text>Fetching Tournament Data...</Text>
    </Card>
      }

      {/* Clever Phrase with Dot Animation */}
      <View style={styles.center}>
        <Text>{currentPhrase}{dots}</Text>
      </View>
    </View>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end',
    padding: 10
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WaitingScreen;
