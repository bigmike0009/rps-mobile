import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider'; // Assuming you have AuthContext to get playerID


import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { tournamentService, matchupService } from 'services/playerService';
import { Matchup, Tournament } from 'types/types';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { DateTime } from 'luxon';


// Clever phrases for the waiting screen
const cleverPhrases = [
  "Polishing the rocks",
  "Picking him up at Kevin Hart's house",
  "Sharpening the scissors",
  "Stealing from the library printer",
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

  const authContext = useContext(AuthContext);
  let {player} = authContext!

  function isRoundExpired(tourney: Tournament) {
    const now = DateTime.local().setZone('America/New_York'); // Get the current time in the machine's local time, but set it to Eastern Time

    const roundEndTs = tourney?.currentRoundEndTs;

    // Step 1: Create a DateTime object using the input timestamp, assuming it's in Eastern Time
    const endDate = DateTime.fromFormat(roundEndTs, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });

    // Step 2: Check if the parsing was successful
    if (endDate.isValid && now.isValid) {
        // Now that both timestamps are in Eastern Time, calculate the difference
        const diff = endDate.diff(now, ['hours', 'minutes', 'seconds']).toObject();

        if (endDate <= now) {
          //out of time in this round
            return true
        }
        else {
          return false
        }

    }

    console.error('Cannot parse next tournament registration close timestamp. Assuming next is 9 PM.');
    return '00:00:00';
}

  useEffect(() => {

    const checkMatchup = async (tournament: Tournament) => {
      
      console.log(`fetching matchup data for player ${player?.playerID} in tourney ${tournament.tournamentId}`)
      const fetchedMatchup = await matchupService.getMatchupFromPlayer(player?.playerID!, tournament.tournamentId!);
      console.log('fetched matchup succesfully')

      if (fetchedMatchup.data){
        if (isRoundExpired(tournament)){
          //navigation.replace('ResultsScreen', {tournament: tournament, matchup: fetchedMatchup.data});
          console.log('This round has expired. Too late')
          navigation.replace('SpectatorScreen', {tournament: tournament});

        }
        
        else {
          navigation.replace('RockPaperScissors', {tournament: tournament, matchup: fetchedMatchup.data});
      }
    }
      
      else{
        console.log('You are no longer active in this tournament. Have fun spectating')

        navigation.replace('SpectatorScreen', {tournament: tournament});

      }
      // Determine opponent ID and fetch their data

      
    };
    // Mock API call for fetching tournament data
    const fetchTournament = async () => {
        try {
            const response = await tournamentService.getLatestTournament();  // Call to the actual API
            if (response.data){
                setTournament(response.data)
                if (response.data.completeFlag) {
                  console.log('Tournament Complete')
                  navigation.navigate('SpectatorScreen', {tournament: response.data})  // Start matchup if exists for player
                }
                if (response.data.roundActiveFlag) {
                    checkMatchup(response.data)  // Start matchup if exists for player
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
        <Text style={styles.lightText}>Generating bracket</Text>

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
  lightText: {
    color: 'lightgray',
    marginBottom: 10,
    fontSize: 12,
  },
});

export default WaitingScreen;
