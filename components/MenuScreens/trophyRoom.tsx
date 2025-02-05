import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import TrophyComponent from 'components/trophy';
import { AuthContext } from 'providers/authProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { FAB, useTheme } from 'react-native-paper';
import TournamentCard from 'components/tournamentCard';
import { CircularCarousel } from 'components/circular-carousel/carousel';
import { useAssets } from 'providers/assetProvider';
import { tournamentService } from 'services/appServices';
import { Tournament } from 'types/types';
import TournamentCredits from 'components/tournamentCredits';



const TrophyRoomComponent: React.FC = () => {
  const { player, checkUser } = useContext(AuthContext)!;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tournamentList, setTournamentList]=useState<{ [key: number]: Tournament }>();

  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const {retrieveAsset} = useAssets()
  

  const addTournament = (id: number, tournament: Tournament) => {
    setTournamentList(prevState => ({
      ...prevState,
      [id]: tournament
    }));
  };

  useEffect(() => {
    console.log('INDEX CHANGE')
    console.log(tournamentList)
    if (player && player.tournaments && (!tournamentList || !(currentIndex in tournamentList))){
      tournamentService.getTournament(player.tournaments.trophies[currentIndex].tournamentId).then((response)=>{
      if (response.status==200 && response.data && response.data.tournamentId) {
        addTournament(currentIndex, response.data)  
      }
          
    })
      
    }
  }
  , [currentIndex, player]);

  const data = [
    {uri: retrieveAsset('gold')},
    {uri:retrieveAsset('silver')},
      {uri:retrieveAsset('bronze')}
  ]


  const refreshPlayerData = async () => {
    setLoading(true);
    let data = await checkUser('detail'); // Attempt to refresh player data
    setLoading(false);
    return data
  };

  
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!player || !player.tournaments) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Player data is not available. Please try again later.</Text>
        <FAB label="Refresh Stats" icon="refresh" onPress={refreshPlayerData} />
      </View>
    );
  }

  if (!player.tournaments.played.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>You have not played in any tournaments yet!</Text>
      </View>
    );
  }

  if (!player.tournaments.trophies) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>You have not won any trophies yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.onSurface }]}>
        Tournaments Played: {player.tournaments.played.length}
      </Text>
  
      <View style={styles.contentContainer}>
        {player.tournaments.trophies && player.tournaments.trophies.length > 0 && tournamentList && currentIndex in tournamentList ? (
          <View style={styles.tournamentContainer}>
            <TrophyComponent
              tournamentId={player.tournaments.trophies[currentIndex].tournamentId}
              playerName={player.fname || 'Player'}
              placement={player.tournaments.trophies[currentIndex].placement}
            />
            <TournamentCredits 
              tournament={tournamentList[currentIndex]}
              trophyType={player.tournaments.trophies[currentIndex].placement} 
            />
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
  
        {player.tournaments.trophies && player.tournaments.trophies.length > 0 && (
          <View style={styles.carouselContainer}>
            <CircularCarousel data={player.tournaments.trophies.map((trophy)=>{return {uri: retrieveAsset(trophy.placement)}})} onCurrentIndexChange={setCurrentIndex} />
          </View>
        )}
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1, // Takes up full height
    justifyContent: 'space-between', // Spaces out TournamentCard and Carousel
  },
  tournamentContainer: {
    flexGrow: 1, // Allows it to expand naturally
    alignItems: 'center',
  },
  carouselContainer: {
    alignItems: 'center',
    marginBottom: 20, // Adds space at the bottom
  },
  arrowleft: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 20,
    zIndex: 10, // Make sure arrows are clickable above the trophies
    right: 250, // Add more space between arrows
    position: 'absolute'

  },
  arrowright: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 20,
    zIndex: 10, // Make sure arrows are clickable above the trophies
    left: 250, // Add more space between arrows
    position: 'absolute'
  },
});

export default TrophyRoomComponent;
