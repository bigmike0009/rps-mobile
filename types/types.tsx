// Player object type
export interface Player {
    playerID: number;
    email: string;
    facebookID?: string;
    fname: string;
    lname: string;
    propic?: string;
    real: boolean;
    region: string;
    tourneys: number[]; // Array of tournament IDs
    wins: number[];     // Array of tournament IDs
  }
  
  // Tournament object type
  export interface Tournament {
    tournamentId: number;
    activeFlag: boolean;
    completeFlag: boolean;
    currentRoundEndTs: string; // Timestamp
    currentRoundId: string;
    currentRoundStartTs: string; // Timestamp
    numPlayersRegistered: number;
    playersRemaining: number;
    registrationCloseTs: string; // Timestamp
    registrationOpenTs: string;  // Timestamp
    rounds: number[];            // Array of round IDs
  }
  