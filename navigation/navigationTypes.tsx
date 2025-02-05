// navigationTypes.ts
import { StackScreenProps } from '@react-navigation/stack';
import { Matchup, Player, Tournament } from 'types/types';


export type DefaultStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Logout: undefined;
  AuthScreen: undefined;
  Profile: undefined;
  RockPaperScissors: {tournament: Tournament, matchup: Matchup};
  ResultsScreen: {tournament: Tournament, matchup: Matchup, opponent: Player, player1or2: number};
  FinalResultsScreen: {tournament: Tournament, matchup: Matchup, opponent: Player, player1or2: number};
  SpectatorScreen: {tournament: Tournament};
  TrophyRoom: undefined;
  TestScreen: undefined;

  MainMenu: undefined;
  WaitingScreen: undefined
  ConfirmSignUp: { email: string }; // If you have a confirmation screen
  Home: undefined;
};

export type LoginProps = StackScreenProps<DefaultStackParamList, 'Login'>;
export type SignUpProps = StackScreenProps<DefaultStackParamList, 'SignUp'>;
export type MainMenuProps = StackScreenProps<DefaultStackParamList, 'MainMenu'>;
export type LogoutProps = StackScreenProps<DefaultStackParamList, 'Logout'>;

