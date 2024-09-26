// navigationTypes.ts
import { CompositeNavigationProp, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ConfirmSignUp: { email: string }; // If you have a confirmation screen
  Home: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: CompositeNavigationProp<AuthStackNavigationProp>;
  route: RouteProp<AuthStackParamList, T>;
};
