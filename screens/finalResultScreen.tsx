import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Card, Button, FAB, useTheme } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from 'providers/authProvider';
import { useAssets } from 'providers/assetProvider';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { tournamentService } from 'services/appServices';
import { Matchup, Player, Tournament } from 'types/types';
import { DateTime } from 'luxon';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTournament } from 'providers/tournamentProvider';


type ResultProps = StackScreenProps<DefaultStackParamList, 'ResultsScreen'>;

const FinalResultsScreen: React.FC<ResultProps> = (props) => {
  const [cleanupComplete, setCleanupComplete] = useState(false)

  const authContext = useContext(AuthContext);
  const { player } = authContext!;
  const { retrieveAsset} = useAssets()
  const {fetchTournament} = useTournament()
  
  const { tournament, matchup, opponent } = props.route.params;
  const { width, height } = Dimensions.get('window');
  const explosion = useRef<ConfettiCannon | null>(null); // Create a ref for the confetti

  const theme = useTheme()
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // To store timeout ID



  // Helper function to calculate total elapsed time
const calculateElapsedTime = (tournament: Tournament) => {

  const regCloseTs = tournament.registrationCloseTs;
  const endTs = tournament.currentRoundEndTs;

const startDate = DateTime.fromFormat(regCloseTs, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });
const endDate = DateTime.fromFormat(endTs, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });

  // Step 2: Check if the parsing was successful
  if (endDate.isValid && startDate.isValid) {
      // Now that both timestamps are in Eastern Time, calculate the difference
      const diff = endDate.diff(startDate, ['hours', 'minutes', 'seconds']).toObject();

      if (endDate <= startDate) {
          return '00:00:00'; // If bad
      }

      // Format hours, minutes, and seconds with leading zeros
      const hours = Math.floor(diff.hours || 0).toString().padStart(2, '0');
      const minutes = Math.floor(diff.minutes || 0).toString().padStart(2, '0');
      const seconds = Math.floor(diff.seconds || 0).toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
  }
};

  const calculateResult = (matchup: Matchup) => {
    const ourChoice = matchup.player_1_id === player?.playerID ? matchup.player_1_choice : matchup.player_2_choice;
    const opponentChoice = matchup.player_1_id === player?.playerID ? matchup.player_2_choice : matchup.player_1_choice;

    if (matchup.winner === -1) {
      return 'n';
    } else if (
      (opponentChoice === null && ourChoice) ||
      (ourChoice === 'rock' && opponentChoice === 'scissors') ||
      (ourChoice === 'paper' && opponentChoice === 'rock') ||
      (ourChoice === 'scissors' && opponentChoice === 'paper')
    ) {
      return 'p';
    } else {
      return 'o';
    }
  };

  let winner = calculateResult(matchup);

  useEffect(() => {
    const fetchUpdatedTourney = async (tourneyID: number) => {
      let delay = 50000; // Start with 50 seconds (in milliseconds)

      const fetchData = async () => {
        console.log('fetching');
        let updated_tourney = await fetchTournament();

        if (updated_tourney) {
          console.log(updated_tourney);

          // If tournament is complete, stop fetching and clear timeout
          if (updated_tourney.completeFlag) {
            setCleanupComplete(true);

            if (timeoutId.current) {
              clearTimeout(timeoutId.current);
            }
            return;
          }
        }

        // Halve the delay but ensure it doesn't go below 10 seconds (10000 ms)
        delay = Math.max(10000, delay / 2);

        // Add random variance of ±5 seconds (5000 ms)
        const variance = Math.floor(Math.random() * 10000) - 5000;
        const nextDelay = delay + variance;

        console.log(`Next fetch in ${Math.max(nextDelay, 10000) / 1000} seconds`);

        // Set up the next fetch with the new delay and variance
        timeoutId.current = setTimeout(fetchData, Math.max(nextDelay, 10000));
      };

      // Initial fetch with a delay
      timeoutId.current = setTimeout(fetchData, delay);
    };

    fetchUpdatedTourney(tournament.tournamentId);

    // Clean up the timeout if the component unmounts
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [tournament.tournamentId, winner]);

  useEffect(()=>{
    if (winner === 'p') {
      explosion.current?.start();
    }
  },[])

  function get_image_url(player: Player | null) {
    return player && player.propic ? player.propic : retrieveAsset('Question');
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      
      {/* Result text */}
      <Text style={[styles.resultText, {color:theme.colors.primary}]}>
        {winner === 'p' ? 'You Are the Champion!' : 'You are the first loser!'}
      </Text>

      {/* Trophy with player's name and date */}
      {winner === 'p' && (
        <View style={styles.trophyContainer}>
          <Image source={{uri: retrieveAsset('gold')}} style={[styles.trophyImage, { width: width * 0.8, height: height * .3 }]} />
          <View style={styles.trophyOverlay}>
            <Text style={styles.trophyText}>{player?.fname}</Text>
            <Text style={styles.trophyDate}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      )}
      {winner === 'o' && (
        <View style={styles.trophyContainer}>
          <Image source={{uri: retrieveAsset('silver')}} style={[styles.trophyImage, { width: width * 0.8, height: height * .3 }]} />
          <View style={styles.trophyOverlay}>
            <Text style={styles.trophyText}>{player?.fname}</Text>
            <Text style={styles.trophyDate}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      )}

      {/* Player profiles */}
      <View style={styles.playersContainer}>
        
          <View style={styles.player}>
            <Avatar.Image source={{ uri: get_image_url(player) }} size={80} />
            <Text style={{color:theme.colors.onBackground}}>{player?.fname}</Text>
            {winner === 'p' && (
            <Image source={{uri: retrieveAsset('crown')}} style={styles.crown} />
          )}
          </View>
        
        
          <View style={styles.player}>
            <Avatar.Image source={{ uri: get_image_url(opponent) }} size={80} />
            <Text style={{color:theme.colors.onBackground}}>{`${opponent.fname} ${opponent.lname[0]}.`}</Text>
            {winner === 'o' && (
            <Image source={{uri: retrieveAsset('crown')}} style={styles.crown} />
          )}
          </View>
        
      </View>

      {/* Stats card */}
      <Card style={styles.statsCard}>
      <Card.Content> 
  <Text style={[styles.statsTitle, { color: theme.colors.tertiary }]}>Tournament Stats</Text>

  <Text>
    <Text style={{ color: theme.colors.onBackground }}>Date: </Text>
    <Text style={{ color: theme.colors.primary }}>
      {tournament.registrationCloseTs.split(':')[0]}
    </Text>
  </Text>

  <Text>
    <Text style={{ color: theme.colors.onBackground }}>Total Players: </Text>
    <Text style={{ color: theme.colors.primary }}>
      {tournament.numPlayersRegistered}
    </Text>
  </Text>

  <Text>
    <Text style={{ color: theme.colors.onBackground }}>Total Rounds: </Text>
    <Text style={{ color: theme.colors.primary }}>
      {tournament.rounds.length}
    </Text>
  </Text>

  <Text>
    <Text style={{ color: theme.colors.onBackground }}>Total Elapsed Time: </Text>
    <Text style={{ color: theme.colors.primary }}>
      {calculateElapsedTime(tournament)}
    </Text>
  </Text>
</Card.Content>
      </Card>

      {/* Go to Home button */}
      <FAB label="Return to Menu" style={{margin:5,marginBottom:5, padding:0}} onPress={() => props.navigation.replace('MainMenu')} loading={!cleanupComplete} disabled={!cleanupComplete}/>
      <ConfettiCannon
        count={500}
        origin={{ x: -10, y: 0 }}
        autoStart={false} // Don't start automatically
        ref={explosion}   // Attach the ref to the confetti cannon
        fallSpeed={5000}
        colors={[theme.colors.primary, theme.colors.tertiary, "#FFBF00"]}

      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trophyContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyImage: {
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  trophyOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -95 }, { translateY: 68 }],
  },
  trophyText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'black',
  },
  trophyDate: {
    fontSize: 6,
    color: 'black',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 40,
    alignItems: 'center',
  },
  player: {
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 60
  },
  statsCard: {
    width: '90%',
    marginVertical: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  crown: {
    position: 'absolute',
    top: -45,
    left: 10,
    width: 60,
    height: 60,
  },
});

export default FinalResultsScreen;
