import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Divider, ActivityIndicator } from 'react-native-paper';
import { tournamentService } from 'services/appServices';
import { Tournament } from 'types/types';

// Interface for the tournament object


interface TournamentCardProps {
  tournament: Tournament;
  trophyType: string;
}


const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, trophyType }) => {
  // Format timestamps for display
  const formatDate = (timestamp: string) => {
    return formatDate(timestamp);
  };

  return (

    <Card style={styles.card}>
      <Card.Content>
        {/* Tournament ID */}
        <Title style={styles.tournamentId}>Tournament ID: {tournament.tournamentId}</Title>
        <Divider style={styles.divider} />

        {/* Tournament Details */}
        <Paragraph>
          <Text style={styles.label}>Date of Tournament: </Text>
          {formatDate(tournament.registrationCloseTs)}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Cash Prize: </Text>
          ${tournament.cash.toLocaleString()}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Players Registered: </Text>
          {tournament.numPlayersRegistered}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Rounds: </Text>
          {tournament.rounds.length}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Current Round End Time: </Text>
          {formatDate(tournament.currentRoundEndTs)}
        </Paragraph>
        <Paragraph>
          <Text style={styles.label}>Trophy Type: </Text>
          {trophyType}
        </Paragraph>

        {/* Optional description */}
        <Divider style={styles.divider} />
        <Paragraph style={styles.description}>
          {/* You can replace this text with descriptions depending on the trophy type */}
          Description for the trophy type or additional details can go here.
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentId: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: 10,
  },
  description: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default TournamentCard;
