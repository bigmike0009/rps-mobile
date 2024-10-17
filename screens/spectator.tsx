import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider'; // Assuming you have AuthContext to get playerID


import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { tournamentService, matchupService } from 'services/playerService';
import { Matchup, Tournament } from 'types/types';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { StackScreenProps } from '@react-navigation/stack';

type GameProps = StackScreenProps<DefaultStackParamList, 'WaitingScreen'>;


const SpectatorScreen: React.FC<GameProps> = (props) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  
  const { navigation } = props;

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const authContext = useContext(AuthContext);
  let {player} = authContext!



  return (
    <View style={styles.container}>
      {/* Top Right Corner */}
      
      <Card style={styles.topRight}>
        <Text>Spectator screen...</Text>
        <Text>Mike still needs to build this...</Text>

    </Card>

    <Button mode="contained" onPress={() => props.navigation.navigate('MainMenu')}>
        Return to Menu
      </Button>


    </View>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end',
    padding: 10
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightText: {
    color: 'lightgray',
    marginBottom: 10,
    fontSize: 12,
  },
});

export default SpectatorScreen;
