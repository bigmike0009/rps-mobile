import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB, Card } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { Matchup, MatchupDetail } from 'types/types';

type GameProps = StackScreenProps<DefaultStackParamList, 'SpectatorScreen'>;

const SpectatorScreen: React.FC<GameProps> = (props) => {
  const { tournament } = props.route.params; // Props passed to screen

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [matchups, setMatchups] = useState<MatchupDetail[]>([]);
  const [loadingMatchups, setLoadingMatchups] = useState(false);

  // Helper function to extract AWS region (e.g., "us-east-1") from table name
  const extractRegion = (tableName: string) => {
    const match = tableName.match(/(us|eu|ap|sa|ca|af)-[a-z]+-\d+/);
    return match ? match[0] : tableName;
  };

  // Fetch matchups when a table is selected
  const selectTable = async (tableName: string) => {
    // If the same table is selected again, deselect it
    if (selectedTable === tableName) {
      setSelectedTable(null);
      setMatchups([]); // Reset matchups when deselected
      return;
    }

    setLoadingMatchups(true);
    setSelectedTable(tableName);

    try {
      const response = await tournamentService.getAllMatchups(tableName);
      if (response.status === 200 && response.data) {
        setMatchups(response.data);
      } else {
        console.error('Failed to load matchups');
      }
    } catch (error) {
      console.error('Error fetching matchups:', error);
    } finally {
      setLoadingMatchups(false);
    }
  };

  // Render the players in a matchup, crossed out if they lost
  const renderMatchup = (matchup: MatchupDetail) => {
    const { player_1_data, player_2_data, winner } = matchup;
    return (
      <View style={styles.matchupContainer}>
        {/* Player 1 */}
        <Text style={[styles.playerName, winner !== 1 && styles.loserText]}>
          {player_1_data.fname} {player_1_data.lname[0]}.
        </Text>

        <Text style={styles.vsText}>VS</Text>

        {/* Player 2 */}
        <Text style={[styles.playerName, winner !== 2 && styles.loserText]}>
          {player_2_data.fname} {player_2_data.lname[0]}.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tournament Info */}
      <Text style={styles.title}>Tournament #{tournament.tournamentId}</Text>
      <Text style={styles.subTitle}>Round {tournament.currentRoundId}</Text>
      <Text style={styles.subTitle}>Remaining Players: {tournament.playersRemaining}</Text>

      {/* Matchup Tables */}
      <View style={styles.fabContainer}>
        {tournament.matchupTables.map((tableName: string) => (
          <FAB
            key={tableName}
            label={extractRegion(tableName)} // Only show the region part of the table name
            style={[
              styles.fab,
              selectedTable === tableName && styles.selectedFab, // Change style when selected
            ]}
            onPress={() => selectTable(tableName)}
            color={selectedTable === tableName ? 'white' : 'black'} // Change text color when selected
            icon="trophy-outline"
          />
        ))}
      </View>

      {/* Bracket Display */}
      {loadingMatchups ? (
        <Text>Loading matchups...</Text>
      ) : (
        <View style={styles.bracketContainer}>
          {matchups.length > 0 ? (
            matchups.map((matchup: MatchupDetail, idx: number) => (
              <View key={idx} style={styles.roundContainer}>
                {renderMatchup(matchup)}
              </View>
            ))
          ) : (
            <Text>Select a region to see more details</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  fabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  fab: {
    margin: 10,
    backgroundColor: '#6200ee',
  },
  selectedFab: {
    backgroundColor: '#03dac6', // Highlight selected table with a different color
  },
  bracketContainer: {
    marginVertical: 20,
  },
  roundContainer: {
    marginBottom: 20,
  },
  matchupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loserText: {
    textDecorationLine: 'line-through',
    color: 'red',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpectatorScreen;
