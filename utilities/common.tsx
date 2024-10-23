import { DateTime } from "luxon";

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