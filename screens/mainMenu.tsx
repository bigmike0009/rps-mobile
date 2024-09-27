import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from 'auth/authProvider';
import { Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Login from 'auth/login'
import SignUp from 'auth/signUp';

import { playerService,tournamentService } from 'services/playerService';
import { Player, Tournament } from 'types/types';
import { DateTime } from 'luxon';





import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import LogoutButton from 'auth/logout';
import { green100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const MainMenu: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;

  const [tournamentData, setTournamentData] = useState<Tournament | null>(null);

  const [timeUntilNextGame, setTimeUntilNextGame] = useState<string>(getTimeUntilNextGame());
  const [selected, setSelected] = useState<string>('login');
  const [registered, setRegistered] = useState(false);
  const theme = useTheme();

  const authContext = useContext(AuthContext);
  
 
  const { email, isLoggedIn, player } = authContext!

  const fetchTournament = async () => {
    const tournament = await tournamentService.getLatestTournament();
    console.log('Latest Tournament retrieved.')

    console.log(tournament)

    if (tournament.status == 200) setTournamentData(tournament.data);
  };

  const joinTournament = async () => {
    const tourneyID = tournamentData?.tournamentId!
    const response = await tournamentService.addPlayerToTournament(tourneyID, player?.playerID!, player?.region!);
    console.log('Latest Tournament retrieved.')

    console.log(response)

    if (response.status == 200) {
      setRegistered(true)
    }
    else if (response.status == 409){
      console.log('Player is already registered for this tournament')
      setRegistered(true)
    }
    else {
      console.error('Unable to register player for tournament')
    }
  };

  useEffect(() => {
    
    fetchTournament();
    const interval = setInterval(() => {
      setTimeUntilNextGame(getTimeUntilNextGame());
    }, 1000);

    return () => clearInterval(interval);
    
  }, []);




  function getTimeUntilNextGame() {
    const now = new Date();
    let nextGameTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0); // 9pm
    if (now.getHours() >= 21) {
      nextGameTime.setDate(nextGameTime.getDate() + 1);
    }

    if (tournamentData){
      const regCloseTs = tournamentData?.registrationCloseTs
  
      // Step 2: Create a Date object as if the time was in UTC
      // Use "America/New_York" to indicate Eastern Time
      const easternDate = DateTime.fromFormat(regCloseTs, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });

    // Check if the parsing was successful
    if (easternDate.isValid) {
        // Step 2: Convert the parsed Eastern DateTime to local time
        nextGameTime = easternDate.setZone(DateTime.local().zoneName).toJSDate();
        }
    else {
      console.error('Cant find next tourney data. assuming next is 9pm.')
      return ''
    }
  }
    
    const diff = nextGameTime.valueOf() - now.valueOf();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      {timeUntilNextGame ? 
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>Time until next Tournament:</Text>
        <Text style={styles.countdownTimer}>{timeUntilNextGame}</Text>
        {registered && <Text style = {{color: "green"}}>Player Registered!</Text>}
      </View> :
      <Text style={styles.countdownText}>There are currently no tournaments scheduled</Text>
}

      {isLoggedIn ? 
      <View style={styles.container}>
      <Button mode="contained" onPress={joinTournament} disabled={registered}>
      Register for Tournament
    </Button>
    
      <LogoutButton {...props}></LogoutButton>
      </View> : 
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
