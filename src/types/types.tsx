// Player object type
export interface Player {
    playerID: string;
    email: string;
    fname: string;
    lname: string;
    propic?: string;
    real: boolean;
    region: string;
    avatars: {'r':string, 'p': string, 's': string}
    stats?: PlayerStats; // Array of tournament IDs
    tournaments?: PlayerTournaments,
    tokenInfo?: TokenInfo;     // Array of tournament IDs
    unlocked?: PlayerUnlocks
    
  }

  export interface PlayerStats {
    wins: number,
    losses: number,
    ties: number,
    rocksThrown: number,
    papersThrown: number,
    scissorsThrown: number,

  }

  export interface TokenInfo {
    notifToken: string,
    deviceID: string

  }

  export interface PlayerTournaments {
    played: number[],
    trophies: Trophy[];

  }

  type Trophy = {
    tournamentId: number;
    placement: string;
  };
  

  export interface PlayerUnlocks {
    bonusLives: number,
    avatars: string[]
  }
  
  // Tournament object type
  export interface Tournament {
    tournamentId: number;
    activeFlag: boolean; // is this the active tournament?
    currentRoundEndTs: string; // Timestamp
    currentRoundId: string;
    currentRoundStartTs: string; // Timestamp
    numPlayersRegistered: number;
    remainingPlayers: number;
    registrationCloseTs: string; // Timestamp
    registrationOpenTs: string;  // Timestamp
    roundActiveFlag: boolean; //are players actively submitting selections
    roundCleaningFlag: boolean; // is a round currently waiting for the cleanup process to complete
    completeFlag: boolean; //does the tournament have a winner? If this is active and the tournament is still active then we're waiting for the cleanup process
    cash: number;
    activeCountByRegion: Record<string, number>;
    last_updated_ts: string;
    queueProcessing: boolean;
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

  export interface UnlockRequirement {
    unlockType: 'pay' | 'amount' | 'percentage';
    field : string;
    amount : number;
  }

  export interface Avatar {
    name: string;
    image : string;
    type : string;
    unlockRequirement: UnlockRequirement
  }

  export interface UnlockProgress {
    unlockable: boolean;
    progressBarDisplay : string;
    progressBarValue : number;
    unlockMessage: string
  }