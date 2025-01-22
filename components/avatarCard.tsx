import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Pressable } from 'react-native';
import { ProgressBar, Button, Dialog, Portal, IconButton } from 'react-native-paper';
import { useAssets } from 'utilities/assetProvider';
import { theme } from './theme';
import CustomOverlayDialog from './customDialog';
import { Avatar, UnlockProgress } from 'types/types';

interface AvatarCardProps {
  avatar: Avatar;
  unlockProgress: UnlockProgress;
  isUnlocked: boolean;
  inUse: boolean;
  isDialogVisible: boolean;
  onToggleDialog: () => void;
  selectAvatar: () => void;
  unlockAvatar: () => void;



}

const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  unlockProgress,
  isUnlocked,
  isDialogVisible,
  onToggleDialog,
  inUse,
  selectAvatar,
  unlockAvatar

}) => {
  const [scale] = useState(new Animated.Value(1));


  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 1.1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
        onToggleDialog();
    });
  };




  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }, unlockProgress.unlockable && !isUnlocked && styles.glowCard,inUse ? {borderColor:'green', borderWidth: 1} : {}]}>
        <Image
          source={{ uri: useAssets().retrieveAsset(avatar.image) }}
          style={[styles.avatarImage, { opacity: isUnlocked || unlockProgress.unlockable ? 1 : 0.3 }]}
        />
        
        {!isUnlocked && (
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={unlockProgress.progressBarValue} color="green" style={styles.progressBar} />
            <Text style={styles.progressText}>{unlockProgress.progressBarDisplay}</Text>
          </View>
        )}
      </Animated.View>
      <CustomOverlayDialog visible={isDialogVisible} onClose={onToggleDialog}>
      <Text style={styles.avatarName}>{avatar.name}</Text>
        <Text style={styles.popupText}>
          {isUnlocked && !inUse && `Use?`}
          {isUnlocked && inUse && `using ${avatar.name}`}
          {!isUnlocked && !unlockProgress.unlockable && `${unlockProgress.unlockMessage}.`}
          {!isUnlocked && unlockProgress.unlockable && `unlock ${avatar.name}.?`}
        </Text>
        {isUnlocked && !inUse && (
          <IconButton
          mode="contained"
          style={{ alignSelf:'center' }}
          icon="check"
          onPress={() => {
            console.log(`Selected avatar: ${avatar.name}`);
            selectAvatar()
            onToggleDialog();
          }}
        />
        )}
        {!isUnlocked && unlockProgress.unlockable && (
          <IconButton
          mode="contained"
          style={{ alignSelf:'center' }}
          icon="lock"
          onPress={() => {
            console.log(`Selected avatar: ${avatar.name}`);
            unlockAvatar()
            onToggleDialog();
          }}
        />
        )}
      </CustomOverlayDialog>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: theme.colors.surface,
    height: 100
  },
  glowCard: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    // Gold border
    borderWidth: 2,
    borderColor: 'gold',
    // Glow effect
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 10, // for Android shadow
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  progressBarContainer: {
    position: 'relative',
    width: '80%',
    height: 20,
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%',
    borderRadius: 3,
    height: 6,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
    fontWeight: 'bold',
    bottom: 14,
  },
  dialog: {
    backgroundColor: theme.colors.onBackground,
    borderRadius: 8,
  },
  popupText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AvatarCard;
