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

  const fetchPlayer = async (email: string) => {
    const player = await playerService.getPlayer(email, 'email');
    console.log(player)
    if (player.status == 200) {
      setPlayer(player.data)
      console.log('Player Data has returned!')
      
  };
    if (player.data){
    return player.data
    }
    else{
    return null
    }

  };

  const setUser = (email: string | null) => {
    setEmail(email);
    setIsLoggedIn(!!email);
  };

  const checkUser = async () => {
    console.log('CHECKING')
    const { email } = await getCurrentUserDetails();
    setEmail(email);
    setIsLoggedIn(!!email);
    if (!!email){
      return fetchPlayer(email!);
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
