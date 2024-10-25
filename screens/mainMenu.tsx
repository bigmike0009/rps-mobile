import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from 'auth/authProvider';
import { Button, Card, FAB, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import Login from 'auth/login'
import SignUp from 'auth/signUp';

import { tournamentService } from 'services/playerService';
import { Tournament } from 'types/types';
import { DateTime } from 'luxon';

import { View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import LogoutButton from 'auth/logout';
import { ScrollView } from 'react-native-gesture-handler';
import { getRandomBytes } from 'expo-random';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const MainMenu: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;

  const [tournamentData, setTournamentData] = useState<Tournament | null>(null);
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [tournamentCleanup, setTournamentCleanup] = useState(false)


  const [timeUntilNextGame, setTimeUntilNextGame] = useState<string>(getTimeUntilNextGame());
  const [selected, setSelected] = useState<string>('login');
  const [registered, setRegistered] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  // const bg = Math.floor(Math.random() * (2 - 0 + 1))
  // console.log(bg)
  // const bgImage = `../assets/rps-bracket${bg.toString()}.png`
  // console.log(bgImage)

  const authContext = useContext(AuthContext);
  const opacity = useRef(new Animated.Value(1)).current;

 
  const { email, isLoggedIn, player } = authContext!

  const fetchTournament = async () => {
    setRefreshing(true)
    const tournament = await tournamentService.getLatestTournament();
    console.log('Latest Tournament retrieved.')

    console.log(tournament)
    setRefreshing(false)

    if (tournament.status == 200) {setTournamentData(tournament.data); return tournament.data};
    setTournamentData(null)
    return null
  };

  const updatePageWithTournament = async () => {
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
          //if (isLoggedIn) {navigation.replace('WaitingScreen')}
          setTournamentStarted(true)
          clearInterval(interval)
        }
        setTimeUntilNextGame(countdown)
      
      }, 1000);
  
      return () => clearInterval(interval);
    }}
  else {
    setTournamentData(null)
    setRegistered(false)
    setTournamentCleanup(false)
    setTournamentStarted(false)
  }})
  }

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
    
    updatePageWithTournament()
    
  }, []);

  useEffect(() => {
    // Only run animation if the FAB is enabled
    if (tournamentStarted) {
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      blink.start();

      // Clean up the animation on unmount
      return () => {
        blink.stop();
      };
    }
  }, [tournamentStarted]);


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
  <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
    <Image
        source={require(`../assets/rps-bracket0.png`)} 
        style={styles.imageBackground} 
        resizeMode="cover" 
    />
        <View style={[styles.tournamentContainer, { backgroundColor: theme.colors.surface, borderRadius: theme.roundness, }]}>
            {tournamentData ? <Text style={[styles.countdownTimer, { color: theme.colors.onBackground, textAlign:'center' }]}>
                    Tournament #{tournamentData.tournamentId}
                </Text>
            : (
                <Text style={[styles.countdownTimer, { color: theme.colors.onBackground, fontSize: 15, margin: 10 }]}>
                    No tournaments scheduled
                </Text>
            )}
            {tournamentStarted && !tournamentCleanup && 
                    <Text style={[styles.countdownText, { color: theme.colors.primary }]}>
                      Tournament in progress...
                    </Text>}
            {/* Tournament Information */}
            {(tournamentData && timeUntilNextGame && !tournamentStarted && !tournamentCleanup) && (
                <Card style={[styles.tournamentCard, {backgroundColor: theme.colors.background}]}>
                    <View style={[styles.countdownContainer, { borderRadius: theme.roundness }]}>
                        <Text style={[styles.countdownText, { color: theme.colors.outline }]}>
                            Time until next Tournament:
                        </Text>
                        <Text style={[styles.countdownTimer, { color: theme.colors.primary }]}>
                            {timeUntilNextGame}
                        </Text>
                        {registered && <Text style={{ color: 'green', textAlign: 'center' }}>Player Registered!</Text>}
                    </View>
                    {isLoggedIn && (
                        <View>
                            <Text style={[styles.countdownText, { color: theme.colors.outline }]}>
                                # Players: {tournamentData.numPlayersRegistered}
                            </Text>
                            <Text style={{ marginTop: 25, color: theme.colors.onSurface }}>Cash Prize:</Text>
                            <Text style={{ color: 'green', fontSize: 48 }}>$--</Text>
                        </View>
                    )}
                    
                </Card>
            )}

            {/* FAB Button to Refresh Tournament */}
            {isLoggedIn && (
                <IconButton
                    style={styles.refreshButton}
                    icon="refresh"
                    loading={refreshing}
                    disabled={refreshing || !isLoggedIn}
                    onPress={updatePageWithTournament}
                />
            )}

            {/* Tournament Status */}

            {/* Tournament Cleanup */}
            {tournamentCleanup && (
                <Text style={[styles.countdownTimer, { color: theme.colors.primary, fontSize: 15 }]}>
                    Updating record books from today’s tournament...
                </Text>
            )}

            {/* No Tournament Scheduled */}
            

        </View>

        {/* Buttons Section: Now a Separate Lower Container */}
        {isLoggedIn && (
            <View style={[styles.lowerButtonsContainer, {      backgroundColor: theme.colors.surface}]}>
              {tournamentStarted && !tournamentCleanup && (
              
                
      <Animated.View style={{ opacity: isLoggedIn ? opacity : 1 }}>
        <FAB
          style={[
            styles.fabButton,
            {
              backgroundColor: isLoggedIn
                ? theme.colors.primary
                : theme.colors.surfaceDisabled, // Gray when disabled
            },
          ]}
          disabled={!isLoggedIn}
          onPress={() => navigation.replace('WaitingScreen')}
          label={registered ? 'Join Tournament' : 'View Tournament'}
        />
      </Animated.View>
          
              )}
                <FAB
                    label="Register for Tournament"
                    onPress={joinTournament}
                    disabled={!tournamentData || registered || tournamentStarted || tournamentCleanup}
                    style={styles.fabButton}
                />
                <LogoutButton {...props} />
            </View>
        )}

        {/* Login/Signup Box */}
        {!isLoggedIn && (
            <KeyboardAvoidingView
                style={[styles.authContainer, { backgroundColor: theme.colors.backdrop }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        {selected === 'login' ? <Login {...props} /> : <SignUp {...props} />}
                    </View>
                </ScrollView>
                <SegmentedButtons
                    value={selected}
                    onValueChange={setSelected}
                    buttons={[
                        { value: 'login', label: 'Login', style: selected === 'login' ? { backgroundColor: theme.colors.primary} : {} },
                        { value: 'signup', label: 'Sign Up', style: selected === 'signup' ? { backgroundColor: theme.colors.primary} : {} },
                    ]}
                    style={styles.toggleButtons}
                />
            </KeyboardAvoidingView>
        )}
</View>
);
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'space-between',
  },
  imageBackground: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: -10,
      opacity: 0.5,
      objectFit: 'contain',
  },
  tournamentContainer: {
      alignItems: 'flex-start',
      padding: 10,
      marginTop: 10,
      opacity: 0.95,
      marginHorizontal: 5
  },
  tournamentCard: {
      padding: 10,
      margin: 10,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  countdownContainer: {
      padding: 10,
  },
  countdownText: {
      fontSize: 16,
      textAlign: 'center'
  },
  countdownTimer: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  fabButton: {
      margin: 10,
  },
  refreshButton: {
    margin: 0,
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: .7,

    zIndex: 10
},
  lowerButtonsContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
  },
  authContainer: {
      padding: 20,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      
  },
  scrollContainer: {
      padding: 20,
  },
  formContainer: {
      padding: 20,
  },
  toggleButtons: {
      marginVertical: 10,
  },
});

export default MainMenu;

