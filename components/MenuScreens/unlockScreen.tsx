import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import AvatarCard from 'components/avatarCard';

const avatars = [
  { name: 'rock1', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper1', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors1', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  { name: 'rock2', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper2', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors2', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  { name: 'rock3', unlockRequirement: 'Win 5 matches', progress: 20, isUnlocked: false },
  { name: 'paper3', unlockRequirement: 'Score 50 points', progress: 50, isUnlocked: true },
  { name: 'scissors3', unlockRequirement: 'Win 3 matches in a row', progress: 10, isUnlocked: false },
  // Add more avatars here
];

const CharacterUnlockScreen: React.FC = () => {
    const [popupVisibleCard, setPopupVisibleCard] = useState<string | null>(null);

    const togglePopup = (name: string | null) => {
        setPopupVisibleCard((prev) => (prev === name ? null : name));

    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {avatars.map((avatar, index) => (
          <AvatarCard
            key={index}
            name={avatar.name}
            unlockRequirement={avatar.unlockRequirement}
            progress={avatar.progress}
            isUnlocked={avatar.isUnlocked}
            isDialogVisible={popupVisibleCard === avatar.name}
            onToggleDialog={() => togglePopup(avatar.name)}
          />
        ))}
      </View>
    </ScrollView>
  );
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
});

export default CharacterUnlockScreen;
