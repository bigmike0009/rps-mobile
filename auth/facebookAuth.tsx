import { useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { FAB, Text, useTheme } from 'react-native-paper';
import { AuthContext } from './authProvider'
import { playerService } from 'services/appServices';
import { registerForPushNotificationsAsync } from 'utilities/notificationUtils';
import { FontAwesome } from '@expo/vector-icons'; // Icon library for the Facebook "f"
import { View } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

export default function FacebookButton() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '1119639173020972',
    scopes: ['public_profile', 'email'],

  });

  const [mess, setMess] = useState('Nunya')


  const { colors } = useTheme();
  const authContext = useContext(AuthContext);
  
  let { setUser, checkUser, player, handleLogout } = authContext!;

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      (async () => {
        try {
          setMess('fetching from facebook')
          const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${response.authentication?.accessToken}&fields=id,name,email,picture.type(large)`)
          setMess('fetched from facebook')

          const userInfo = await userInfoResponse.json();
          setMess(userInfo)


          const { id: facebookID, name, picture, email } = userInfo;
          const [firstName, ...lastNameParts] = name.split(' ');
          const lastName = lastNameParts.join(' ');

          // Create or retrieve player data from your API
          const player = playerService.getOrCreatePlayer('F' + facebookID, email.toLowerCase(), firstName, lastName, 'us-east-1', picture.data.url).then((pdata)=>{setMess('gotPdata')
            if (pdata) {
              console.log('Player logged in:', player);
              setUser(`F${facebookID}`).then((playerData)=>{
                          if (playerData) {
                            console.log('registering player for push notifications!')
                            registerForPushNotificationsAsync(playerData)
                          }
                          else
                          {
                            console.log('no player data in the database. Issue with sign up process?')
                            handleLogout()
                          }})
              }

          }).catch((err)=>{setMess('err')});
          

        } catch (error) {
          console.error('Error fetching or updating player data:', error);
          
        }
      })();
    }
  }, [response]);

  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== 'success') {
      alert('Something went wrong with Facebook login.');
    }
  };

  return (
    <View>
      <Text>{response?.type}</Text>
      {response?.type === 'success' && response.authentication && <View>
        <Text>Player: {player?.playerID}</Text>
        <Text>Url: {response.url}</Text>
        <Text>Params 0: {response.params[0]}</Text>
        <Text>Error: {response.error?.description}</Text>
        <Text>Access token: {response.authentication.accessToken}</Text>
        <Text>Mess: {mess}</Text>
        </View>}
      
      <FAB
      style={{
        margin: 10,
        paddingHorizontal: 20,
        backgroundColor: '#1877F2', // Facebook blue
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
      }}
      label="Sign in with Facebook"
      icon={() => <FontAwesome name="facebook" size={24} color="white" />}
      onPress={handlePressAsync}
      uppercase={false} // Match Facebook's button text style
    />
    </View>
  );
}
