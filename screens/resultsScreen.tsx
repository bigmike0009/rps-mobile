import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from 'auth/authProvider';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigationState } from '@react-navigation/native';

import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { Avatar, Button, FAB } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { Matchup, Player } from 'types/types';


type ResultProps = StackScreenProps<DefaultStackParamList, 'ResultsScreen'>


const playerNames = ["Alice A.", "Bob B.", "Cindy C.", "David D.", "Eva E."];

const ResultsScreen: React.FC<ResultProps> = (props) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundsOver, setRoundsOver] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const authContext = useContext(AuthContext);
  const { player } = authContext!;
  
  const { tournament, matchup, opponent } = props.route.params;
  const navigation = props.navigation;

  const currentNavState = useNavigationState(state => state);

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
        const interval = setInterval(async () => {
          console.log('fetching')
            let updated_tourney = await tournamentService.getTournament(tournament.tournamentId)
            if (updated_tourney.data){
              console.log(updated_tourney.data)

                if (!updated_tourney.data.roundActiveFlag){
                  console.log('its over!')

                  setRoundsOver(true)
                  clearInterval(interval)
                }
                
            }
        }, 20000)
        return () => clearInterval(interval);
    }

    fetchUpdatedTourney(tournament.tournamentId)
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
        setCurrentPlayer((prev) => (prev + 1) % playerNames.length);
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
    return player && player.propic ? player.propic : "https://zak-rentals.s3.amazonaws.com/Question.png";
  }

  return (
    <View style={styles.container}>
      {/* Result text */}
      <Text style={styles.resultText}>
        {winner === 'p' ? 'You Won!' : 'You Lost!'}
      </Text>

      {/* Player profiles */}
      <View style={styles.playersContainer}>
        {/* Our profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(player) }} size={80} />
          <Text>{player?.fname}</Text>
          {winner === 'p' && (
            <Image source={require('../assets/crown.png')} style={styles.crown} />
          )}
        </View>

        {/* Opponent profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(opponent) }} size={80} />
          <Text>{`${opponent.fname} ${opponent.lname[0]}.`}</Text>
          {winner === 'o' && (
            <Image source={require('../assets/crown.png')} style={styles.crown} />
          )}
        </View>
      </View>

      {/* Animated player names */}
      {roundsOver ? (
        <View>
          <Text>All players have completed the round.</Text>
          <FAB label={winner === 'p' ? "Advance to next round" : "Return to Main Menu"} style={{margin: 10, padding: 0}} onPress={() => navigation.replace(winner === 'p' ? 'WaitingScreen' : 'MainMenu')}/>
        </View>
      ) : (
        <View style={styles.bottomContainer}>
          <Text style={styles.redText}>Pour one out for the fallen players</Text>
          <Animated.View
            style={[
              styles.playerName,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
              },
            ]}
          >
            <Text style={styles.lightText}>{playerNames[currentPlayer]}</Text>
          </Animated.View>
          <Text style={styles.lightTextSmall}>Waiting for all players to finish...</Text>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: 'black',
    marginTop: 80,
    fontSize: 18,
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
});

export default ResultsScreen;
