import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import TrophyComponent from 'components/trophy';
import { AuthContext } from 'auth/authProvider';
import { Player, PlayerTournaments } from 'types/types';
import { MaterialIcons } from '@expo/vector-icons';

type Trophy = {
  tournamentId: number;
  placements: string[];
};

const TrophyRoomComponent: React.FC = () => {
  const { player, checkUser } = useContext(AuthContext)!; // Assuming context is correctly implemented
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player || !player.tournaments || !player.tournaments.trophies) {
      console.log('refresh me');
      refreshData();
    }
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await checkUser('detail'); // Attempt to refresh player data
    setLoading(false);
  };

  const handleNext = () => {
    if (player?.tournaments?.trophies && currentIndex < player.tournaments.trophies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Player data is not available. Please try again later.</Text>
      </View>
    );
  }

  const tournaments: PlayerTournaments | undefined = player.tournaments;

  if (!tournaments?.played?.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>You have not played in any tournaments yet!</Text>
      </View>
    );
  }

  if (!tournaments.trophies) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>You have not won any trophies yet!</Text>
      </View>
    );
  }

  // Convert trophies to a typed array
  const trophies: Trophy[] = tournaments.trophies.map((trophy) => {
    const tournamentId = parseInt(Object.keys(trophy)[0], 10); // Parse the key to a number
    const placements = trophy.placements
    return { tournamentId, placements };
  });

  const currentTrophy = trophies[currentIndex];
  const currentTournamentId = currentTrophy.tournamentId;
  const currentTrophyPlacement = currentTrophy.placements[0]; // Access the first placement

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tournaments Played: {tournaments.played.length}</Text>

      <View style={styles.carouselContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[styles.arrow, currentIndex === 0 && styles.arrowDisabled]}
        >
          <MaterialIcons name="arrow-back" size={36} color="#FFFFFF" />
        </TouchableOpacity>

        <TrophyComponent
          tournamentId={currentTournamentId}
          playerName={player.fname || 'Player'}
          placement={currentTrophyPlacement}
        />

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === trophies.length - 1}
          style={[
            styles.arrow,
            currentIndex === trophies.length - 1 && styles.arrowDisabled,
          ]}
        >
          <MaterialIcons name="arrow-forward" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  arrowDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default TrophyRoomComponent;
