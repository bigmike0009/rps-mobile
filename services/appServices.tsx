import { apiService } from './apiService';
import { Matchup, MatchupDetail, Player } from 'types/types';
import { Tournament } from 'types/types';
import { extractBasePlayerData, extractPlayerStats, extractPlayerTokenInfo, extractPlayerTournaments, extractPlayerUnlocks } from 'utilities/playerUtils';

interface ApiResponse<T> {
  status: number;
  data: T | null;
}

class TournamentService {
  // GET latest tournament
  async getLatestTournament(): Promise<ApiResponse<Tournament>> {
    return await apiService.get<Tournament>('/next_tournament');
  }

  async getTournament(tournamentID: number): Promise<ApiResponse<Tournament>> {
    return await apiService.get<Tournament>(`/tournament?tournamentID=${tournamentID}`);
  }

  async getAllTournamentsForPlayer(userID: string): Promise<ApiResponse<Record<number,Tournament>>> {
    return await apiService.get<Record<number,Tournament>>(`/player/tournaments?userID=${userID}`);
  }

  async getAllMatchups(tableName: string): Promise<ApiResponse<MatchupDetail[]>> {
    const endpoint = `/bracket?matchupTable=${tableName}`;
    return await apiService.get<MatchupDetail[]>(endpoint);
    
  }

  // POST create a tournament (takes userID and region)
  async addPlayerToTournament(tourneyID: number, userID: string, region: string): Promise<ApiResponse<Tournament>> {
    const tournamentData = { tourneyID, userID, region };
    console.log(tournamentData)
    return await apiService.post<Tournament>('/tournament', tournamentData);
  }
}

export const tournamentService = new TournamentService();

class PlayerService {

  async getPlayerData(playerId: string, queryParam: 'userID', endpoint: string): Promise<ApiResponse<Player>> {
    console.log("WAAAAAAAAP")
    const response = await apiService.get<any[]>(endpoint);
    console.log(response)
    let player: Player = {
      playerID: 'player#C0',
      email: '',
      fname: '',
      lname: '',
      propic: '',
      real: false,
      region: '',
      avatars: { r: '', p: '', s: '' }
    };
    if (response.data) {
      console.log("DATAAAAA")
      response.data.forEach(data => {
        console.log('BURNNN')
      const basePlayer = extractBasePlayerData(data, playerId);
      console.log('BASEcally')
      console.log(basePlayer)
      if (basePlayer) {
        player = { ...player, ...basePlayer };
      }
      console.log('MERGE')
      console.log(player)
  
      const stats = extractPlayerStats(data, playerId);
      if (stats) {
        player.stats = stats;
      }
  
      const tournaments = extractPlayerTournaments(data, playerId);
      if (tournaments) {
        player.tournaments = tournaments;
      }
  
      const tokenInfo = extractPlayerTokenInfo(data, playerId);
      if (tokenInfo) {
        player.tokenInfo = tokenInfo;
      }
  
      const unlocks = extractPlayerUnlocks(data, playerId);
      if (unlocks) {
        player.unlocked = unlocks;
      }
    });

    console.log('FINAL PLAYER')
    console.log(player)
  
    return { data: player, status: 200 };
  }
  return { data: player, status: 404 };
  }

  // GET player by userID or email
  async getPlayer(playerId: string, queryParam: 'userID'): Promise<ApiResponse<Player>> {
  const endpoint = `/player?${queryParam}=${playerId}`;
  return await this.getPlayerData(playerId, queryParam, endpoint);
}

async getPlayerDtl(playerId: string, queryParam: 'userID'): Promise<ApiResponse<Player>> {
  const endpoint = `/player/detail?${queryParam}=${playerId}`;
  return await this.getPlayerData(playerId, queryParam, endpoint);
}

async getPlayerAll(playerId: string, queryParam: 'userID'): Promise<ApiResponse<Player>> {
  const endpoint = `/player/all?${queryParam}=${playerId}`;
  return await this.getPlayerData(playerId, queryParam, endpoint);
}

  // POST create player (takes userID, email, first name, last name)
   createPlayer(userID: string, email: string, fname: string, lname: string, region: string = 'us-east-1', propic: string = ''):Promise<ApiResponse<Player>> {
    const playerData = {userID,  email, fname, lname, region, propic };
    return apiService.post<Player>('/player', playerData);
  }

  getOrCreatePlayer(userID: string, email: string, fname: string, lname: string, region: string = 'us-east-1', propic: string = ''):Promise<ApiResponse<Player>> {
    const playerData = {userID,  email, fname, lname, region, propic };
    return apiService.put<Player>('/player', playerData);
  }



  async getRandomPlayer():Promise<Player>{
    let res = await apiService.getBase<any>('https://randomuser.me/api/');

    return {
      playerID: 'player#-1',
      email: res.data.results[0].email,
      fname: res.data.results[0].first,
      lname: res.data.results[0].last,
      propic: res.data.results[0].picture,
      real: false,
      region: 'us-east-1',
      avatars: {'r':'rock1', 'p':'paper1', 's': 'scissors1'}

    }

  }
}

export const playerService = new PlayerService();

class MatchupService {
  // GET player by userID or email
  async getMatchup(tableName: string, matchupID: number): Promise<ApiResponse<Matchup>> {
    const endpoint = `/matchup?tableName=${tableName}&matchupID=${matchupID}`;
    return await apiService.get<Matchup>(endpoint);
    
  }


  async getMatchupFromPlayer(playerID: string, tournamentID: number): Promise<ApiResponse<Matchup>> {
    const endpoint = `/matchup?playerID=${playerID}&tournamentID=${tournamentID}`;
    return await apiService.get<Matchup>(endpoint);
    
  }

  // POST create player (takes email, first name, last name)
   updateMatchup(tableName: string, matchupID: number, selection: string, player: number, final: boolean):Promise<ApiResponse<Matchup>> {
    const playerData = { tableName, matchupID, player, selection, final };
    return apiService.put<Matchup>('/matchup', playerData);
  }
}

export const matchupService = new MatchupService();

class TokenService {

updateTokenForPlayer(playerID: string, token: string, deviceID: string):Promise<ApiResponse<Number>> {
  const tokenData = { playerID, token, deviceID };
  return apiService.post<Number>('/token', tokenData);
}
}

export const tokenService = new TokenService();

