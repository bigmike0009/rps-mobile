import { Player, PlayerStats, PlayerTournaments, PlayerUnlocks, TokenInfo } from "types/types";

export function extractBasePlayerData(data: any, playerId: string): Player | null {
    if (data.sk === `base#data`) {


      const pdata = {
        playerID: data.pk.split('#')[1],
        email: data.email,
        fname: data.fname,
        lname: data.lname,
        propic: data.propic,
        region: data.region,
        avatars: {
          r: data.avatars ? data.avatars.r : 'rock1',
          p: data.avatars ? data.avatars.p : 'paper1',
          s: data.avatars ? data.avatars.s : 'scissors1'
        },
        real: true  // Assuming 'real' is true for base player object
      };
      console.log('smah')
      console.log(pdata)


      return pdata
    }
    return null;
  }
  
  // Function to extract player stats
export function extractPlayerStats(data: any, playerId: string): PlayerStats | null {
    if (data.pk === `player#${playerId}` && data.sk.startsWith('dtl#stats')) {
      return {
        wins: data.wins || 0,
        losses: data.losses || 0,
        ties: 0,  // Assuming ties are not provided, but can be added if available
        rocksThrown: data.rocksThrown || 0,
        papersThrown: data.papersThrown || 0,
        scissorsThrown: data.scissorsThrown || 0
      };
    }
    return null;
  }
  
  // Function to extract player tournaments
export function extractPlayerTournaments(data: any, playerId: string): PlayerTournaments | null {
    if (data.pk === `player#${playerId}` && data.sk.startsWith('dtl#tournaments')) {
      console.log('WHERES MY SUPER SUIT')
      console.log(data)
      return {
        played: data.played || [],
        trophies: data.trophies || []
      };
    }
    return null;
  }
  
  // Function to extract player token info
export function extractPlayerTokenInfo(data: any, playerId: string): TokenInfo | null {
    if (data.pk === `player#${playerId}` && data.sk.startsWith('metadata#notif')) {
      return {
        notifToken: data.notifToken,
        deviceID: data.deviceID || ''
      };
    }
    return null;
  }
  
  // Function to extract player unlocks
export function extractPlayerUnlocks(data: any, playerId: string): PlayerUnlocks | null {
    if (data.pk === `player#${playerId}` && data.sk.startsWith('dtl#avatars')) {
      return {
        bonusLives: data.bonusLives || 0,
        avatars: data.avatars.map((id: number) => String(id))  // Convert avatar IDs to strings
      };
    }
    return null;
  }
  
  // Main API call function to handle different endpoints
  