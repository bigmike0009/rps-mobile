import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../providers/authProvider';
import { useAssets } from '../providers/assetProvider';

import { Button, Card, FAB, IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import Login from '../auth/login'
import SignUp from '../auth/signUp';

import { tournamentService } from '../services/appServices';
import { Tournament } from '../types/types';
import { DateTime } from 'luxon';

import { View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from '../navigation/navigationTypes';
import LogoutButton from '../auth/logout';
import { ScrollView } from 'react-native-gesture-handler';
import { useTournament } from '../providers/tournamentProvider';
import FacebookButton from '../auth/facebookAuth';
import { registerForPushNotificationsAsync } from '../utilities/notificationUtils';
import { useOverlay } from '../providers/animationProvider';
import { theme } from '~/components/theme';

type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const MainMenu: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;
  const {tournament, fetchNewTournament, fetchTournament} = useTournament()
  const [legacySignUp, setLegacySignUp] = useState(false)


  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [tournamentCleanup, setTournamentCleanup] = useState(false)

  const [timeUntilNextGame, setTimeUntilNextGame] = useState<string>(getTimeUntilNextGame());
  const [selected, setSelected] = useState<string>('login');
  const [registered, setRegistered] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [background, setBackground] = useState({uri: 'https://zak-rentals.s3.us-east-1.amazonaws.com/Question.png'});


  const theme = useTheme();
  const { triggerAnimation} = useOverlay();

  // const bg = Math.floor(Math.random() * (2 - 0 + 1))
  // console.log(bg)
  // const bgImage = `../assets/rps-bracket${bg.toString()}.png`
  // console.log(bgImage)

  const authContext = useContext(AuthContext);
  
  const opacity = useRef(new Animated.Value(1)).current;

 
  const { player, getOrCreatePlayer } = authContext!

  const {retrieveAsset} = useAssets()


  const getBgImage = () => {

    let num = Math.floor(Math.random() * 3)
    
      if (num === 0){
        return {uri: retrieveAsset('rockBg')}
      }
      else if (num === 1){
        return {uri: retrieveAsset('scissorsBg')}
      }
      else {
        return {uri: retrieveAsset('paperBg')}
      }


    
  }




  const refreshTournament = async () => {
    setRefreshing(true)

    const response = await fetchNewTournament();
    console.log('Latest Tournament retrieved.')

    console.log(response)
    setTimeout(()=>setRefreshing(false), 5000)

    if (response) {return response};
    return null
  };

  const updatePageWithTournament = async () => {
    let tourneyData = refreshTournament();
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
    setRegistered(false)
    setTournamentCleanup(false)
    setTournamentStarted(false)
  }})
  }

  const joinTournament = async () => {
    const tourneyID = tournament?.tournamentId!
    const response = await tournamentService.addPlayerToTournament(tourneyID, player?.playerID!, player?.region!);
    console.log('Latest Tournament retrieved.')

    console.log(response)

    if (response.status == 200) {
      setRegistered(true)
      fetchTournament()
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
    setBackground(getBgImage())

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

  const testFunc = async () => {
    getOrCreatePlayer('Facetest', 'test@hotmail.com', 'test', 'ing', 'us-east-1', 'http://').then(
                (pdata)=>{
                if (pdata) {
    
                  console.log('Player logged in:', pdata);
    
    
                  console.log('registering player for push notifications!')
                  registerForPushNotificationsAsync(pdata)
                }
                  else
                  {
                    console.log('no player data in the database. Issue with sign up process?')
                  }
                  
    
              }).catch((err)=>{console.log(err)});
  }

  function getTimeUntilNextGame(tourney: Tournament|null = null) {
    const now = DateTime.local().setZone('America/New_York'); // Get the current time in the machine's local time, but set it to Eastern Time

    if (!tourney) {
        if (!tournament) {
            return '00:00:00';
        }
        tourney = tournament;
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

const getSurfaceRGBA = (hex: string, alpha: number = 0.85) => {
  // Convert hex to rgba
  const hexColor = hex.replace('#', '');
  const bigint = parseInt(hexColor, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Image
        source={background}
        style={styles.imageBackground}
        resizeMode="cover"
      />
      {/* Overlay for readability */}
      <View style={styles.bgOverlay} pointerEvents="none" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.centeredContainer}>
          <Card style={[
            styles.tournamentCardModern,
            {
              backgroundColor: getSurfaceRGBA(theme.colors.surface, 0.85),
              borderRadius: theme.roundness * 2,
            },
          ]}> 
            {tournament ? (
              <Text style={[styles.tournamentTitle, { color: theme.colors.primary }]}>Tournament #{tournament.tournamentId}</Text>
            ) : (
              <Text style={[styles.tournamentTitle, { color: theme.colors.onSurfaceVariant }]}>No tournaments scheduled</Text>
            )}
            {tournamentStarted && !tournamentCleanup && (
              <Text style={[styles.tournamentStatus, { color: theme.colors.primary }]}>Tournament in progress...</Text>
            )}
            {(tournament && timeUntilNextGame && !tournamentStarted && !tournamentCleanup) && (
              <View style={styles.countdownContainerModern}>
                <Text style={[styles.countdownLabel, { color: theme.colors.outline }]}>Time until next Tournament:</Text>
                <Text style={[styles.countdownTimerModern, { color: theme.colors.primary }]}>{timeUntilNextGame}</Text>
                {registered && <Text style={{ color: 'green', textAlign: 'center', marginTop: 4 }}>Player Registered!</Text>}
                {player && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={[styles.countdownLabel, { color: theme.colors.outline }]}># Players: {tournament.numPlayersRegistered}</Text>
                    {tournament.cash && tournament.cash > 0 && (
                      <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Cash Prize:</Text>
                        <Text style={{ color: 'green', fontSize: 40, fontWeight: 'bold' }}>${tournament.cash}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
            {player && (
              <IconButton
                style={styles.refreshButtonModern}
                icon="refresh"
                loading={refreshing}
                disabled={refreshing || !player}
                onPress={updatePageWithTournament}
                size={28}
              />
            )}
            {tournamentCleanup && (
              <Text style={[styles.tournamentStatus, { color: theme.colors.primary, fontSize: 15 }]}>Updating record books from today’s tournament...</Text>
            )}
          </Card>
        </View>

        {/* Modernized Button Section */}
        {player && (
          <View style={styles.lowerButtonsModern}>
            {tournamentStarted && !tournamentCleanup && (
              <Animated.View style={{ opacity: player ? opacity : 1, width: '100%' }}>
                <FAB
                  style={styles.fabOutlined}
                  label={registered ? 'Join Tournament' : 'View Tournament'}
                  disabled={!player}
                  onPress={() => tournament?.roundActiveFlag ? navigation.replace('SpectatorScreen', { tournament }) : navigation.replace('WaitingScreen')}
                  color={'white'}
                />
              </Animated.View>
            )}
            <FAB
              label="Register for Tournament"
              style={styles.fabOutlined}
              onPress={joinTournament}
              disabled={!tournament || registered || tournamentStarted || tournamentCleanup}
              color={'white'}
            />
            <FAB
              label="Trophy Room"
              style={styles.fabOutlined}
              onPress={() => navigation.replace('TrophyRoom')}
              color={'white'}
            />
          </View>
        )}

        {/* Modernized Login/Signup Section */}
        {!player && !legacySignUp && (
          <View style={styles.authModernContainer}>
            <Card style={[
              styles.authModernCard,
              { backgroundColor: getSurfaceRGBA(theme.colors.surface, 0.85), borderRadius: theme.roundness * 2 },
            ]}> 
              <FacebookButton />
              <FAB
                label="Test Screen"
                style={styles.fabOutlined}
                onPress={() => navigation.replace('TestScreen')}
                color={'white'}
              />
              <FAB
                label="Legacy Sign In"
                style={styles.fabOutlined}
                onPress={() => setLegacySignUp(true)}
                color={'white'}
              />
            </Card>
          </View>
        )}
        {!player && legacySignUp && (
          <KeyboardAvoidingView
            style={styles.authModernContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Card style={[
              styles.authModernCard,
              { backgroundColor: getSurfaceRGBA(theme.colors.surface, 0.85), borderRadius: theme.roundness * 2 },
            ]}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                  {selected === 'login' ? <Login {...props} /> : <SignUp {...props} />}
                </View>
              </ScrollView>
              <FAB
                icon="undo"
                style={[styles.fabOutlined, { width: 56, alignSelf: 'flex-start', marginTop: 8 }]}
                onPress={() => setLegacySignUp(false)}
                color={'white'}
              />
              <SegmentedButtons
                value={selected}
                onValueChange={setSelected}
                buttons={[
                  { value: 'login', label: 'Login', style: selected === 'login' ? { backgroundColor: theme.colors.primary } : {} },
                  { value: 'signup', label: 'Sign Up', style: selected === 'signup' ? { backgroundColor: theme.colors.primary } : {} },
                ]}
                style={styles.toggleButtons}
              />
            </Card>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'space-between',
      borderWidth: 1
  },
  imageBackground: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: '90%',
    height: '80%',
    zIndex: 0,
    opacity: 0.18, // More subtle
    borderRadius: 5,
    borderWidth: 0,
    overflow: 'hidden',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 1,
  },
  centeredContainer: {
    opacity: 0.8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
    zIndex: 2,
  },
  tournamentCardModern: {
    width: '92%',
    alignSelf: 'center',
    padding: 24,
    marginVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  tournamentTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  tournamentStatus: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  countdownContainerModern: {
    marginTop: 12,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },
  countdownTimerModern: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: 1,
  },
  refreshButtonModern: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 10,
    borderRadius: 24,
  },
  lowerButtonsModern: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  fabOutlined: {
    backgroundColor: 'transparent',
    
    borderWidth: 2,
    borderColor: theme.colors.primary, // Use theme color, not hardcoded
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
    marginVertical: 8,
    width: '100%',
  },
  authModernContainer: {
    opacity: .8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    zIndex: 2,
  },
  authModernCard: {
    width: 340,
    maxWidth: '95%',
    alignSelf: 'center',
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
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

