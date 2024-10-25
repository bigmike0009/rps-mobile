import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, Button, FAB, Text, useTheme, Avatar } from 'react-native-paper';
import { AuthContext } from 'auth/authProvider';
//import { updatePlayer } from '../api/player'; // Your API call for updating the player
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Player } from 'types/types';

const ProfileScreen = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  let {player} = authContext!

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currPlayer, setCurrPlayer] = useState<Player>(player!); // Local state for editing
  const profilePics = ['img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png', 'img6.png', 'img7.png', 'img8.png', 'img9.png']; // Replace with actual image URLs

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      //const updated = await updatePlayer(currPlayer); // Call API to update player data
      //setCurrPlayer(updated); // Update global player state
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating player:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar.Image size={120} source={{ uri: `https://your-bucket/${currPlayer.propic}` }} />
        {editMode && (
          <ScrollView horizontal style={styles.imageSelection}>
            {profilePics.map((pic) => (
                <TouchableHighlight onPress={() => setCurrPlayer({ ...currPlayer, propic: pic })}
>
              <Avatar.Image
                key={pic}
                size={60}
                source={{ uri: `https://your-bucket/${pic}` }}
                style={currPlayer.propic === pic ? styles.selectedImage : undefined}
              />
              </TouchableHighlight>
            ))}
          </ScrollView>
        )}
        <Text style={{ color: theme.colors.primary, marginTop: 10 }}>{`${currPlayer.fname} ${currPlayer.lname}`}</Text>
      </View>

      {editMode ? (
        <View>
          <TextInput
            label="First Name"
            value={currPlayer.fname}
            onChangeText={(text) => setCurrPlayer({ ...currPlayer, fname: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Last Name"
            value={currPlayer.lname}
            onChangeText={(text) => setCurrPlayer({ ...currPlayer, lname: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Email"
            value={currPlayer.email}
            onChangeText={(text) => setCurrPlayer({ ...currPlayer, email: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Region"
            value={currPlayer.region}
            onChangeText={(text) => setCurrPlayer({ ...currPlayer, region: text })}
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleSaveChanges}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Email: {currPlayer.email}</Text>
          <Text style={styles.infoText}>Region: {currPlayer.region}</Text>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        small
        icon="pencil"
        loading={loading}
        onPress={() => setEditMode(!editMode)}
        disabled={loading}
      />

      <FAB
        style={[styles.fabTrophy, { backgroundColor: theme.colors.secondary }]}
        icon="trophy"
        label="View Trophy Room"
        onPress={() => {
          // Navigate to Trophy Room screen (implement navigation)
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fabTrophy: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  saveButton: {
    marginTop: 20,
  },
  imageSelection: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: '#00f',
  },
});

export default ProfileScreen;
