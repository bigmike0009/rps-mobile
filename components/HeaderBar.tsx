import React, { useContext, useRef, useState } from 'react';
import { Appbar, Avatar, Button, useTheme, Text, IconButton, Portal, Dialog, Paragraph } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Easing, Linking,   Modal,
  TouchableWithoutFeedback, } from 'react-native';
import { AuthContext } from 'providers/authProvider';
import { useAssets } from 'providers/assetProvider';
import { navigationTheme } from './theme';
import DropdownMenu from './dropDown';

type HeaderProps = {
  currentRoute: string;
};


export const Header: React.FC<HeaderProps> = ({ currentRoute }) => {
  const { player } = useContext(AuthContext)!; // Get player data from AuthContext
  const {retrieveAsset} = useAssets()

  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle for dropdown visibility
  const [messageNum, setMessageNum] = useState(0)
  const [visible, setVisible] = useState(false);

  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const closeMenu = () => setMenuVisible(false);

  //const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  const showAlert = () => setVisible(true);
  const hideAlert = () => setVisible(false);


  const getMessages = (route: string) =>{
    if (route === 'MainMenu'){
      return [ 
        'This is a tournament spin on the popular game rock paper scissors',
        'Every night at 9PM Eastern, there will be a worldwide tournament for a CASH prize',
        'This screen will show you a countdown until the next tournament starts',
        'All you need to do is make an account, login, and hit the register for tournament button',
        'Don\'t worry, we\'ll notify you when the tournament is getting ready to start!'
      ]
    }
    else {
      return ['How many times are you going to press the help button in a rock paper scissors game?', currentRoute]
    }
  }

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
        {!['RockPaperScissors', 'ResultsScreen', 'FinalResultsScreen', 'WaitingScreen'].includes(currentRoute) && <TouchableOpacity onPress={toggleMenu}>
          <Avatar.Image
            size={36}
            source={player.propic? {uri: player.propic} : {uri: retrieveAsset('Question')} } // Player's profile picture
            style={styles.avatar}
          />
        </TouchableOpacity>}
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
         <TouchableOpacity onPress={() => showAlert()}>
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
               {getMessages(currentRoute)[messageNum]}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Text> {messageNum + 1}/{getMessages(currentRoute).length}</Text>
              <Button onPress={() => { if (messageNum < getMessages(currentRoute).length - 1) { setMessageNum(messageNum + 1) } else {setMessageNum(0); hideAlert();}}}>{messageNum < getMessages(currentRoute).length - 1 ? 'Next': 'Done'}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
}
{player &&
<DropdownMenu isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} player={player} />
}
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
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white'
  },
  returnButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 130, // Adjust for header height
  },
  dropdownMenu: {
    width: '90%',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginRight: 10,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Header;

// {dropdownVisible && (        
//   <Portal>
//   <Animated.View
//           style={[
//             styles.dropdownContainer,
//             {
//               height: dropdownAnim.interpolate({
//                 inputRange: [0, 0.6],
//                 outputRange: [0, 0.6],
//               }),
//               backgroundColor: theme.colors.surface,
//             },
//           ]}
//         >
//           <Text style={styles.infoText}>First Name: {player?.fname}</Text>
//           <Text style={styles.infoText}>Last Name: {player?.lname}</Text>
//           <Text style={styles.infoText}>Email: {player?.email}</Text>
//           <Text style={styles.infoText}>Region: {player?.region}</Text>
//           <Button
//             mode="contained"
//             onPress={handleToggleDropdown}
//             style={styles.returnButton}
//             theme={navigationTheme}
//           >
//             Return
//           </Button>
//         </Animated.View>
//         </Portal>
// )}
