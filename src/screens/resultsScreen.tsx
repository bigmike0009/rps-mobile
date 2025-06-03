import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '~/providers/authProvider';
import { useAssets } from '~/providers/assetProvider';

import { DefaultStackParamList } from '~/navigation/navigationTypes';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigationState } from '@react-navigation/native';

import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { Avatar, Button, FAB, useTheme } from 'react-native-paper';
import { tournamentService } from '~/services/appServices';
import { Matchup, Player } from '~/types/types';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTournament } from '~/providers/tournamentProvider';



type ResultProps = StackScreenProps<DefaultStackParamList, 'ResultsScreen'>


const playerNames = ["Alice A.", "Bob B.", "Cindy C.", "David D.", "Eva E."];

const ResultsScreen: React.FC<ResultProps> = (props) => {

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const authContext = useContext(AuthContext);
  const { player } = authContext!;
  const {retrieveAsset}=useAssets()
  const {fetchTournament}=useTournament()

  const theme = useTheme();
  
  const { tournament, matchup, opponent } = props.route.params;
  const navigation = props.navigation;

  const currentNavState = useNavigationState(state => state);
  const explosion = useRef<ConfettiCannon | null>(null); // Create a ref for the confetti
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Store the timeout ID

  const [loading, setLoading] = useState<boolean>(false)



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
      let delay = 30000; // Start with 30 seconds (in milliseconds)

      const fetchData = async () => {
        console.log('fetching');
        let updated_tourney = await fetchTournament()

        if (updated_tourney) {
          console.log(updated_tourney);

          if (!updated_tourney.roundActiveFlag) {
            console.log('its over!');

            // Clear any existing timeout since the round is over
            if (timeoutId.current) clearTimeout(timeoutId.current);
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
        timeoutId.current = setTimeout(fetchData, Math.max(nextDelay, 10000)); // Store the timeout ID
      };

      // Initial fetch with a delay
      timeoutId.current = setTimeout(fetchData, delay); // Store the timeout ID
    };

    fetchUpdatedTourney(tournament.tournamentId);

    // Clean up the timeout if the component unmounts or the round ends
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current); // Clear the timeout on cleanup
    };
  }, [tournament.tournamentId, winner]);

  useEffect(() => {
    // Only fetch if the winner is 'p'
    setLoading(true)
    if (winner === 'p') {
      explosion.current?.start();
    }
    setTimeout(()=>setLoading(false), 5000)

  }, [])

  useEffect(() => {
    console.log("Navigation state updated:", currentNavState);
    const currentRoute = currentNavState.routes[currentNavState.index];
    console.log("Current Route:", currentRoute.name);

    if (currentRoute.name !== 'ResultsScreen') {
      console.log("Navigating away unexpectedly from ResultsScreen.");
    }
  }, [currentNavState]);

  useEffect(() => {
    console.log('Tournament:', tournament);
    console.log('Matchup:', matchup);
  }, [tournament, matchup]);

  useEffect(() => {
    // Animation loop for the player name change
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(1);
        translateAnim.setValue(30);
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, translateAnim]);

  function get_image_url(player: Player | null) {
    return player && player.propic ? player.propic : retrieveAsset('Question');
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false} // Don't start automatically
        ref={explosion}   // Attach the ref to the confetti cannon
        fadeOut={true}
      />
      {/* Result text */}
      <Text style={[styles.resultText, {color: theme.colors.primary}]}>
        {winner === 'p' ? 'You Won!' : 'You Lost!'}
      </Text>

      {/* Player profiles */}
      <View style={styles.playersContainer}>
        {/* Our profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(player) }} size={80} />
          <Text style={{color: theme.colors.onBackground}}>{player?.fname}</Text>
          {winner === 'p' && (
            <Image source={{uri: retrieveAsset('crown')}} style={styles.crown} />
          )}
        </View>

        {/* Opponent profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(opponent) }} size={80} />
          <Text style={{color: theme.colors.onBackground}}>{`${opponent.fname} ${opponent.lname[0]}.`}</Text>
          {winner === 'o' && (
            <Image source={{uri: retrieveAsset('crown')}} style={styles.crown} />
          )}
        </View>
      </View>


      <View style={styles.resultContainer}>
              <Image source={{ uri: retrieveAsset(`${player?.playerID === matchup.player_1_id ? matchup?.player_1_choice : matchup?.player_2_choice}-sprite`)}} style={styles.resImage} />
              <Image source={{ uri: retrieveAsset(`${player?.playerID === matchup.player_1_id ? matchup?.player_2_choice : matchup?.player_1_choice}-sprite`) }} style={styles.resImage} />
      </View>

      <FAB label="Spectate Bracket" loading={loading} disabled={loading} style={{margin: 10, padding: 0, backgroundColor: theme.colors.primary}} onPress={() => navigation.replace('SpectatorScreen', {tournament: tournament})}/>



      
    </View>
  );
};

{/* Animated player names */}
// {roundsOver ? (
//   <View>
//     <Text style={{color: theme.colors.onBackground}}>All players have completed the round.</Text>
//     <FAB label={winner === 'p' ? "Advance to next round" : "Return to Main Menu"} style={{margin: 10, padding: 0, backgroundColor: theme.colors.primary}} onPress={() => navigation.replace(winner === 'p' ? 'WaitingScreen' : 'MainMenu')}/>
//   </View>
// ) : (
//   <View style={styles.bottomContainer}>
//     <Text style={styles.redText}>Pour one out for the fallen players</Text>
//     <Animated.View
//       style={[
//         styles.playerName,
//         {
//           opacity: fadeAnim,
//           transform: [{ translateY: translateAnim }],
//         },
//       ]}
//     >
//       <Text style={styles.lightText}>{playerNames[currentPlayer]}</Text>
//     </Animated.View>
//     <Text style={styles.lightTextSmall}>Waiting for all players to finish...</Text>

//   </View>
// )}

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
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  player: {
    alignItems: 'center',
    position: 'relative',
  },
  crown: {
    position: 'absolute',
    top: -45,
    left: 10,
    width: 60,
    height: 60,
  },
  lightText: {
    color: 'lightgray',
    marginBottom: 10,
    fontSize: 18,
  },
  lightTextSmall: {
    color: 'lightgray',
    marginTop: 80,
    fontSize: 11,
  },
  redText: {
    color: 'red',
    marginBottom: 10,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  playerName: {
    marginTop: 10,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resImage: {
    width: 100,
    height: 100,
    margin: 20,
  },
});

export default ResultsScreen;
