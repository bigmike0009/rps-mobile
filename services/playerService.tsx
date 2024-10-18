import { apiService } from './apiService';
import { Matchup, Player } from 'types/types';
import { Tournament } from 'types/types';

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

  // POST create a tournament (takes userID and region)
  async addPlayerToTournament(tourneyID: number, userID: number, region: string): Promise<ApiResponse<Tournament>> {
    const tournamentData = { tourneyID, userID, region };
    console.log(tournamentData)
    return await apiService.post<Tournament>('/tournament', tournamentData);
  }
}

export const tournamentService = new TournamentService();

class PlayerService {
  // GET player by userID or email
  async getPlayer(playerId: string, queryParam: 'userID' | 'email'): Promise<ApiResponse<Player>> {
    const endpoint = `/player?${queryParam}=${playerId}`;
    return await apiService.get<Player>(endpoint);
    
  }

  // POST create player (takes email, first name, last name)
   createPlayer(email: string, fname: string, lname: string):Promise<ApiResponse<Player>> {
    const playerData = { email, fname, lname };
    return apiService.post<Player>('/player', playerData);
  }

  async getRandomPlayer():Promise<Player>{
    let res = await apiService.getBase<any>('https://randomuser.me/api/');

    return {
      playerID: -1,
      email: res.data.results[0].email,
      facebookID: "",
      fname: res.data.results[0].first,
      lname: res.data.results[0].last,
      propic: res.data.results[0].picture,
      real: false,
      region: 'us-east-1',
      tourneys: [], // Array of tournament IDs
      wins: [],     // Array of tournament IDs
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

  async getMatchupFromPlayer(playerID: number, tournamentID: number): Promise<ApiResponse<Matchup>> {
    const endpoint = `/matchup?playerID=${playerID}&tournamentID=${tournamentID}`;
    return await apiService.get<Matchup>(endpoint);
    
  }

  // POST create player (takes email, first name, last name)
   updateMatchup(tableName: string, matchupID: number, selection: string, player: number):Promise<ApiResponse<Matchup>> {
    const playerData = { tableName, matchupID, player, selection };
    return apiService.put<Matchup>('/matchup', playerData);
  }
}

export const matchupService = new MatchupService();
