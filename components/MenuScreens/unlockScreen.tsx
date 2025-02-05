import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import AvatarCard from 'components/avatarCard';
import { AuthContext } from 'providers/authProvider';
import { FAB } from 'react-native-paper';
import { avatars } from 'utilities/avatars';
import { Avatar, Player, UnlockProgress } from 'types/types';

const calculatePercentageProgress = (avatar: Avatar, player: Player): UnlockProgress => {
  if (!player || !player.stats || !player.tournaments){
    return {unlockable: false, progressBarDisplay : `0 / 1`,progressBarValue : 0, unlockMessage: `no player data at this time`}
  }
  if (avatar.unlockRequirement.field === 'thrown'){
    const totalThrown = player.stats.rocksThrown + player.stats.papersThrown + player.stats.scissorsThrown;
let percentage = 0;

switch (avatar.type) {
  case 'r':
    percentage = (player.stats.rocksThrown / totalThrown) * 100;
    break;
  case 'p':
    percentage = (player.stats.papersThrown / totalThrown) * 100;
    break;
  case 's':
    percentage = (player.stats.scissorsThrown / totalThrown) * 100;
    break;
}

// Round to 2 decimal places
percentage = Math.round(percentage * 100) / 100;

return {
  unlockable: percentage >= avatar.unlockRequirement.amount * 100,
  progressBarDisplay: `${percentage}%`,
  progressBarValue: Math.min(1, Math.round(percentage / avatar.unlockRequirement.amount) / 100),
  unlockMessage: `Need a ${avatar.type}% of ${avatar.unlockRequirement.amount * 100} to unlock`,
};
  }
  return {unlockable: false, progressBarDisplay : `0 / 1`,progressBarValue : 0, unlockMessage: `Bug! sned screenshot to 2022.allcen@gmail.com`}
}


const calculateAmountProgress = (avatar: Avatar, player: Player): UnlockProgress => {
  if (!player || !player.stats || !player.tournaments){
    return {unlockable: false, progressBarDisplay : `0 / 1`,progressBarValue : 0, unlockMessage: `no player data at this time`}
  }

  let completed = 0
  let moreToUnlockText = 'more to unlock'

  switch (avatar.unlockRequirement.field){
    case 'tourneysPlayed':
      completed = player.tournaments.played.length
      moreToUnlockText= 'more tourneys to unlock'
      break
    case 'gamesWon':
      completed = player.stats.wins
      moreToUnlockText= 'more opponents to unlock'
      break
    case 'tourneyWon':
      return {unlockable: false, progressBarDisplay : `0 / 1`,progressBarValue : 0, unlockMessage: `must win a tournament using ${avatar.type}`}
      
    default: //amount thrown
        switch (avatar.type){
          case 'r':
            completed = player.stats.rocksThrown
            moreToUnlockText = 'more rock throws to unlock'
            break 
          case 'p':
            completed = player.stats.papersThrown
            moreToUnlockText = 'more paper throws to unlock'
            break
          case 's':
            completed = player.stats.scissorsThrown
            moreToUnlockText = 'more scissors throws to unlock'
            break
          
        } 

  }

  

  return {
    unlockable: completed >= avatar.unlockRequirement.amount, 
    progressBarDisplay : `${completed} / ${avatar.unlockRequirement.amount}`,
    progressBarValue : Math.min(1, completed / avatar.unlockRequirement.amount), 
    unlockMessage: `${avatar.unlockRequirement.amount - completed} ${moreToUnlockText}`
  }

}


const CharacterUnlockScreen: React.FC = () => {
    const [popupVisibleCard, setPopupVisibleCard] = useState<string | null>(null);

    const { player, updatePlayerAvatar, unlockPlayerAvatar, checkUser } = useContext(AuthContext)!; // Get player data from AuthContext
    
    const togglePopup = (name: string | null) => {
        setPopupVisibleCard((prev) => (prev === name ? null : name));

    };


    
    const getUnlockProgress = (avatar: Avatar): UnlockProgress => {

      if (!player || !player.stats || !player.tournaments){
        return {unlockable: false, progressBarDisplay : `0 / 1`,progressBarValue : 0, unlockMessage: `no player data at this time`}
      }
    
      switch(avatar.unlockRequirement.unlockType) {
        case 'percentage':
          // code block
          console.log('ALL RISE')
          return calculatePercentageProgress(avatar, player)
        case 'pay':
          // code block
          return {unlockable: false, progressBarValue: 0, progressBarDisplay : `${avatar.unlockRequirement.field}${avatar.unlockRequirement.amount}`, unlockMessage: `WIP: Contact 2022.allcen@gmail.com`}
        default:
          return calculateAmountProgress(avatar, player);
      }
    
    }

    

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
            avatar={avatar}
            unlockProgress={getUnlockProgress(avatar)}
            
            
            unlockAvatar={() => unlockPlayerAvatar(player!.playerID, avatar.name)}
      
            inUse={ [player?.avatars.r,player?.avatars.p,player?.avatars.s].includes(avatar.name)}
            isUnlocked={player.unlocked!.avatars.includes(avatar.name)}
            isDialogVisible={popupVisibleCard === avatar.name}
            selectAvatar={() => updatePlayerAvatar(player!.playerID, avatar.type, avatar.name)}
            onToggleDialog={() => togglePopup(avatar.name)}
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
