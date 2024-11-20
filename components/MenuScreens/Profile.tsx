import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Menu, Button, Divider } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider';
import { theme } from 'components/theme';

const ProfileComponent: React.FC = () => {
  // Fetch player data from playerProvider
  const { player } = useContext(AuthContext)!; // Get player data from AuthContext
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
        source={{ uri: player?.propic || "https://zak-rentals.s3.amazonaws.com/Question.png" }}
        style={styles.profilePicture}
      />
      <Text style={styles.name}>{player?.fname} {player?.lname}</Text>

      {/* Avatars */}
      <View style={styles.avatarsContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Rock:</Text>
          <Image source={require('assets/rock1.png')} style={styles.avatarImage} />
        </View>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Paper:</Text>
          <Image source={require('assets/paper1.png')} style={styles.avatarImage} />
        </View>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarLabel}>Scissors:</Text>
          <Image source={require('assets/scissors1.png')} style={styles.avatarImage} />
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
