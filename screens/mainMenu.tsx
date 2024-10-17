import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from 'auth/authProvider';
import { Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Login from 'auth/login'
import SignUp from 'auth/signUp';

import { tournamentService } from 'services/playerService';
import { Tournament } from 'types/types';
import { DateTime } from 'luxon';

import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import LogoutButton from 'auth/logout';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const MainMenu: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;

  const [tournamentData, setTournamentData] = useState<Tournament | null>(null);
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [tournamentCleanup, setTournamentCleanup] = useState(false)


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

    if (tournament.status == 200) {setTournamentData(tournament.data); return tournament.data};
    return null
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
    
    let tourneyData = fetchTournament();
    tourneyData.then((tourney)=>{
      if (tourney) {
        if (tourney.completeFlag){
          setTournamentCleanup(true)
        }
        else {
      const interval = setInterval(() => {
        let countdown = getTimeUntilNextGame(tourney=tourney)

        if (countdown === '00:00:00'){
          console.log('tourney TIME')
          if (isLoggedIn) {navigation.replace('WaitingScreen')}
          setTournamentStarted(true)
          clearInterval(interval)
        }
        setTimeUntilNextGame(countdown)
      
      }, 1000);
  
      return () => clearInterval(interval);
    }}})
    
    
  }, []);




  function getTimeUntilNextGame(tourney: Tournament|null = null) {
    const now = DateTime.local().setZone('America/New_York'); // Get the current time in the machine's local time, but set it to Eastern Time

    if (!tourney) {
        if (!tournamentData) {
            return '00:00:00';
        }
        tourney = tournamentData;
    }

    const regCloseTs = tourney?.registrationCloseTs;

    // Step 1: Create a DateTime object using the input timestamp, assuming it's in Eastern Time
    const easternDate = DateTime.fromFormat(regCloseTs, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });

    // Step 2: Check if the parsing was successful
    if (easternDate.isValid) {
        // Now that both timestamps are in Eastern Time, calculate the difference
        const diff = easternDate.diff(now, ['hours', 'minutes', 'seconds']).toObject();

        if (easternDate <= now) {
            return '00:00:00'; // If the registration has already closed
        }

        // Format hours, minutes, and seconds with leading zeros
        const hours = Math.floor(diff.hours || 0).toString().padStart(2, '0');
        const minutes = Math.floor(diff.minutes || 0).toString().padStart(2, '0');
        const seconds = Math.floor(diff.seconds || 0).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    console.error('Cannot parse next tournament registration close timestamp. Assuming next is 9 PM.');
    return '00:00:00';
}

  return (
    <View style={styles.container}>
      {(tournamentData && timeUntilNextGame && !tournamentStarted && !tournamentCleanup) && 
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>Time until next Tournament:</Text>
        <Text style={styles.countdownTimer}>{timeUntilNextGame}</Text>
        {registered && <Text style = {{color: "green"}}>Player Registered!</Text>}
        
      </View>
      }
      {tournamentStarted && !tournamentCleanup && <View style={styles.container}>
        <Text style={styles.countdownTimer}>Tournament in progress</Text>
        <Button mode="contained" disabled={!isLoggedIn} onPress={() => navigation.replace('WaitingScreen')}>
        {registered ? "Join Tournament" : "View Tournament"}
      </Button>
      </View>} 
      {tournamentCleanup && <Text style={styles.countdownTimer}>Updating record books from today's tournament...</Text>}
      {!tournamentData && <Text style={styles.countdownTimer}>No tournaments scheduled</Text>}


      {isLoggedIn ? 
      <View style={styles.container}>
      <Button mode="contained" onPress={joinTournament} disabled={registered || tournamentStarted || tournamentCleanup}>
      Register for Tournament
    </Button>
    
      <LogoutButton {...props}></LogoutButton>
      {/* <Button mode="contained" disabled={!isLoggedIn} onPress={() => navigation.replace('RockPaperScissors', {tournament: tournamentData!, matchup: null})}>
        Test the Rock Paper Scissors Game
      </Button> */}
      
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
    padding: 5
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
