import { DateTime } from "luxon";
import * as Device from 'expo-device';


export default function getSecondsUntilRoundEnd(ts: string) {
    let now = DateTime.now()
    // Step 2: Create a Date object as if the time was in UTC
    // Use "America/New_York" to indicate Eastern Time
    const easternDate = DateTime.fromFormat(ts, 'MM-dd-yyyy:HH:mm:ss', { zone: 'America/New_York' });


  // Check if the parsing was successful
    if (easternDate.isValid) {

        // Step 2: Convert the parsed Eastern DateTime to local time
        let nextGameTime = easternDate.setZone(DateTime.local().zoneName).toJSDate();


        const diff = nextGameTime.valueOf() - now.valueOf();
        
        const seconds = Math.floor(diff / 1000);

        

        return seconds < 0 ? 0 : seconds
        
      }
      return 0
  }

  export const cleverPhrases = [
    "Polishing the rocks",
    "Picking him up at Kevin Hart's house",
    "Sharpening the scissors",
    "Stealing from the library printer",
    "Taking the safety off (the scissors)",
    "Getting this paper",
    "Chopping it up",
    "Switching from Alternative to Classic",
    "Simone Biles wants a picture with Rocco",
    "Having a Scissophrenic episode",
    "Contacting David Wallace",
    "Signing a supermax with Staples"
  ];


export async function getDeviceId() {
  // Check if the device has a unique ID available
  const deviceId = Device.osInternalBuildId ?? Device.modelId;

  if (!deviceId) {
    console.warn('Device ID not available on this platform.');
    return null;
  }

  console.log('Device ID:', deviceId);
  return deviceId;
}

export const formatDate = (timestamp: string) => {
  const [date, time] = timestamp.split(':'); // Split into date and time
  const [month, day, year] = date.split('-'); // Extract month, day, year

  // Construct a readable format: "November 21, 2024"
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

