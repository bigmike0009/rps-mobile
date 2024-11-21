import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Button, Divider } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider';
import { useAssets } from 'utilities/assetProvider';
import { theme } from 'components/theme';

type ProfileProps = {
  switchTab: (option: 'profile' | 'stats' | 'trophy' | 'characters') => void;

};

const ProfileComponent: React.FC<ProfileProps> = ({switchTab}) => {
  // Fetch player data from playerProvider
  const { player } = useContext(AuthContext)!; // Get player data from AuthContext
const {retrieveAsset} = useAssets()

  const [selectedRegion, setSelectedRegion] = useState(player?.region || 'us-east-1');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const regions = ['us-east-1', 'us-west-1', 'eu-central-1']; // Add more regions as needed

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setIsChanged(value !== player?.region); // Check if the value has changed
  };

  const saveChanges = () => {
    console.log(`Region updated to: ${selectedRegion}`);
    setIsChanged(false); // Reset state after saving
    // TODO: Add logic to update player region in the backend
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: player?.propic || retrieveAsset('Question') }}
        style={styles.profilePicture}
      />
      <Text style={styles.name}>{player?.fname} {player?.lname}</Text>

      {/* Avatars */}
      <View style={styles.avatarsContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Rock:</Text>
          <TouchableOpacity onPress={()=>switchTab('characters')}>
          <Image source={{uri: retrieveAsset('rock1')}} style={styles.avatarImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Paper:</Text>
          <TouchableOpacity onPress={()=>switchTab('characters')}>
          <Image source={{uri: retrieveAsset('paper1')}} style={styles.avatarImage} />
          </TouchableOpacity>

        </View>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Scissors:</Text>
          <TouchableOpacity onPress={()=>switchTab('characters')}>
          <Image source={{uri: retrieveAsset('scissors1')}} style={styles.avatarImage} />
          </TouchableOpacity>

        </View>
      </View>

      {/* Region Selector */}
      <View style={styles.regionContainer}>
        <Text style={styles.regionLabel}>Region:</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}

          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.dropdownButton}
            >
              {selectedRegion}
            </Button>
          }
        >
          {regions.map((region) => (
            <Menu.Item
              key={region}

              onPress={() => {
                handleRegionChange(region);
                setMenuVisible(false);
              }}
              title={region}
            />
          ))}
        </Menu>
      </View>

      {/* Save Button */}
      {isChanged && (
        <Button
          mode="contained"
          onPress={saveChanges}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 20,
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 5,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding:10
  },
  regionContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  regionLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: 10,
  },
  dropdownButton: {
    width: '80%',
  },
  saveButton: {
    marginTop: 20,
  },
});

export default ProfileComponent;
