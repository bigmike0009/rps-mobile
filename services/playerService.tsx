import { apiService } from './apiService';
import { Player } from 'types/types';
import { Tournament } from 'types/types';

class TournamentService {
  // GET latest tournament
  async getLatestTournament(): Promise<Tournament | null> {
    return await apiService.get<Tournament>('/tournament');
  }

  // POST create a tournament (takes userID and region)
  async addPlayerToTournament(tourneyID: number, userID: number, region: string): Promise<Tournament | null> {
    const tournamentData = { tourneyID, userID, region };
    return await apiService.post<Tournament>('/tournament', tournamentData);
  }
}

export const tournamentService = new TournamentService();

class PlayerService {
  // GET player by userID or email
  async getPlayer(playerId: string, queryParam: 'userID' | 'email'): Promise<Player | null> {
    const endpoint = `/player?${queryParam}=${playerId}`;
    return await apiService.get<Player>(endpoint);
  }

  // POST create player (takes email, first name, last name)
  async createPlayer(email: string, fname: string, lname: string): Promise<Player | null> {
    const playerData = { email, fname, lname };
    return await apiService.post<Player>('/player', playerData);
  }
}

export const playerService = new PlayerService();
