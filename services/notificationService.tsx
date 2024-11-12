import * as Notifications from 'expo-notifications';

// Function to request permissions and get a push token
export async function registerForPushNotificationsAsync() {
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
  await sendTokenToBackend(token);

  return token;
}

async function sendTokenToBackend(token: string) {
  // Logic to save the token in your backend, if necessary
}