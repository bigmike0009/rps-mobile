import { StackScreenProps } from '@react-navigation/stack';
import MatchupComponent from 'components/Brackets';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { tournamentService } from 'services/playerService';
import { MatchupDetail } from 'types/types';

type GameProps = StackScreenProps<DefaultStackParamList, 'SpectatorScreen'>;

const SpectatorScreen: React.FC<GameProps> = (props) => {
  const { tournament } = props.route.params;
  const [matchups, setMatchups] = useState<MatchupDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Function to extract the region from the full table name
  const extractRegion = (tableName: string) => {
    const parts = tableName.split('_');
    return parts[parts.length - 2]; // Extracts the region part
  };

  // Function to select or deselect a matchup table
  const selectTable = (tableName: string) => {
    // Deselect if the current table is clicked again
    setSelectedTable((prevTable) => (prevTable === tableName ? null : tableName));
  };

  // Fetch matchups when a new table is selected
  useEffect(() => {
    if (selectedTable) {
      const fetchMatchups = async () => {
        setLoading(true)
        try {
          const response = await tournamentService.getAllMatchups(selectedTable);
          if (response.status === 200 && response.data) {
            setMatchups(response.data);
          } else {
            console.error('Failed to load matchups');
          }
        } catch (error) {
          console.error('Error fetching matchups:', error);
        }
        setLoading(false)
      };
      fetchMatchups();
    } else {
      setMatchups([]); // Clear matchups if no table is selected
    }
  }, [selectedTable]);

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Tournament #{tournament.tournamentId}</Text>
      <Text style={styles.subTitle}>Round {tournament.currentRoundId}</Text>
      <Text style={styles.subTitle}>Remaining Players: {tournament.playersRemaining}</Text>

      {/* Matchup Tables */}
      <View style={styles.fabContainer}>
        {/* Render each region table as a FAB button */}
        {tournament.matchupTables.map((tableName: string) => (
          <FAB
            key={tableName}
            label={extractRegion(tableName)} // Display the extracted region
            loading={loading}
            style={[
              styles.fab,
              selectedTable === tableName ? styles.selectedFab : styles.unselectedFab,
            ]}
            onPress={() => selectTable(tableName)} // Toggle selection
            color={selectedTable === tableName ? 'white' : 'black'}
            icon="trophy-outline"
          />
        ))}
      </View>

      {/* Display matchups for the selected table */}
      <ScrollView contentContainerStyle={styles.matchupContainer}>
        {selectedTable && matchups.length > 0 ? (
          matchups.map((matchup, index) => (
            <MatchupComponent
              key={index}
              player1={`${matchup.player_1_data.fname} ${matchup.player_1_data.lname[0]}.`}
              player2={`${matchup.player_2_data.fname} ${matchup.player_2_data.lname[0]}.`}
              winner={matchup.winner}
              flipped={index % 2 !== 0}
            />
          ))
        ) : (
          <Text>{selectedTable ? 'Loading matchups...' : 'Select a region.'}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  fab: {
    marginHorizontal: 5,
    marginBottom: 5,
  },
  selectedFab: {
    backgroundColor: 'blue', // Highlighted button
  },
  unselectedFab: {
    backgroundColor: 'gray', // Normal button
  },
  matchupContainer: {
    padding: 20,
    flexGrow: 1,
  },
});

export default SpectatorScreen;
