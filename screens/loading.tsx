import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { Tournament } from 'types/types';


// Clever phrases for the waiting screen
const cleverPhrases = [
  "Polishing the rocks",
  "Sharpening the scissors",
  "Stealing paper from the library printer",
];

const WaitingScreen: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string>(cleverPhrases[0]);
  const [dots, setDots] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    // Mock API call for fetching tournament data
    const fetchTournament = async () => {
        try {
            const response = await tournamentService.getLatestTournament();  // Call to the actual API
            if (response.data){
                setTournament(response.data)
                if (response.data.roundActiveFlag) {
                    //navigation.navigate('RockPaperScissors');  // Adjust to your actual screen name
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
        const currentIndex = cleverPhrases.indexOf(prevPhrase);
        const nextIndex = (currentIndex + 1) % cleverPhrases.length;
        return cleverPhrases[nextIndex];
      });
    }, 3000);

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
      <View style={styles.topRight}>
        <Text>Round: {tournament.currentRoundId!}</Text>
        <Text>{tournament.playersRemaining!} players remaining</Text>
      </View> :
      <View style={styles.topRight}>
        <Text>Fetching Tournament Data...</Text>
        <Text>Fetching Tournament Data...</Text>
    </View>
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
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WaitingScreen;
