import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet, Animated, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { DefaultStackParamList } from 'navigation/navigationTypes';
import { AuthContext } from 'auth/authProvider'; // Assuming you have AuthContext to get playerID
import { playerService, matchupService } from 'services/playerService';
import { Matchup, Player, Tournament } from 'types/types';
import { Avatar, Button } from 'react-native-paper';
import { DateTime } from 'luxon';
 // Assuming API functions are available


type RpsProps = StackScreenProps<DefaultStackParamList, 'RockPaperScissors'>

const RockPaperScissors: React.FC<RpsProps> = (props) => {
  const authContext = useContext(AuthContext);
  let {player} = authContext!

  const tournament = props.route.params.tournament
  const navigation = props.navigation

  const choices = ['rock', 'paper', 'scissors'];


  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [tieChoice, setTieChoice] = useState<string | null>(null);

  const [player1or2, setplayer1or2] = useState<1|2>(1);
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  //const [timer, setTimer] = useState<number>(getSecondsUntilRoundEnd(tournament.currentRoundEndTs!));
  const [timer, setTimer] = useState<number>(30);

  const [selectionAnimation, setSelectionAnimation] = useState(new Animated.Value(0));

  // Fetch the current matchup when component mounts
  useEffect(() => {
    const fetchMatchup = async () => {
      
      console.log(`fetching matchup data for player ${player?.playerID} in tourney ${tournament.tournamentId}`)
      const fetchedMatchup = await matchupService.getMatchupFromPlayer(player?.playerID!, tournament.tournamentId!);
      console.log('fetched matchup succesfully')

      setMatchup(fetchedMatchup.data);
      // Determine opponent ID and fetch their data
      setplayer1or2(fetchedMatchup.data!.player_1_id === player?.playerID ? 1 : 2)
      const opponentID = fetchedMatchup.data!.player_1_id === player?.playerID ? fetchedMatchup.data!.player_2_id : fetchedMatchup.data!.player_1_id;
      console.log(`opponent ID is ${opponentID}`)
      console.log(`fetching opponent data`)
      const fetchedOpponent = await playerService.getPlayer(opponentID.toString(), "userID");
      if (fetchedOpponent.data){
        console.log(fetchedOpponent.data)
        setOpponent(fetchedOpponent.data);
      }
      else {
        // TODO - Handle random name & propic
      }
      
    };
    
    if (player && tournament) {fetchMatchup()};
  }, [player?.playerID]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);

        if (waiting && timer > 0 && timer % 7 === 0 && matchup){
          refreshMatchupWaiting(matchup)
        }

        if ( timer <= 0 || result === 'win' || result === 'loss'){
          setWaiting(false);

          clearInterval(interval)
        }
      }, 1000);
    }
    else {
      calculateResult(matchup!)
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, result]);

  const refreshMatchupWaiting = async(match: Matchup) => {
    const refreshedMatchup = await matchupService.getMatchup(match.table, match.matchupID);
    if (refreshedMatchup.data){
    console.log(refreshedMatchup.data)
    console.log('balloons2')

    setMatchup(refreshedMatchup.data);

    if ((player1or2 === 1 && !refreshedMatchup.data!.player_1_choice && refreshedMatchup.data!.player_2_choice) || (player1or2 === 2 && !refreshedMatchup.data!.player_2_choice && refreshedMatchup.data!.player_1_choice )){
      //since the player has last refreshed the matchup, the other player has given there selection, tied, and put in another selection
      setWaiting(false);
      setResult('tie')
      setTieChoice(refreshedMatchup.data!.player_2_choice)
      setPlayerChoice(null)
    }

    if (refreshedMatchup.data!.winner === -1 || (refreshedMatchup.data!.player_1_choice && refreshedMatchup.data!.player_2_choice)) {
      setWaiting(false);
      calculateResult(refreshedMatchup.data);
    }

    
  
  }
  }

  function getSecondsUntilRoundEnd(ts: string) {
    let now = DateTime.now()
    // Step 2: Create a Date object as if the time was in UTC
    // Use "America/New_York" to indicate Eastern Time
    const easternDate = DateTime.fromFormat(ts, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });


  // Check if the parsing was successful
    if (easternDate.isValid) {

        // Step 2: Convert the parsed Eastern DateTime to local time
        let nextGameTime = easternDate.setZone(DateTime.local().zoneName).toJSDate();


        const diff = nextGameTime.valueOf() - now.valueOf();
        
        const seconds = Math.floor(diff / 1000);

        return seconds
        
      }
      return 0
  }

  const playSelectionAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(selectionAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(selectionAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Handle player selection
  const handlePlayerChoice = async (choice: string) => {
    setPlayerChoice(choice);
    setResult(null);
    setWaiting(true);
    playSelectionAnimation();

    const updatedMatchup = await matchupService.updateMatchup(matchup!.table, matchup!.matchupID,  choice, player1or2);
    if (updatedMatchup.data){
      console.log('balloons1')
      console.log(updatedMatchup.data)
      setMatchup(updatedMatchup.data);

      if (!updatedMatchup.data.player_1_choice || !updatedMatchup.data.player_2_choice) {
        // Waiting for the other player to respond
        setWaiting(true);
         // Poll every 3 seconds
    }
    else {
      console.log(updatedMatchup)
      console.log('balloons4')

      setWaiting(false)
      calculateResult(updatedMatchup.data!);
      }
  } 
  else {
    // todo - handle failed data load
  }
  };

  // Determine result once both players have made their choices
  const calculateResult = (matchup: Matchup) => {
    const ourChoice = matchup.player_1_id === player?.playerID ? matchup.player_1_choice : matchup.player_2_choice;
    const opponentChoice = matchup.player_1_id === player?.playerID ? matchup.player_2_choice : matchup.player_1_choice;

    console.log('player choice & opponent choice')
    console.log(ourChoice)
    console.log(opponentChoice)

    if (matchup.winner === -1) {
      console.log('TIE')
      setTieChoice(ourChoice)
      setResult('tie');
      setPlayerChoice(null)
    } else if (
      (opponentChoice === null && ourChoice) ||
      (ourChoice === 'rock' && opponentChoice === 'scissors') ||
      (ourChoice === 'paper' && opponentChoice === 'rock') ||
      (ourChoice === 'scissors' && opponentChoice === 'paper')
    ) {
      setResult('win');
    } else {
      setResult('lose');
    }
  };

  const getResultText = () => {
    if (result === 'tie') {
      return 'It\'s a tie! Choose again!';
    } else if (result === 'win') {
      return 'You win!';
    } else if (result === 'lose') {
      return 'You lose!';
    }
    return '';
  };

  return (
    <View style={[styles.container, { minHeight: 60 }]} >
      {/* Player and Opponent Info */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Round: {tournament.currentRoundId}</Text>
      </View>
      <View style={[styles.matchupContainer, { minHeight: 80 }]}>
        {matchup && (
          <>
            <View style={styles.playerInfo}>
              
              <Avatar.Image
                size={40}
                source={
                  player
                    ? { uri: player.propic }
                    : require('../assets/icon.png')  // Fallback to stock image
                }
                style={styles.avatar}
              /> 
              
              <Text>{player ? player.fname : 'Loading Player Data...'}</Text>
            </View>
            <Text style={{fontSize:24}}>vs</Text>
            <View style={styles.playerInfo}>
            <Avatar.Image
                size={40}
                source={
                  opponent
                    ? { uri: opponent.propic }
                    : require('../assets/icon.png')  // Fallback to stock image
                }
                style={styles.avatar}
              /> 
              <Text>{opponent ? opponent.fname + ' ' + opponent.lname[0] + '.' : 'Loading Opponent Data...'}</Text>
            </View>
          </>
        )}
      </View>

      {/* Game Timer */}
      <View style={styles.timerContainer}>
        <ImageBackground source={{ uri: `https://zak-rentals.s3.amazonaws.com/alarm_clock_icon.png` }} style={styles.timerBackground} resizeMode="contain">
          <Text style={styles.timerText}>{timer}</Text>
        </ImageBackground>
      </View>

      {/* Choices */}
      <View style={[styles.choicesContainer, { minHeight: 100 }]}>
        {choices.map((choice) => (
          <TouchableHighlight  disabled={playerChoice !== null || timer <= 0} key={choice} onPress={() => handlePlayerChoice(choice)} style={styles.choiceButton}>
            <Image 
            source={{ uri: `https://zak-rentals.s3.amazonaws.com/${playerChoice === null && timer > 0 ? choice : choice + '-gray'}.png` }} 
            style={styles.choiceImage  }// Apply gray tint if disabled
           />
          </TouchableHighlight>
        ))}
      </View>

      {(result !== 'tie' && waiting && timer > 0) && 
          <View>
            <Animated.Image
            source={{ uri: `https://zak-rentals.s3.amazonaws.com/${playerChoice}.png` }} // Replace with your own image URLs
            style={[
              styles.choiceImage,
              styles.computerChoiceImage,
              {
                transform: [
                  {
                    scale: selectionAnimation.interpolate({
                      inputRange: [0, 1.1, 5],
                      outputRange: [1, 1.2, 5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text>Waiting for the other player...</Text>
          </View>
        }
        

  <View style={styles.resultContainer}>
        {(timer > 0 && result !== 'tie') &&  
        result && <View>
          <Text style={{textAlign:'center'}}>The results are in...</Text>
          <View style={{flexDirection:'row'}}>
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/${playerChoice}.png` }} style={styles.resImage} />
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/Question.png` }} style={styles.resImage} />
          </View>
          </View>}
      </View>

      <View style={styles.resultContainer}>
        {(timer > 0 && result === 'tie') &&  
        result && <View>
          <Text style={{textAlign:'center'}}>{getResultText()}</Text>
          <View style={{flexDirection:'row'}}>
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/${tieChoice}.png` }} style={styles.resImage} />
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/${tieChoice}.png` }} style={styles.resImage} />
          </View>
          
          </View>}
      </View>

      {/* Display result */}
      <View style={styles.resultContainer}>
        {(timer <= 0) &&  
        result && <View>
          <Text style={{textAlign:'center'}}>{getResultText()}</Text>
          {!playerChoice && <Text style={{textAlign:'center'}}>You did not submit an answer in time. Idiot!</Text>}
          <View style={{flexDirection:'row'}}>
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/${playerChoice}.png` }} style={styles.resImage} />
          <Image source={{ uri: `https://zak-rentals.s3.amazonaws.com/${player1or2 === 1 ? matchup?.player_2_choice : matchup?.player_1_choice}.png` }} style={styles.resImage} />
          </View>
          <Button mode="contained" onPress={() => navigation.navigate('ResultsScreen', {tournament:tournament, matchup: matchup!, opponent: opponent!, isPlayer1: player1or2 === 1})}>
        Test again
      </Button>
          </View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f5', // Light background for better contrast,
    justifyContent: 'space-around', // Ensures elements are spaced evenly

  },
  
  headerContainer: {
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    //backgroundColor: '#333', // Dark circle behind the timer
    borderRadius: 50, // Circular timer
    borderWidth: 2,
    borderColor: '#fff',
  },
  timerBackground: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  choiceButton: {
    padding: 15,
    borderRadius: 15,
    //backgroundColor: '#fff', // Button background color
    elevation: 4, // Shadow effect
  },
  choiceImage: {
    width: 80,
    height: 80,
  },
  resImage: {
    width: 100,
    height: 100,
    margin: 20
  },
  disabledImage: {
    tintColor: 'gray', // Gray tint when the button is disabled
    opacity: 0.4,      // Optional: Adjust opacity for more of a "disabled" effect
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
    marginBottom: 40,
  },
  resultTextContainer: {
    marginBottom: 30,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6666', // Result text color for emphasis
  },
  matchupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3, // Small shadow for the box
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerDetails: {
    marginLeft: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerPropic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  opponentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opponentPropic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  opponentDetails: {
    marginLeft: 10,
  },
  waitingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 30,
  },
  tieText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffaa00', // Bright color to indicate a tie
    marginBottom: 20,
  },
  avatar: {
    marginRight: 15,
  },
});

export default RockPaperScissors;