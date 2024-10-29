import React, { useContext, useRef, useState } from 'react';
import { Appbar, Avatar, Button, useTheme, Text, IconButton, Portal, Dialog, Paragraph } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Easing, Linking } from 'react-native';
import { AuthContext } from 'auth/authProvider';
import { navigationTheme } from './theme';
import { useNavigationState } from '@react-navigation/native';


export const Header = () => {
  const { player } = useContext(AuthContext)!; // Get player data from AuthContext
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle for dropdown visibility
  const [messageNum, setMessageNum] = useState(0)
  const [visible, setVisible] = useState(false);

  //const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  const showAlert = () => setVisible(true);
  const hideAlert = () => setVisible(false);

  const messages = [ 
    'This is a tournament spin on the popular game rock paper scissors',
    'Every night at 9PM Eastern, there will be a worldwide tournament for a CASH prize',
    'This screen will show you a countdown until the next tournament starts',
    'All you need to do is make an account, login, and hit the register for tournament button',
    'Don\'t worry, we\'ll notify you when the tournament is getting ready to start!'
  ]

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
        <IconButton
                    style={[styles.logo, {backgroundColor: theme.colors.background}]}
                    icon="instagram"
                />
          
        </TouchableOpacity>
        <Appbar.Content
          title={`${player?.fname} ${player?.lname[0]}`}
          titleStyle={styles.title}
          theme={navigationTheme}
        />
        <TouchableOpacity onPress={() => alert('Mike still has to make a profile screen')}>
          <Avatar.Image
            size={36}
            source={require('../assets/Question.png') } // Player's profile picture
            style={styles.avatar}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={showAlert}>
        <IconButton
                    style={[styles.logo]}
                    icon="help"
                />
        </TouchableOpacity>
      </Appbar.Header>
      :
      <Appbar.Header style={styles.header} theme={navigationTheme}>
       <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/rps_shootout')}>
        <IconButton
                    style={[styles.logo, {backgroundColor: theme.colors.background}]}
                    icon="instagram"
                />
          
        </TouchableOpacity>
        <Appbar.Content
          title={`Shootout!`}
          titleStyle={styles.title}
          theme={navigationTheme}
        />
         <TouchableOpacity onPress={showAlert}>
        <IconButton
                    style={[styles.logo]}
                    icon="help"
                />
        </TouchableOpacity>
        
      </Appbar.Header>
}

 {/* Custom Alert Dialog */}
 {visible && <Portal>
          <Dialog style={{padding: 10}} visible={visible} onDismiss={hideAlert}>
            <Dialog.Title>Welcome to RPS Shootout!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
               {messages[messageNum]}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Text> {messageNum + 1}/{messages.length}</Text>
              <Button onPress={() => { if (messageNum < messages.length - 1) { setMessageNum(messageNum + 1) } else {setMessageNum(0); hideAlert();}}}>{messageNum < messages.length - 1 ? 'Next': 'Done'}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
}

{dropdownVisible && (        
  <Portal>
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
        </Portal>
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
    backgroundColor: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
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
    height: 500
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
