import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Player } from 'types/types';

interface BracketProps {
  player1: Player;
  player2: Player;
  winner?: number; // Optional winner
  flipped: boolean;
  timeExpired:boolean;
}

const MatchupComponent: React.FC<BracketProps> = ({ player1, player2, winner, flipped, timeExpired }) => {
  const [dots, setDots] = useState<string>('');

  const theme = useTheme()

  useEffect(() => {
    // Dot animation updating every 500ms
    const dotInterval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : '.'));
    }, 1000);

    return () => clearInterval(dotInterval);  // Clean up the interval on unmount
  }, []);


  return (
    <View style={[styles.container]}>
      <ImageBackground
        source={require('../assets/bracket.png')} // Single matchup background
        style={styles.background}
        imageStyle={flipped ? styles.flippedImage : undefined} // Flip only the image, not the text
      >
        {/* Overlay Player 1 - Determine if player 1 is the loser */}
        <Text
          style={[
            styles.playerText,
            styles.player1,
            (winner === 2) || (timeExpired && winner !== 1) ? styles.loserText : {color: theme.colors.onBackground}, // Loser style if player1 isn't the winner
          ]}
        >
          {player1.fname} {player1.lname[0]}.
        </Text>
        

        {/* Overlay Player 2 - Determine if player 2 is the loser */}
        <Text
          style={[
            styles.playerText,
            styles.player2,
            (winner === 1) || (timeExpired && winner !== 2) ? styles.loserText : {color: theme.colors.onBackground}, // Loser style if player2 isn't the winner
          ]}
        >
          {player2.fname} {player2.lname[0]}.
        </Text>

        {/* Overlay Winner (optional) */}
        {winner ? (
          <Text style={[styles.playerText, styles.winner, {color: theme.colors.primary}]}>{winner === 1 ? `${player1.fname} ${player1.lname[0]}.`:`${player2.fname} ${player2.lname[0]}.`}</Text>
        ) :
        <Text style={[styles.playerText, styles.dots, {color: theme.colors.onBackground}]}>{timeExpired ? 'TIE': dots}</Text>}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Adjust to your needs
    height: 110, // Matchup image height
    marginBottom: 10,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Needed for absolute positioning of text
    width: 360,
    height: 116
  },
  flippedImage: {
    transform: [{ scaleY: -1 }], // Flip the image vertically only
  },
  playerText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  player1: {
    left: 20, // Adjust based on image layout
    top: 9,  // Adjust based on image layout
  },
  player2: {
    left: 20,  // Adjust based on image layout
    top: 80, // Adjust based on image layout
  },
  winner: {
    left: 220, // Adjust to center for winner
    top: 45,   // Centered between the two players
  },
  dots: {
    left: 220, // Adjust to center for winner
    top: 45,   // Centered between the two players
  },
  loserText: {
    color: 'red', // Loser's text in red
    textDecorationLine: 'line-through', // Cross out the loser's name
  },
});

export default MatchupComponent;
