import { apiService } from './apiService';
import { Player } from 'types/types';
import { Tournament } from 'types/types';

interface ApiResponse<T> {
  status: number;
  data: T | null;
}

class TournamentService {
  // GET latest tournament
  async getLatestTournament(): Promise<ApiResponse<Tournament>> {
    return await apiService.get<Tournament>('/tournament');
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
}

export const playerService = new PlayerService();
