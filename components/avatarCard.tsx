import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Pressable } from 'react-native';
import { ProgressBar, Button, Dialog, Portal, IconButton } from 'react-native-paper';
import { useAssets } from 'utilities/assetProvider';
import { theme } from './theme';
import CustomOverlayDialog from './customDialog';

interface AvatarCardProps {
  name: string;
  unlockRequirement: string;
  progress: number; // current progress out of 50
  isUnlocked: boolean;
  inUse: boolean;
  isDialogVisible: boolean;
  onToggleDialog: () => void;
  selectAvatar: () => void;


}

const AvatarCard: React.FC<AvatarCardProps> = ({
  name,
  unlockRequirement,
  progress,
  isUnlocked,
  isDialogVisible,
  onToggleDialog,
  inUse,
  selectAvatar

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
      <Animated.View style={[styles.card, { transform: [{ scale }] }, inUse ? {borderColor:'green', borderWidth: 1} : {}]}>
        <Image
          source={{ uri: useAssets().retrieveAsset(name.toLowerCase()) }}
          style={[styles.avatarImage, { opacity: isUnlocked ? 1 : 0.3 }]}
        />
        
        {!isUnlocked && (
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={progress / 50} color="green" style={styles.progressBar} />
            <Text style={styles.progressText}>{`${progress}/50`}</Text>
          </View>
        )}
      </Animated.View>
      <CustomOverlayDialog visible={isDialogVisible} onClose={onToggleDialog}>
      <Text style={styles.avatarName}>{name}</Text>
        <Text style={styles.popupText}>
          {isUnlocked && !inUse
            ? `Use?`
            : `${inUse ? 'Unlocked' : 'Unlock'} by ${unlockRequirement}.`}
        </Text>
        {isUnlocked && !inUse && (
          <IconButton
          mode="contained"
          style={{ alignSelf:'center' }}
          icon="check"
          onPress={() => {
            console.log(`Selected avatar: ${name}`);
            selectAvatar()
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
