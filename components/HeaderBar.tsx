import React, {useContext} from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Player } from 'types/types';
import { AuthContext } from 'auth/authProvider';
import { navigationTheme, theme } from './theme';


export const Header = () => {
  //const navigation = useNavigation();

  const authContext = useContext(AuthContext);
  
 
  const { player } = authContext!

  return (
    <View>
        {player ? 
    <Appbar.Header style={styles.header} theme={navigationTheme}>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/rps_shootout')}>
      <Image
          source={require('../assets/Title-logo.png')} // Your logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Appbar.Content
        title={`${player?.fname} ${player?.lname}`}
        titleStyle={styles.title}
        theme={navigationTheme}
      />
      <TouchableOpacity >
        <Avatar.Image
          size={40}
          source={
            require('../assets/Question.png')  // Fallback to stock image
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
    </Appbar.Header>
    : 
    <Appbar.Header style={styles.header}>
      <TouchableOpacity onPress={() => Linking.openURL('https://google.com')}>
      <Image
          source={require('../assets/Title-logo.png')} // Your logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
        
      <Appbar.Content
        title={`Shootout!`}
        titleStyle={styles.title}
      />
      
    </Appbar.Header>
    }
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 1 // Set a background color if needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    marginRight: 15,
  },
  logo: {
    backgroundColor: theme.colors.surface,
    width: 40,
    height: 40
  },
});

export default Header;
