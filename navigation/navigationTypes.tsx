// navigationTypes.ts
import { StackScreenProps } from '@react-navigation/stack';
import { Tournament } from 'types/types';


export type DefaultStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Logout: undefined;
  AuthScreen: undefined;
  RockPaperScissors: {tournament: Tournament};

  MainMenu: undefined;
  WaitingScreen: undefined
  ConfirmSignUp: { email: string }; // If you have a confirmation screen
  Home: undefined;
};

export type LoginProps = StackScreenProps<DefaultStackParamList, 'Login'>;
export type SignUpProps = StackScreenProps<DefaultStackParamList, 'SignUp'>;
export type MainMenuProps = StackScreenProps<DefaultStackParamList, 'MainMenu'>;
export type LogoutProps = StackScreenProps<DefaultStackParamList, 'Logout'>;

