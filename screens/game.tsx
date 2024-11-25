import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet, Animated, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { DefaultStackParamList } from 'navigation/navigationTypes';
import { AuthContext } from 'auth/authProvider'; // Assuming you have AuthContext to get playerID
import { useAssets } from 'utilities/assetProvider';
import { playerService, matchupService } from 'services/appServices';
import { Matchup, Player, Tournament } from 'types/types';
import { Avatar, Button, FAB, useTheme } from 'react-native-paper';
import { DateTime } from 'luxon';
import TimerComponent from 'components/timer';
import getSecondsUntilRoundEnd from 'utilities/common';
 // Assuming API functions are available


type RpsProps = StackScreenProps<DefaultStackParamList, 'RockPaperScissors'>

const RockPaperScissors: React.FC<RpsProps> = (props) => {
  const authContext = useContext(AuthContext);
  let {player} = authContext!
  const {retrieveAsset} = useAssets()

  const tournament = props.route.params.tournament
  const finalRound = tournament.playersRemaining <= 2
  
  const navigation = props.navigation
  const theme = useTheme()

  const choices = ['rock', 'paper', 'scissors'];


  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [tieChoice, setTieChoice] = useState<string | null>(null);

  const [player1or2, setplayer1or2] = useState<1|2>(1);
  const [matchup, setMatchup] = useState<Matchup | null>(props.route.params.matchup);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [timeExpired, setTimeExpired] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  //const [timer, setTimer] = useState<number>(getSecondsUntilRoundEnd(tournament.currentRoundEndTs!));
  //const [timer, setTimer] = useState<number>(30);

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

      if (opponentID){
        const fetchedOpponent = await playerService.getPlayer(opponentID.toString(), "userID");
        if (fetchedOpponent.data){
          console.log(fetchedOpponent.data)
          setOpponent(fetchedOpponent.data);
        }
      }
      else {
        // TODO - Handle random name & propic
        let res = playerService.getRandomPlayer()
        res.then((value) => {setOpponent(value)})
      }
      
    };
    
    if (player && tournament) {fetchMatchup()};
  }, [player?.playerID]);

  useEffect(() => {
    let interval: any;
    if (waiting && player?.playerID) {
      interval = setInterval(() => {

        if (waiting && matchup){
          refreshMatchupWaiting(matchup)
        }

        if (result === 'win' || result === 'loss'){
          setWaiting(false);
          clearInterval(interval)
        }
      }, 7000 + (player.playerID % 11 * 100));
    }
    else {
      calculateResult(matchup!)
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [waiting]);

  const timeExpires = () => {
    console.log('TIME HAS EXPIRED')
    setTimeExpired(true)
    if (matchup){
    calculateResult(matchup!);
    }
    setWaiting(false);
  }

  const refreshMatchupWaiting = async(match: Matchup) => {
    console.log(match.table, match.matchupID)

    const refreshedMatchup = await matchupService.getMatchup(match.table, match.matchupID);
    if (refreshedMatchup.data){
    console.log(refreshedMatchup.data)

    match.player_1_choice = refreshedMatchup.data.player_1_choice
    match.player_2_choice = refreshedMatchup.data.player_2_choice
    match.winner = refreshedMatchup.data.winner


    setMatchup(match);

    if ((player1or2 === 1 && !refreshedMatchup.data!.player_1_choice && refreshedMatchup.data!.player_2_choice) || (player1or2 === 2 && !refreshedMatchup.data!.player_2_choice && refreshedMatchup.data!.player_1_choice )){
      //since the player has last refreshed the matchup, the other player has given there selection, tied, and put in another selection
      setWaiting(false);
      setResult('tie')
      setTieChoice(playerChoice)
      setPlayerChoice(null)
    }

    if (refreshedMatchup.data!.winner === -1 || (refreshedMatchup.data!.player_1_choice && refreshedMatchup.data!.player_2_choice)) {
      setWaiting(false);
      calculateResult(refreshedMatchup.data);
    }

    
  
  }
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
    playSelectionAnimation();
    setLoading(true)

    const updatedMatchup = await matchupService.updateMatchup(matchup!.table, matchup!.matchupID,  choice, player1or2, finalRound);
    setTimeout(()=>setLoading(false), 3000)
    
    if (updatedMatchup.data){
      console.log(updatedMatchup.data)

      let match = matchup!
      match.player_1_choice = updatedMatchup.data.player_1_choice
      match.player_2_choice = updatedMatchup.data.player_2_choice
      match.winner = updatedMatchup.data.winner

      setMatchup(match);

      if (!updatedMatchup.data.player_1_choice || !updatedMatchup.data.player_2_choice) {
        // Waiting for the other player to respond
        setWaiting(true);
         // Poll every 3 seconds
    }
    else {
      console.log(updatedMatchup)

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

    //these will both be null in a tie
    console.log('player choice & opponent choice')
    console.log(ourChoice)
    console.log(opponentChoice)

    if (matchup.winner === -1) {
      console.log('TIE')
      setTieChoice(playerChoice)
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Title/Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: theme.colors.onBackground }]}>
          {finalRound ? 'Final Round!' : `Round: ${tournament.currentRoundId}`}
        </Text>
      </View>
      {
       tournament && tournament.currentRoundEndTs && 
       <View style={styles.timerContainer}>
      { tournament.playersRemaining > 2 &&
        <TimerComponent initialTime={getSecondsUntilRoundEnd(tournament.currentRoundEndTs)} onClockExpires={timeExpires}></TimerComponent>
      }
      </View>
    }
  
      {/* Matchup */}
      <View style={[styles.matchupContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
        {matchup && (
          <>
            <View style={styles.playerInfo}>
              <Avatar.Image
                size={40}
                source={player ? { uri: player.propic } : {uri: retrieveAsset('Question')}}
                style={[styles.avatar, { borderColor: theme.colors.outline }]}
              />
              <Text style={{ color: theme.colors.onSurface }}>{player ? player.fname : 'Loading Player Data...'}</Text>
            </View>
            <Text style={{ fontSize: 24, color: theme.colors.primary }}>vs</Text>
            <View style={styles.playerInfo}>
              <Avatar.Image
                size={40}
                source={opponent ? { uri: opponent.propic } : {uri: retrieveAsset('Question')}}
                style={styles.avatar}
              />
              <Text style={{ color: theme.colors.onSurface }}>{opponent ? `${opponent.fname} ${opponent.lname[0]}.` : 'Loading Opponent Data...'}</Text>
            </View>
          </>
        )}
      </View>
  
      {/* Choices */}
      <View style={styles.choicesContainer}>
        {playerChoice !== null|| timeExpired ?
        //Expired
        choices.map((choice) => (
          <TouchableHighlight
            disabled={true}
            key={choice}
            onPress={() => handlePlayerChoice(choice)}
            style={[
              styles.choiceButton,{ backgroundColor: theme.colors.onSurfaceDisabled },
            ]}
          >
            <Image
              tintColor={'#2d3436'}
              source={{ uri: retrieveAsset(`${choice}-sprite`) }}
              style={styles.choiceImage}
            />
          </TouchableHighlight>
        )) :
        choices.map((choice) => (
          //Enabled
          <TouchableHighlight
            key={choice}
            onPress={() => handlePlayerChoice(choice)}
            style={[
              styles.choiceButton,
              { backgroundColor: theme.colors.surface }
            ]}
          >
            <Image
              source={{ uri: retrieveAsset(`${choice}-sprite`) }}
              style={styles.choiceImage}
            />
          </TouchableHighlight>
        )) }
        
      </View>

      {(result !== 'tie' && waiting && !timeExpired) && 
    <View style={styles.resultContainer}>
      <Animated.Image
        source={{ uri: retrieveAsset(`${playerChoice}-sprite`) }} 
        style={[
          styles.choiceImage,
          styles.choiceImage,
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
      <Text style={{color: theme.colors.onBackground}}>
        Waiting for the other player...
      </Text>
    </View>
  }

  {/* When player has made a choice and waiting for the results */}
  <View style={styles.resultContainer}>
    {(playerChoice && !timeExpired && result !== 'tie') && result && (
      <View>
        <Text style={{textAlign: 'center', color: theme.colors.onBackground}}>
          The results are in...
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Image 
            source={{ uri: retrieveAsset(`${playerChoice}-sprite`) }} 
            style={styles.resImage} 
          />
          <Image 
            source={{ uri: retrieveAsset('Help') }} 
            style={styles.resImage} 
          />
        </View>
        <FAB
              label="Results"
              loading={loading}
              disabled={loading}
              onPress={() =>
                navigation.replace(
                  finalRound ? 'FinalResultsScreen' : 'ResultsScreen',
                  { tournament, matchup: matchup!, opponent: opponent!, player1or2 }
                )
              }
            />
      </View>
      
    )}
  </View>

  {/* Handling the tie scenario */}
  <View style={styles.resultContainer}>
    {(!timeExpired && result === 'tie') && (
      <View>
        <Text style={{textAlign: 'center', color: theme.colors.primary}}>
          {getResultText()}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Image 
            source={{ uri: retrieveAsset(`${tieChoice}-sprite`) }} 
            style={styles.resImage} 
          />
          <Image 
            source={{ uri: retrieveAsset(`${tieChoice}-sprite`) }} 
            style={styles.resImage} 
          />
        </View>
      </View>
    )}
  </View>
  
      {/* Result */}
      <View style={styles.resultContainer}>
        {timeExpired && result && (
          <View>
            <Text style={{ textAlign: 'center', color: theme.colors.primary, fontSize: 24 }}>{getResultText()}</Text>
            {!playerChoice && (
              <Text style={{ textAlign: 'center', color: theme.colors.onSurface }}>
                You did not submit an answer in time. Idiot!
              </Text>
            )}
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: retrieveAsset(`${playerChoice}-sprite`)}} style={styles.resImage} />
              <Image source={{ uri: retrieveAsset(`${player1or2 === 1 ? matchup?.player_2_choice : matchup?.player_1_choice}-sprite`)}} style={styles.resImage} />
            </View>
            <FAB
              label="Results"
              onPress={() =>
                navigation.replace(
                  finalRound ? 'FinalResultsScreen' : 'ResultsScreen',
                  { tournament, matchup: matchup!, opponent: opponent!, player1or2 }
                )
              }
            />
          </View>
        )}
      </View>
    </View>
  )
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingVertical: 20,
      alignItems: 'center',
    },
    timerContainer: {
      position: 'absolute',
      top: 15,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      //backgroundColor: '#333', // Dark circle behind the timer
      borderRadius: 50, // Circular timer
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    matchupContainer: {
      position: 'absolute',
      top: '10%', // Adjust as needed for spacing
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      backgroundColor: '#fff',
      elevation: 3,
    },
    playerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginRight: 15,
    },
    choicesContainer: {
      position: 'absolute',
      top: '40%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',           // Center items vertically
      width: '100%',
      paddingHorizontal: 20,
    },
    choiceButton: {
      padding: 15,
      elevation: 4,
      marginHorizontal: 8,
      borderRadius:50

    },
    choiceImage: {
      width: 80,
      height: 80,
      borderRadius: 5,
    },
    resultContainer: {
      position: 'absolute',
      bottom: 90,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    resImage: {
      width: 100,
      height: 100,
      margin: 20,
    },
  });
  
export default RockPaperScissors;
