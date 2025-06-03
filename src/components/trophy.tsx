import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAssets } from '~/providers/assetProvider';

type TrophyProps = {
  tournamentId: number;
  playerName: string;
  placement: string;
};

const TrophyComponent: React.FC<TrophyProps> = ({ tournamentId, playerName, placement }) => {
  const {retrieveAsset} = useAssets();

  let trophyImage = {
    gold: {uri: retrieveAsset('gold')},
    silver: {uri: retrieveAsset('silver')},
    bronze: {uri: retrieveAsset('bronze')},
  }[placement];

  if (trophyImage === null || trophyImage === undefined){
    trophyImage = {uri: retrieveAsset('bronze')}
  }


  return (
    <View style={styles.container}>
      <Image source={trophyImage} style={styles.trophyImage} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{playerName} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyImage: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: 'black',
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrophyComponent;
