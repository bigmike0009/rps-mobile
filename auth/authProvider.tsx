import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUserDetails, logout } from './authFunctions';
import { Player } from 'types/types';
import { playerService } from 'services/appServices';


interface AuthContextType {
  userID: string | null;
  isLoggedIn: boolean;
  setUser: (userID: string) => Promise<Player | null>;
  checkUser: (type:string) => Promise<Player | null>;
  handleLogout: () => Promise<void>;
  player: Player | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userID, setUserID] = useState<string | null>(null);
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
      console.log('WHERE')
      console.log(tournaments)

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
      console.log(player)

      
  };
    return player.data ? player.data : null


  };

  const setUser = (userID: string) => {
    setUserID(userID);
    setIsLoggedIn(!!userID);
    return fetchPlayer(userID);

      
  };

  const checkUser = async (type: string = 'base') => {
    //given the current userID state retrieve data from dynamo
    
    //const { email, sub } = await getCurrentUserDetails();
    //setEmail(email);
    setIsLoggedIn(!!userID);
    if (!!userID){
      switch(type) {
        case 'all':
          // code block
          console.log('ALL RISE')
          return fetchPlayerAll(userID)
        case 'detail':
          // code block
          console.log('THE DEVIL IS IN')
          return fetchPlayerDetail(userID);
        default:
          return fetchPlayer(userID);
      }
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

    <AuthContext.Provider value={{ userID, isLoggedIn, setUser, checkUser, handleLogout, player }}>
      {children}
    </AuthContext.Provider>
  );
};
