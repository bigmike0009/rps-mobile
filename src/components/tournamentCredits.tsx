import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions } from 'react-native';
import { Tournament } from '~/types/types';
import { theme } from './theme';

interface TournamentCreditsProps {
  tournament: Tournament;
  trophyType: string;
}

const attributes = [
  (tournament: Tournament) => `Tournament ID: ${tournament.tournamentId}`,
  (tournament: Tournament) => `Date: ${tournament.registrationCloseTs.substring(0, 10)}`,
  (tournament: Tournament) => `Cash Prize: $${tournament.cash?.toLocaleString() || 'N/A'}`,
  (tournament: Tournament) => `Players: ${tournament.numPlayersRegistered}`,
  (tournament: Tournament) => `Rounds: ${tournament.rounds.length}`,
  (tournament: Tournament, trophyType: string) => `Award: ${trophyType}`
];

const TournamentCredits: React.FC<TournamentCreditsProps> = ({ tournament, trophyType }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const tickerText = attributes.map(attr => attr(tournament, trophyType)).join('   |   ');
  const fullText = `                                                                                                        ${tickerText}                                                                                                        `; // Duplicate text for looping

  useEffect(() => {
    const animateScroll = () => {
      scrollAnim.setValue(0);
      Animated.timing(scrollAnim, {
        toValue: -fullText.length * 4.2,
        duration: 12000, // Adjust speed
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animateScroll());
    };
    animateScroll();
  }, [scrollAnim, screenWidth]);

  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ 
        flexDirection: 'row', 
        transform: [{ translateX: scrollAnim }] 
      }}>
        <Text style={styles.tickerText}>{fullText}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  tickerContainer: {
    width: '100%',
    height: 30,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    marginTop: 10
  },
  tickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for a Wall Street ticker look
    textAlign: 'left',
    paddingHorizontal: 10,
    minWidth: '600%'
  },
});

export default TournamentCredits;
