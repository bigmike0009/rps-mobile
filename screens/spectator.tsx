import { StackScreenProps } from '@react-navigation/stack';
import MatchupComponent from 'components/Brackets';
import { theme } from 'components/theme';
import TimerComponent from 'components/timer';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { tournamentService } from 'services/appServices';
import { MatchupDetail, Tournament } from 'types/types';
import getSecondsUntilRoundEnd from 'utilities/common';

type GameProps = StackScreenProps<DefaultStackParamList, 'SpectatorScreen'>;

const SpectatorScreen: React.FC<GameProps> = (props) => {
  const { tournament } = props.route.params;
  const [matchups, setMatchups] = useState<MatchupDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [tourney, setTourney] = useState<Tournament>(tournament)

  // Function to extract the region from the full table name
  const extractRegion = (tableName: string) => {
    const parts = tableName.split('_');
    const region = parts[parts.length - 2]; // Extracts the region part
    const round = parts[parts.length - 3]
    return `R${round}: ${region}`

  };

  const fetchMatchups = async () => {
    setLoading(true)
    try {
      const response = await tournamentService.getAllMatchups(selectedTable!);
      if (response.status === 200 && response.data) {
        setMatchups(response.data);

      } else {
        console.error('Failed to load matchups');
      }
    } catch (error) {
      console.error('Error fetching matchups:', error);
    }
    setTimeout(()=>setLoading(false),5000)
  };

  const fetchTournament = async () => {
    setLoading(true)
    try {
      const response = await tournamentService.getTournament(tournament.tournamentId!);
      if (response.status === 200 && response.data) {
        setTourney(response.data);
      } else {
        console.error('Failed to load Tournament');
      }
    } catch (error) {
      console.error('Error fetching Tournament:', error);
    }
    setLoading(false)
  };

  // Function to select or deselect a matchup table
  const selectTable = (tableName: string) => {
    // Deselect if the current table is clicked again
    setSelectedTable((prevTable) => (prevTable === tableName ? null : tableName));
  };

  // Fetch matchups when a new table is selected
  useEffect(() => {
    if (selectedTable) {
      
      fetchMatchups();
    } else {
      setMatchups([]); // Clear matchups if no table is selected
    }
  }, [selectedTable]);

  const timeExpires = () => {
    console.log('TIME HAS EXPIRED')
    if (selectedTable)
    {
    fetchMatchups()
    fetchTournament()
    }
    setTimeExpired(true)
    setTimeout(fetchTournament, 10000)
    setTimeout(fetchTournament, 30000)
    setTimeout(() => props.navigation.replace('MainMenu'), 60000)


  }

  return (
    <View style={[styles.screenContainer, {backgroundColor: theme.colors.background}]}>
      {
       tourney && tourney.currentRoundEndTs && !timeExpired && 
       <View style={styles.timerContainer}>
      {tournament.playersRemaining > 2 && <TimerComponent initialTime={getSecondsUntilRoundEnd(tourney.currentRoundEndTs)} onClockExpires={timeExpires}></TimerComponent>}
      </View>
    }
      
      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems:'center', marginLeft: 20}}>
      <Text style={styles.title}>
  <Text style={{ color: theme.colors.outline, marginTop: 10 }}>Tournament </Text>
  <Text style={{ color: theme.colors.primary }}>
  #{tourney.tournamentId}
  </Text>
</Text>

<Text style={styles.subTitle}>
  <Text style={{ color: theme.colors.outline }}>Round: </Text>
  <Text style={{ color: theme.colors.primary }}>
    {tourney.currentRoundId}
  </Text>
</Text>

{tourney.playersRemaining <= 2 ?
  <Text style={{ color: theme.colors.primary }}>
    { tourney.completeFlag ? "Tournament has concluded" : "FINAL ROUND" }
  </Text>
: 
<Text style={styles.subTitle}>
  <Text style={{ color: theme.colors.outline }}>Round of: </Text>
  <Text style={{ color: theme.colors.primary }}>
    {tourney.playersRemaining + tourney.playersRemaining % 2}
  </Text>
</Text>}

    </View>

      {/* Matchup Tables */}
      <View style={styles.fabContainer}>
        {/* Render each region table as a FAB button */}
        {tourney.matchupTablesByRound[Number(tournament.currentRoundId)].map((tableName: string) => (
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
      <ScrollView contentContainerStyle={[styles.matchupContainer, {backgroundColor: theme.colors.surface, borderRadius: theme.roundness}]}>
        {selectedTable && matchups.length > 0 ? (
          matchups.map((matchup, index) => (
            <MatchupComponent
              key={index}
              player1={matchup.player_1_data}
              player2={matchup.player_2_data}
              winner={matchup.winner}
              flipped={index % 2 !== 0}
              timeExpired={timeExpired}
            />
          ))
        ) : (
          <Text style={{color:theme.colors.onSurface}}>{selectedTable ? 'Loading matchups...' : 'Select a region.'}</Text>
        )}
      </ScrollView>

      <View style={{position:'absolute', bottom: 10, left:10, zIndex: 10}}>
        <FAB icon="home" style={{margin:5,marginBottom:5, padding:0}} onPress={() => props.navigation.replace('MainMenu')} disabled={loading}/>
      </View>
      {!timeExpired &&
      <Text style={styles.lightTextSmall}>Waiting for all players to finish...</Text>
}
      {timeExpired && !tourney.roundActiveFlag && !tourney.completeFlag && tourney.playersRemaining >= 2 &&
      <View style={{position:'absolute', bottom: 10, left:80, zIndex: 10}}>
        <FAB icon="trophy" label="Next Round" style={{margin:5,marginBottom:5, padding:0}} onPress={() => props.navigation.replace('WaitingScreen')} disabled={loading}/>
      </View>
      }   
      
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    //backgroundColor: '#333', // Dark circle behind the timer
    borderRadius: 50
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  screenContainer: {
    flex: 1,
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
     // Highlighted button
  },
  unselectedFab: {
    backgroundColor: 'gray', // Normal button
  },
  lightTextSmall: {
    color: 'lightgray',
    fontSize: 11,
    position: 'absolute',
    right: 10,
    bottom: 20
  },
  matchupContainer: {
    padding: 20,
    flexGrow: 1,
  },
});

export default SpectatorScreen;
