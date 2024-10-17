import React, { useContext, useRef, useState } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Card, Button } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from 'auth/authProvider';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { tournamentService } from 'services/playerService';
import { Matchup, Player, Tournament } from 'types/types';
import { DateTime } from 'luxon';

type ResultProps = StackScreenProps<DefaultStackParamList, 'ResultsScreen'>;

const FinalResultsScreen: React.FC<ResultProps> = (props) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const authContext = useContext(AuthContext);
  const { player } = authContext!;
  
  const { tournament, matchup, opponent } = props.route.params;
  const { width } = Dimensions.get('window');

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

  function get_image_url(player: Player | null) {
    return player && player.propic ? player.propic : "https://zak-rentals.s3.amazonaws.com/Question.png";
  }

  return (
    <View style={styles.container}>
      {/* Result text */}
      <Text style={styles.resultText}>
        {winner === 'p' ? 'You Are the Champion!' : 'You are the first loser!'}
      </Text>

      {/* Trophy with player's name and date */}
      {(winner === 'p' || winner === 'o') && (
        <View style={styles.trophyContainer}>
          <Image source={require('../assets/gold.png')} style={[styles.trophyImage, { width: width * 0.8 }]} />
          <View style={styles.trophyOverlay}>
            <Text style={styles.trophyText}>{player?.fname}</Text>
            <Text style={styles.trophyDate}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      )}

      {/* Player profiles */}
      <View style={styles.playersContainer}>
        {winner === 'p' && (
          <View style={styles.player}>
            <Avatar.Image source={{ uri: get_image_url(player) }} size={80} />
            <Text>{player?.fname}</Text>
          </View>
        )}
        {winner === 'o' && (
          <View style={styles.player}>
            <Avatar.Image source={{ uri: get_image_url(opponent) }} size={80} />
            <Text>{`${opponent.fname} ${opponent.lname[0]}.`}</Text>
          </View>
        )}
      </View>

      {/* Stats card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.statsTitle}>Tournament Stats</Text>
          <Text>Date: {tournament.registrationCloseTs.split(':')[0]}</Text>
          <Text>Total Players: {tournament.numPlayersRegistered}</Text>
          <Text>Total Rounds: {tournament.rounds.length}</Text>
          <Text>Total Elapsed Time: {calculateElapsedTime(tournament)}</Text>
        </Card.Content>
      </Card>

      {/* Go to Home button */}
      <Button mode="contained" onPress={() => props.navigation.navigate('MainMenu')}>
        Return to Menu
      </Button>
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
    transform: [{ translateX: -75 }, { translateY: 68 }],
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
});

export default FinalResultsScreen;
