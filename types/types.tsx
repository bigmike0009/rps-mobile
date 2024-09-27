// Player object type
export interface Player {
    playerID: string;
    email: string;
    facebookID?: string;
    fname: string;
    lname: string;
    propic?: string;
    real: boolean;
    region: string;
    tourneys: string[]; // Array of tournament IDs
    wins: string[];     // Array of tournament IDs
  }
  
  // Tournament object type
  export interface Tournament {
    TournamentID: string;
    activeFlag: boolean;
    completeFlag: boolean;
    currentRoundEndTs: string; // Timestamp
    currentRoundId: string;
    currentRoundStartTs: string; // Timestamp
    numPlayersRegistered: number;
    playersRemaining: number;
    registrationCloseTs: string; // Timestamp
    registrationOpenTs: string;  // Timestamp
    rounds: string[];            // Array of round IDs
  }
  