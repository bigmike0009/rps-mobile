import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from 'auth/authProvider';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { Matchup, Player, Tournament } from 'types/types';


type ResultProps = StackScreenProps<DefaultStackParamList, 'ResultsScreen'>


const playerNames = ["Alice A.", "Bob B.", "Cindy C.", "David D.", "Eva E."];

const ResultsScreen: React.FC<ResultProps> = (props) => {
  const [winner, setWinner] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundsOver, setRoundsOver] = useState(false)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const authContext = useContext(AuthContext);
  const { player } = authContext!
  //const navigation = props.navigation

  const {tournament, matchup, opponent, isPlayer1} = props.route.params  
  const navigation = props.navigation
 
  

  useEffect(() => {
    // Determine the winner based on the matchup
    if (matchup.winner === 1) {
      setWinner(isPlayer1 ? 'player1' : 'player2');
    } else if (matchup.winner === 2) {
      setWinner(isPlayer1 ? 'player2' : 'player1');
    }
  }, [matchup, isPlayer1]);

  useEffect(() => {
    const fetchUpdatedTourney = async (tourneyID: number) => {
        const interval = setInterval(async () => {
            let updated_tourney = await tournamentService.getTournament(tournament.tournamentId)
            if (updated_tourney.data){
                if (!updated_tourney.data.roundActiveFlag){
                    setRoundsOver(true)
                    clearInterval(interval)
                }
            }
}, 10000)
    }

    fetchUpdatedTourney(tournament.tournamentId)
  }, [])

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

  function get_image_url(player: Player | null){
    if (player && player.propic){
    return player.propic
    }
    return "https://zak-rentals.s3.amazonaws.com/Question.png"
    
}

  return (
    <View style={styles.container}>
      {/* Result text */}
      <Text style={styles.resultText}>
        {winner === 'player1' ? 'You Won!' : 'You Lost!'}
      </Text>

      {/* Player profiles */}
      <View style={styles.playersContainer}>
        {/* Our profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(player) }} size={80} />
          <Text>{player?.fname}</Text>
          {(((matchup.winner === 1) && isPlayer1) || ((matchup.winner === 2)) && !isPlayer1) && (
            <Image source={require('../assets/crown.png')} style={styles.crown} />
          )}
        </View>

        {/* Opponent profile */}
        <View style={styles.player}>
          <Avatar.Image source={{ uri: get_image_url(opponent) }} size={80} />
          <Text>{`${opponent.fname} ${opponent.lname[0]}.`}</Text>
          {(((matchup.winner === 1) && !isPlayer1) || ((matchup.winner === 2) && isPlayer1)) && (
            <Image source={require('../assets/crown.png')} style={styles.crown} />
          )}
        </View>
      </View>

      {/* Consolidating remaining players... */}
      

      {/* Animated player names */}
      {roundsOver ? 
      <View>
        <Text> All players have completed the round.</Text>
        <Button mode="contained" onPress={() => navigation.navigate('WaitingScreen')}>
            Advance to next round
         </Button>

      </View>
      :
      <View>
        <Text style={styles.redText}>Pour one out for the fallen players...</Text>
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
      </View>
}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 60,
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
    fontSize: 18
  },
  redText: {
    color: 'red',
    marginBottom: 10,
  },
  playerName: {
    position: 'absolute',
    bottom: 100,
  },
  playerNameText: {
    fontSize: 18,
    color: 'black',
  },
});

export default ResultsScreen;
