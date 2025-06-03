import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tournamentService } from '~/services/appServices';
import { Tournament } from '~/types/types';

interface TournamentContextProps {
  tournament: Tournament | null;
  fetchTournament: () => Promise<Tournament | null>;
  fetchNewTournament: () => Promise<Tournament | null>;

}

const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  const fetchNewTournament = async () => {
    try {
      const response = await tournamentService.getLatestTournament();
      if (response.status==200 && response.data) {
        setTournament(response.data);
        return response.data
      }
    } catch (error) {
      console.error('Error fetching tournament:', error);
      setTournament(null);
    }
    return null

  };

  const fetchTournament = async () => {
    try {
      const response = tournament ? await tournamentService.getTournament(tournament.tournamentId) : await tournamentService.getLatestTournament();
      if (response.status==200 && response.data) {
        setTournament(response.data);
        return response.data
      }
    } catch (error) {
      console.error('Error fetching tournament:', error);
      setTournament(null);
    }
    return null

  };

//   // Periodically fetch tournament data
//   useEffect(() => {
//     fetchTournament(); // Fetch initially
//     const interval = setInterval(fetchTournament, 5000); // Update every 5 seconds
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

  return (
    <TournamentContext.Provider value={{ tournament, fetchTournament, fetchNewTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};

// Hook to use TournamentContext
export const useTournament = (): TournamentContextProps => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
