import * as Notifications from 'expo-notifications';
import { tokenService } from '~/services/appServices';
import { Player } from '~/types/types';
import { getDeviceId } from '~/utilities/common';

// Function to request permissions and get a push token
export async function registerForPushNotificationsAsync(player: Player) {
  // Request permissions directly through expo-notifications
  const { status } = await Notifications.requestPermissionsAsync();
  
  // Check if the permission is granted
  if (status !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Get the Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);

  // Send the token to your backend (if you have one)
  await sendTokenToBackend(player.playerID, token);

  return token;
}

async function sendTokenToBackend(playerID: string, token: string) {
  // Logic to save the token in your backend, if necessary
  const deviceID = getDeviceId()
  deviceID.catch(
    (err)=>alert(err)
  ).then(
    (deviceID: string) => {
    tokenService.updateTokenForPlayer(playerID, token, deviceID);
    console.log(`Token succesfully pushed for player ${playerID}`)
  }
)
}