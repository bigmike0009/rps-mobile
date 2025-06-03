import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { AuthContext } from '~/providers/authProvider'; // Assuming you have AuthContext to get playerID


import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { tournamentService, matchupService } from '~/services/appServices';
import { Matchup, Tournament } from '~/types/types';
import { DefaultStackParamList } from '~/navigation/navigationTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import { cleverPhrases } from '~/utilities/common';
import { useTournament } from '~/providers/tournamentProvider';


// Clever phrases for the waiting screen


type GameProps = StackScreenProps<DefaultStackParamList, 'WaitingScreen'>;


const WaitingScreen: React.FC<GameProps> = (props) => {
  //const [tournament, setTournament] = useState<Tournament | null>(null);

  const { tournament, fetchTournament } = useTournament();

  const [currentPhrase, setCurrentPhrase] = useState<string>(cleverPhrases[0]);
  const [dots, setDots] = useState<string>('');
  const [playerEliminated, setPlayerEliminated] = useState(false)
  
  const { navigation } = props;
  const theme = useTheme()

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  function getRoundStatus(){
    if (tournament){
      if (tournament.roundActiveFlag){
        if (isRoundExpired(tournament)){
          if (tournament.playersRemaining > 2){
          return 'preparing for next round'
          }
          else{
            return 'crowning the champion'
          }
        }
        else {
          return 'in progress!'
        }
      }
      else
      {
        return 'generating matchups'
      }

    }
    else {
      return 'loading'
    }
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

    let intervalId: NodeJS.Timeout | null = null

    const checkMatchup = async (tourney: Tournament) => {
      
      console.log(`fetching matchup data for player ${player?.playerID} in tourney ${tourney.tournamentId}`)
      const fetchedMatchup = await matchupService.getMatchupFromPlayer(player?.playerID!, tourney.tournamentId!);
      console.log('fetched matchup succesfully')

      if (fetchedMatchup.data){
        if (isRoundExpired(tourney)){
          //navigation.replace('ResultsScreen', {tournament: tournament, matchup: fetchedMatchup.data});
          console.log('This round has expired. Too late')

        }
        
        else {
          if (intervalId) clearInterval(intervalId)

          navigation.replace('RockPaperScissors', {tournament: tourney, matchup: fetchedMatchup.data});
      }
    }
      
      else{
        if (isRoundExpired(tourney)){
          //navigation.replace('ResultsScreen', {tournament: tournament, matchup: fetchedMatchup.data});
          console.log('This round has expired. Too late')

        }
        else {
        console.log('You are no longer active in this tournament. Have fun spectating')
        if (intervalId) clearInterval(intervalId)
        navigation.replace('SpectatorScreen', {tournament: tourney})  // Start matchup if exists for player

        setPlayerEliminated(true)
        }

      }
      // Determine opponent ID and fetch their data

      
    };
    const refreshTournament = async () => {
        try {
            const response = await fetchTournament()  // Call to the actual API
            if (response){
                if (response.completeFlag || !response.activeFlag) {
                  console.log('Tournament Complete')
                  if (intervalId) clearInterval(intervalId)

                  navigation.replace('MainMenu')  // Start matchup if exists for player
                }
                if (response.roundActiveFlag && !isRoundExpired(response)) {
                    checkMatchup(response)  // Start matchup if exists for player
                  }
            }
      
            // Check if the round is active and navigate to matchup screen
            
          } catch (error) {
            console.error("Error fetching tournament data", error);
          }
    };

    // Set up periodic fetch every 5 seconds
    intervalId = setInterval(refreshTournament, 5000);

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
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Top Right Corner */}
      {tournament ? 
      <Card style={[styles.topRight, {backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1}]}>
      <Text>
        <Text style={{ color: theme.colors.outline }}>Round: </Text>
        <Text style={{ color: theme.colors.primary }}>
          {tournament.currentRoundId ? tournament.currentRoundId : 1}
        </Text>
      </Text>
      
      <Text>
        <Text style={{ color: theme.colors.outline }}>Players: </Text>
        <Text style={{ color: theme.colors.primary }}>
          {(tournament.playersRemaining && tournament.playersRemaining) > 0
            ? tournament.playersRemaining + tournament.playersRemaining % 2
            : tournament.numPlayersRegistered + tournament.numPlayersRegistered % 2}
        </Text>
      </Text>
      
    </Card>
     :
      <Card style={[styles.topRight, {backgroundColor: theme.colors.surface}]}>
        <Text style={{color:theme.colors.primary}}>Fetching Tournament Data...</Text>
      </Card>
      }

      {/* Clever Phrase with Dot Animation */}
      <View style={styles.center}>
        <Text style={{color:theme.colors.primary}}>{currentPhrase}{dots}</Text>
        <Text style={styles.lightText}>{getRoundStatus()}</Text>

      </View>

      {['in progress!', 'crowning the champion', 'preparing for next round'].includes(getRoundStatus()) && tournament && 
      <View style={{position:'absolute', bottom: 10, left:10, zIndex: 10}}>
        <FAB icon="trophy" label="Spectate Bracket" style={{margin:5,marginBottom:5, padding:0}} onPress={() => props.navigation.replace('SpectatorScreen', {tournament: tournament})}/>
      </View>
      } 
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
    padding: 15
    },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightText: {
    color: 'lightgray',
    fontSize: 12,
  },
});

export default WaitingScreen;
