import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUserDetails, logout } from './authFunctions';
import { Player } from 'types/types';
import { playerService } from 'services/appServices';


interface AuthContextType {
  email: string | null;
  isLoggedIn: boolean;
  setUser: (email: string | null) => void;
  checkUser: () => Promise<Player | null>;
  handleLogout: () => Promise<void>;
  player: Player | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null)

  useEffect(() => {

    checkUser();
  }, []);

  const fetchPlayer = async (userID: string) => {
    
    const player = await playerService.getPlayer(userID, 'userID');

    if (player.status == 200) {
      setPlayer(player.data)
      console.log('Player Data has returned!')
      
  };
    return player.data ? player.data : null


  };

  const fetchPlayerDetail = async (userID: string) => {
    
    const player = await playerService.getPlayerDtl(userID, 'userID');

    if (player.status == 200 && player.data) {
      const { stats, tournaments } = player.data;

    // Update only the stats and tournaments in the state
    setPlayer((prevPlayer) => ({
      ...prevPlayer!, // Keep previous player data
      stats,         // Update stats
      tournaments    // Update tournaments
    }));
      console.log('Player Data has returned!')
      
  };
    return player.data ? player.data : null


  };

  const fetchPlayerAll = async (userID: string) => {
    
    const player = await playerService.getPlayerAll(userID, 'userID');

    if (player.status == 200) {
      setPlayer(player.data)
      console.log('Player Data has returned!')
      
  };
    return player.data ? player.data : null


  };

  const setUser = (email: string | null) => {
    setEmail(email);
    setIsLoggedIn(!!email);
  };

  const checkUser = async () => {
    const { email, sub } = await getCurrentUserDetails();
    setEmail(email);
    setIsLoggedIn(!!email);
    if (!!sub){
      return fetchPlayer('C' + sub);
    }
    else {
      setPlayer(null)
    }
    return null
  };

  const handleLogout = async () => {
      logout().then(()=>checkUser())
    

  };

  return (

    <AuthContext.Provider value={{ email, isLoggedIn, setUser, checkUser, handleLogout, player }}>
      {children}
    </AuthContext.Provider>
  );
};
