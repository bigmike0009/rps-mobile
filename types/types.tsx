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
    currentRoundEndTs: string; // Timestamp
    currentRoundId: string;
    currentRoundStartTs: string; // Timestamp
    numPlayersRegistered: number;
    playersRemaining: number;
    registrationCloseTs: string; // Timestamp
    registrationOpenTs: string;  // Timestamp
    rounds: number[];            // Array of round IDs
    roundActiveFlag: boolean
    matchupTablesByRound: Record<number, string[]>;
    completeFlag: boolean;
    cash: number;
  }

  export interface Matchup {
    matchupID: number;
    player_1_choice:string;
    player_1_id:number;
    player_2_choice:string;
    player_2_id:number;
    winner:number;
    table:string;
    
  }

  export interface MatchupDetail {
    matchupID: number;
    player_1_choice:string;
    player_1_id:number;
    player_2_choice:string;
    player_2_id:number;
    winner:number;
    table:string;
    player_1_data:Player;
    player_2_data:Player;
    
  }