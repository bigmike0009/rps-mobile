import React, { useContext, useRef, useState } from 'react';
import { Appbar, Avatar, Button, useTheme, Text } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Easing, Linking } from 'react-native';
import { AuthContext } from 'auth/authProvider';
import { navigationTheme } from './theme';

export const Header = () => {
  const { player } = useContext(AuthContext)!; // Get player data from AuthContext
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle for dropdown visibility
  const dropdownAnim = useRef(new Animated.Value(0)).current; // Animation value for dropdown height
  const theme = useTheme();

  const handleToggleDropdown = () => {
    if (dropdownVisible) {
      // Collapse the dropdown
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => setDropdownVisible(false));
    } else {
      // Expand the dropdown
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 0.6, // Set the dropdown to cover 60% of the screen
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View>
      {player ? 
      <Appbar.Header style={styles.header} theme={navigationTheme}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/rps_shootout')}>
          <Image
            source={require('../assets/Title-logo.png')} // Your logo image
            style={[styles.logo, { backgroundColor: theme.colors.surface}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Appbar.Content
          title={`${player?.fname} ${player?.lname[0]}`}
          titleStyle={styles.title}
          theme={navigationTheme}
        />
        <TouchableOpacity onPress={handleToggleDropdown}>
          <Avatar.Image
            size={40}
            source={{ uri: `https://your-bucket/${player?.propic}` }} // Player's profile picture
            style={styles.avatar}
          />
        </TouchableOpacity>
      </Appbar.Header>
      :
      <Appbar.Header style={styles.header} theme={navigationTheme}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/rps_shootout')}>
          <Image
            source={require('../assets/Title-logo.png')} // Your logo image
            style={[styles.logo, { backgroundColor: theme.colors.surface}]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Appbar.Content
          title={`Shootout!`}
          titleStyle={styles.title}
          theme={navigationTheme}
        />
        
      </Appbar.Header>
}

      {dropdownVisible && (
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              height: dropdownAnim.interpolate({
                inputRange: [0, 0.6],
                outputRange: [0, 0.6],
              }),
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text style={styles.infoText}>First Name: {player?.fname}</Text>
          <Text style={styles.infoText}>Last Name: {player?.lname}</Text>
          <Text style={styles.infoText}>Email: {player?.email}</Text>
          <Text style={styles.infoText}>Region: {player?.region}</Text>
          <Button
            mode="contained"
            onPress={handleToggleDropdown}
            style={styles.returnButton}
            theme={navigationTheme}
          >
            Return
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    marginRight: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 70, // Position dropdown below the header
    left: 0,
    right: 0,
    overflow: 'hidden', // Hide overflow for clean animation
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white'
  },
  returnButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Header;
