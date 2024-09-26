import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from 'auth/authProvider';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import Login from 'auth/login'
import SignUp from 'auth/signUp';



import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import LogoutButton from 'auth/logout';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const MainMenu: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;

  const [timeUntilNextGame, setTimeUntilNextGame] = useState<string>(getTimeUntilNextGame());
  const [selected, setSelected] = useState<string>('login');
  const theme = useTheme();

  const authContext = useContext(AuthContext);
  
 
  const { email, isLoggedIn } = authContext!



  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNextGame(getTimeUntilNextGame());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getTimeUntilNextGame() {
    const now = new Date();
    const nextGameTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0); // 9pm
    if (now.getHours() >= 21) {
      nextGameTime.setDate(nextGameTime.getDate() + 1);
    }
    const diff = nextGameTime.valueOf() - now.valueOf();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rock Paper Scissors</Text>
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>Time until next game:</Text>
        <Text style={styles.countdownTimer}>{timeUntilNextGame}</Text>
      </View>

      {isLoggedIn ? 
      <LogoutButton {...props}></LogoutButton> : 
      (
        <View style={styles.container}>
          {/* Horizontal Toggle Button */}
         
    
          {/* Conditionally render Login or SignUp based on toggle */}
          <View style={styles.formContainer}>
            {selected === 'login' ? <Login {...props} /> : <SignUp {...props} />}
          </View>

          <SegmentedButtons
            value={selected}
            onValueChange={setSelected}
            buttons={[
              {
                value: 'login',
                label: 'Login',
                style: selected === 'login' ? styles.activeButton : {},
              },
              {
                value: 'signup',
                label: 'Sign Up',
                style: selected === 'signup' ? styles.activeButton : {},
              },
            ]}
            style={styles.toggleButtons}
          />
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 16,
    marginBottom: 5,
  },
  countdownTimer: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4267B2', // Facebook blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButtons: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  activeButton: {
    backgroundColor: '#6200ee', // Customize active button color based on your theme
  }
});

export default MainMenu;
