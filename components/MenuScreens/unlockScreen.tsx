import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import AvatarCard from 'components/avatarCard';
import { AuthContext } from 'auth/authProvider';
import { FAB } from 'react-native-paper';

const avatars = [
  { name: 'rock1', type: 'r', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper1', type: 'p', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors1', type: 's', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  { name: 'rock2', type: 'r', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper2', type: 'p', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors2', type: 's', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  { name: 'rock3', type: 'r', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper3', type: 'p', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors3', type: 's', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  // Add more avatars here
];

const CharacterUnlockScreen: React.FC = () => {
    const [popupVisibleCard, setPopupVisibleCard] = useState<string | null>(null);

    const { player, updatePlayerAvatar, checkUser } = useContext(AuthContext)!; // Get player data from AuthContext
    
    const togglePopup = (name: string | null) => {
        setPopupVisibleCard((prev) => (prev === name ? null : name));

    };

    //useEffect(() => {
    //    checkUser('all')
    //  }, []);
    if (player && player.unlocked && player.unlocked.avatars){
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {avatars.map((avatar, index) => (
          <AvatarCard
            key={index}
            name={avatar.name}
            unlockRequirement={avatar.unlockRequirement}
            progress={avatar.progress}
            inUse={ [player?.avatars.r,player?.avatars.p,player?.avatars.s].includes(avatar.name)}
            isUnlocked={player.unlocked!.avatars.includes(avatar.name)}
            isDialogVisible={popupVisibleCard === avatar.name}
            selectAvatar={() => updatePlayerAvatar(player!.playerID, avatar.type, avatar.name)}
            onToggleDialog={() => togglePopup(avatar.name)

            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

if (!player || !player.unlocked || !player.unlocked.avatars) {
  return (
    <View style={styles.center}>
      <Text>Player data is not available. Please try again later.</Text>
      <FAB label="Refresh Player" icon="refresh" onPress={()=>checkUser('all')} />
    </View>
  );
}
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CharacterUnlockScreen;
