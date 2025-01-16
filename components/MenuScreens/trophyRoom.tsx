import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import TrophyComponent from 'components/trophy';
import { AuthContext } from 'auth/authProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { FAB, useTheme } from 'react-native-paper';
import { Tournament } from 'types/types';
import { tournamentService } from 'services/appServices';
import TournamentCard from 'components/tournamentCard';

type SingleTrophy = {
  tournamentId: number;
  placement: string;
};

const TrophyRoomComponent: React.FC = () => {
  const { player, checkUser } = useContext(AuthContext)!;
  const [trophies, setTrophies] = useState<SingleTrophy[]>([]);
  const [tournaments, setTournaments] = useState<Record<number, Tournament> | null>()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [tourneyDataLoading, setTourneyDataLoading] = useState(false);

  const [fadeAnimOld] = useState(new Animated.Value(1)); // Old Trophy Fade
  const [fadeAnimNew] = useState(new Animated.Value(0)); // New Trophy Fade
  const [moveAnimOld] = useState(new Animated.Value(0)); // Old Trophy Move
  const [moveAnimNew] = useState(new Animated.Value(100)); // New Trophy Move
  const theme = useTheme();

  useEffect
  
  useEffect(() => {
    refreshTrophyData()
    refreshTournamentData()
  }, []);

  //useEffect(() => {
  //  if (!player || ! player.tournaments) {refreshPlayerData()}
  //}, []);


  const refreshPlayerData = async () => {
    setLoading(true);
    let data = await checkUser('detail'); // Attempt to refresh player data
    setLoading(false);
    return data
  };

  const refreshTrophyData = async () => {
    if (player && player.tournaments && player.tournaments.trophies) {
      let allTrophies: SingleTrophy[] = [];
      Object.entries(player.tournaments.trophies).forEach(([tournamentId, placements]) => {
        placements.forEach((placement) => {
          allTrophies.push({ tournamentId: parseInt(tournamentId), placement: placement });
        });
      });
      setTrophies(allTrophies);
      //refreshTournamentData(allTrophies[currentIndex].tournamentId)
      return allTrophies
    }
    return []
  }
  const refreshTournamentData = async () => {
    if (player && player.playerID) {
      console.log("TOURNEY HUNTING")
      console.log(player)
      tournamentService.getAllTournamentsForPlayer(player.playerID
        
      ).then((tournData)=>tournData.data ? setTournaments(tournData.data) : setTournaments(null)
    ).catch((err)=>      {console.log("TOURNEY ERROR");    console.log(err)}
  ).finally(()=>setLoading(false))
  }
}

  const handleNext = () => {
    if (player?.tournaments?.trophies && currentIndex < trophies.length - 1) {
      setOldIndex(currentIndex)
      setCurrentIndex(currentIndex + 1);
      //refreshTournamentData(trophies[currentIndex + 1].tournamentId)
      triggerAnimation();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setOldIndex(currentIndex)
      setCurrentIndex(currentIndex - 1);
      //refreshTournamentData(trophies[currentIndex - 1].tournamentId)
      triggerAnimation();
    }
  };

  const triggerAnimation = () => {
    // Reset animations so they play again when going back or forward
    fadeAnimOld.setValue(1);
    fadeAnimNew.setValue(0);
    moveAnimOld.setValue(0);
    moveAnimNew.setValue(100);

    Animated.sequence([
      Animated.parallel([
        // Animate the old trophy out
        Animated.timing(fadeAnimOld, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(moveAnimOld, { toValue: -100, duration: 300, useNativeDriver: true }), // Move out of screen
      ]),
      Animated.parallel([
        // Animate the new trophy in
        Animated.timing(fadeAnimNew, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(moveAnimNew, { toValue: 0, duration: 300, useNativeDriver: true }), // Move to center
      ]),
    ]).start();
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

  if (!trophies) {
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
      {trophies && trophies.length > 0 && (
        <View style={styles.carouselContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity disabled={tourneyDataLoading} onPress={handlePrevious} style={styles.arrowleft}>
              <MaterialIcons name="arrow-back" size={36} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Displaying Old Trophy */}
          <Animated.View
            style={{
              opacity: fadeAnimOld,
              transform: [{ translateX: moveAnimOld }],
              position: 'absolute', // Keep the old trophy in the same space
              top: '60%', // Center the trophy vertically

            }}
          >
            <TrophyComponent
              tournamentId={trophies[currentIndex].tournamentId}
              playerName={player.fname || 'Player'}
              placement={trophies[oldIndex].placement}
            />
          </Animated.View>

          {/* Displaying New Trophy */}
          <Animated.View
            style={{
              opacity: fadeAnimNew,
              transform: [{ translateX: moveAnimNew }],
              position: 'absolute', // Keep the new trophy in the same space
              top: '60%', // Center the trophy vertically

            }}
          >
            <TrophyComponent
              tournamentId={trophies[currentIndex + 1]?.tournamentId}
              playerName={player.fname || 'Player'}
              placement={trophies[currentIndex]?.placement}
            />
          </Animated.View>

          {currentIndex < trophies.length - 1 && (
            <TouchableOpacity disabled={tourneyDataLoading} onPress={handleNext} style={styles.arrowright}>
              <MaterialIcons name="arrow-forward" size={36} color="#FFFFFF" />
            </TouchableOpacity>
          )}



          
          
        </View>
        
        
      )}
      {/* {trophies && trophies[currentIndex] && tournaments && !loading && !tourneyDataLoading ? 
      <TournamentCard tournament={tournaments[trophies[currentIndex].tournamentId]} trophyType={trophies[currentIndex].placement}/> :
      <ActivityIndicator size="large" color="#0000ff" />} */}
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
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Align arrows properly
    alignItems: 'center',
    position: 'relative', // To allow absolute positioning of trophies
    marginBottom: 20, // Give some space for the arrows
    paddingTop: 200
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
