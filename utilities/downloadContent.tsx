import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress'; // For cross-platform progress bar
import { useAssets } from './assetProvider'; // Context hook

const DownloadContentScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const { addAsset } = useAssets();

  const remoteFiles = [
    { name: 'alarm_clock_icon', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/alarm_clock_icon.png', type: '.png' },
    { name: 'alarm_clock_icon_white', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/alarm_clock_icon_white.png', type: '.png' },
    { name: 'Question', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/Question.png', type: '.png' },
    { name: 'bronze', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/bronze.png', type: '.png' },
    { name: 'silver', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/silver.png', type: '.png' },
    { name: 'gold', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/gold.png', type: '.png' },
    { name: 'icon', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/icon.png', type: '.png' },
    { name: 'loading', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/loading.jpg', type: '.jpg' },
    { name: 'help', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/Help.png', type: '.png' },
    { name: 'crown', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/crown.png', type: '.png' },
    { name: 'bracket', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/bracket.png', type: '.png' },

    { name: 'scissorsW', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissorsW.png', type: '.png' },
    { name: 'scissors-gray', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors-gray.png', type: '.png' },
    { name: 'scissors1', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors1.PNG', type: '.png' },
    { name: 'scissors2', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors2.png', type: '.png' },
    { name: 'scissors3', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors3.png', type: '.png' },
    { name: 'scissors', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors.png', type: '.png' },
    { name: 'scissors-sprite', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissors-sprite.png', type: '.png' },

    { name: 'rock-gray', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/rock-gray.png', type: '.png' },
    { name: 'rock-sprite', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/rock-sprite.png', type: '.png' },
    { name: 'rockW', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissorsW.png', type: '.png' },
    { name: 'rock', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/rock1.png', type: '.png' },
    { name: 'rock1', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/rock1.png', type: '.png' },

    { name: 'paper', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper.png', type: '.png' },
    { name: 'paper1', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper1.png', type: '.png' },
    { name: 'paper2', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper2.png', type: '.png' },
    { name: 'paper3', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper3.png', type: '.png' },

    { name: 'paper-gray', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper-gray.png', type: '.png' },
    { name: 'paper-sprite', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper-sprite.png', type: '.png' },
    { name: 'paperW', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paper1.png', type: '.png' },

    { name: 'scissorsBg', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/scissorsBg.png', type: '.png' },
    { name: 'rockBg', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/rockBg.png', type: '.png' },
    { name: 'paperBg', uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/paperBG.png', type: '.png' }


  ];

  useEffect(() => {
    const downloadContent = async () => {
        
      for (let i = 0; i < remoteFiles.length; i++) {
        const file = remoteFiles[i];
        const localUri = `${FileSystem.documentDirectory}${file.name}${file.type}`;
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        console.log('loading file:')

        console.log(file.name)

        if (!fileInfo.exists) {
          await FileSystem.downloadAsync(file.uri, localUri);
        }
        console.log('loaded file')

        // Add to context
        addAsset(file.name, localUri);

        // Update progress
        setProgress((i + 1) / remoteFiles.length);
      }

      // Notify when complete
      onComplete();
    };

    downloadContent();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Downloading Content...</Text>
      <Progress.Bar progress={progress} width={200} />
      <Text>{Math.round(progress * 100)}%</Text>
    </View>
  );
};

export default DownloadContentScreen;