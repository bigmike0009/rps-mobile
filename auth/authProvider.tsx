import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUserDetails, logout } from './authFunctions';
import { Player } from 'types/types';
import { playerService } from 'services/appServices';


interface AuthContextType {
  setUser: (userID: string) => Promise<Player | null>;
  checkUser: (type:string) => Promise<Player | null>;
  handleLogout: () => Promise<void>;
  player: Player | null;
  getOrCreatePlayer : (userID: string, email: string, fname: string, lname: string, region: string, propic: string) => Promise<Player|null>
  updatePlayerAvatar : (userID: string, avType: string, avatar: string) => void

}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null)
  const [playerDataLoading, setPlayerDataLoading] = useState(false)


  useEffect(() => {

    checkUser();
  }, []);

  const updateBasePlayer = (playerData: Player) => {
    const {playerID, email, fname, lname, region, propic, avatars} = playerData
      player ?
      setPlayer((prevPlayer) => ({
        ...prevPlayer!, // Keep previous player data
        playerID, email, fname, lname, region, propic, avatars
      
      })) : setPlayer(playerData);
    
  }

  const fetchPlayer = async (userID: string) => {
    setPlayerDataLoading(true)
    
    const playerRes = await playerService.getPlayer(userID, 'userID');

    if (playerRes.status == 200 && playerRes.data) {
      updateBasePlayer(playerRes.data)
      console.log('Player Data has returned!')
      
  };
    setPlayerDataLoading(false)

    return playerRes.data ? playerRes.data : null


  };

  const fetchPlayerDetail = async (userID: string) => {
    setPlayerDataLoading(true)

    
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
  setPlayerDataLoading(false)
  
  return player.data ? player.data : null


  };

  const fetchPlayerAll = async (userID: string) => {
    setPlayerDataLoading(true)
    
    const player = await playerService.getPlayerAll(userID, 'userID');

    if (player.status == 200) {
      setPlayer(player.data)
      console.log('Player Data has returned!')
      console.log(player)

      
  };
  setPlayerDataLoading(false)
  
  return player.data ? player.data : null


  };

  const createPlayer = async (userID: string, email: string, fname: string, lname: string, region: string = 'us-east-1', propic: string = '') => {
    setPlayerDataLoading(true)

    const player = await playerService.getPlayerAll(userID, 'userID');

    if (player.status == 200 && player.data) {
      updateBasePlayer(player.data)
      console.log('Player Data has returned!')
      console.log(player)

      
  };
  setPlayerDataLoading(false)
  
  return player.data ? player.data : null


  };

  const getOrCreatePlayer = async (userID: string, email: string, fname: string, lname: string, region: string = 'us-east-1', propic: string = '') => {
    setPlayerDataLoading(true)

    const playerData = await playerService.getOrCreatePlayer(userID, email, fname, lname, region, propic)

    if (playerData.status == 200 && playerData.data) {
      updateBasePlayer(playerData.data)
      console.log('Player Data has returned!')
      console.log(player)

      
  };
  setPlayerDataLoading(false)
  
  return playerData.data ? playerData.data : null


  };

  

  const setUser = (userID: string) => {
    return fetchPlayer(userID);
  };

  const checkUser = async (type: string = 'base') => {
    //given the current userID state retrieve data from dynamo
    
    //const { email, sub } = await getCurrentUserDetails();
    //setEmail(email);
    console.log('HERE')
    console.log(player)
    if (player && player.playerID){
      switch(type) {
        case 'all':
          // code block
          console.log('ALL RISE')
          return fetchPlayerAll(player.playerID)
        case 'detail':
          // code block
          console.log('THE DEVIL IS IN')
          return fetchPlayerDetail(player.playerID);
        default:
          return fetchPlayer(player.playerID);
      }
    }
    else {
      console.log('LOGGING OUT')
      //setPlayer(null)
    }
    return null
  };

  const updatePlayerAvatar = async (userID: string, avType: string, avatar: string) => {
    setPlayerDataLoading(true)
    console.log('LETS CATCH UP')

    playerService.updatePlayerAvatar(userID, avType, avatar).then((playerData)=>{

    console.log(playerData.status)

    if (playerData.status == 200 && playerData.data) {
      console.log('NEW SHERIFF')
      updateBasePlayer(playerData.data)
      console.log('Player Data has returned!')
      console.log(player)

      
  };
}).catch((err)=>console.log(err)).finally(()=>setPlayerDataLoading(false))
  
  }

  const handleLogout = async () => {
      setPlayer(null)
    

  };

  return (

    <AuthContext.Provider value={{ setUser, checkUser, handleLogout, player, getOrCreatePlayer, updatePlayerAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
