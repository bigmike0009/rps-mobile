import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Divider, ActivityIndicator } from 'react-native-paper';
import { Tournament } from 'types/types';
import { theme } from './theme';

// Interface for the tournament object


interface TournamentCardProps {
  tournament: Tournament;
  trophyType: string;
}


const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, trophyType }) => {
  // Format timestamps for display
  const formatDate = (timestamp: string) => {
    return timestamp.substring(0, 10);
  };

  return (

    <Card style={styles.card}>
      <Card.Content>
        {/* Tournament ID */}
        <Title style={styles.tournamentId}>Tournament ID: {tournament.tournamentId}</Title>
        <Divider style={styles.divider} />

        {/* Tournament Details */}
        <Paragraph>
          <Text style={styles.label}>Tournament Date: </Text>
          {formatDate(tournament.registrationCloseTs)}
        </Paragraph>
        {tournament.cash && <Paragraph>
          <Text style={styles.label}>Cash Prize: </Text>
          ${tournament.cash.toLocaleString()}
        </Paragraph>}
        <Paragraph>
          <Text style={styles.label}>Players Registered: </Text>
          {tournament.numPlayersRegistered}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Rounds: </Text>
          {tournament.rounds.length}
        </Paragraph>
        {/* <Paragraph>
          <Text style={styles.label}>Current Round End Time: </Text>
          {formatDate(tournament.currentRoundEndTs)}
        </Paragraph> */}
        <Paragraph>
          <Text style={styles.label}>Award: </Text>
          {trophyType}
        </Paragraph>

        {/* Optional description */}
        <Divider style={styles.divider} />
        <Paragraph style={styles.description}>
          {/* You can replace this text with descriptions depending on the trophy type */}
          Description  goes here.
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentId: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: 8,
  },
  description: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default TournamentCard;
