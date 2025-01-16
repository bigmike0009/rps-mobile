import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAssets } from 'utilities/assetProvider';

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

  const getTrophyImage = (type: string) => {
    return trophyImage
  }

  return (
    <View style={styles.container}>
      <Image source={trophyImage} style={styles.trophyImage} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{playerName} </Text>
        <Text style={styles.text}>{tournamentId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  trophyImage: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: 'black',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrophyComponent;
