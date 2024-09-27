import React, {useContext} from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Player } from 'types/types';
import { AuthContext } from 'auth/authProvider';


export const Header = () => {
  //const navigation = useNavigation();

  const authContext = useContext(AuthContext);
  
 
  const { player } = authContext!

  return (
    <View>
        {player ? 
    <Appbar.Header style={styles.header}>
        
      <Appbar.Content
        title={`${player?.fname} ${player?.lname}`}
        titleStyle={styles.title}
      />
      <TouchableOpacity >
        <Avatar.Image
          size={40}
          source={
            player?.propic
              ? { uri: player.propic }
              : require('../assets/icon.png')  // Fallback to stock image
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
    </Appbar.Header>
    : 
    <Appbar.Header style={styles.header}>
        
      <Appbar.Content
        title={`Rock-etology`}
        titleStyle={styles.title}
      />
      
    </Appbar.Header>
    }
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', // Set a background color if needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    marginRight: 15,
  },
});

export default Header;
