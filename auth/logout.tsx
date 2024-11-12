import React, { useContext } from 'react';
import { Button, FAB, useTheme } from 'react-native-paper';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COGNITO_CONFIG } from 'cognitoConfig';import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { AuthContext } from './authProvider';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const LogoutButton: React.FC<AuthProps> = (props) => { 

  const authContext = useContext(AuthContext);
  const { checkUser, handleLogout } = authContext!
  const { colors } = useTheme()

  const { navigation } = props;
  

  return (
    <FAB style ={{padding: 0, margin: 10, backgroundColor: colors.tertiary}}
          label="Logout" 
          onPress={() =>{handleLogout()}}
          >
    </FAB>

  );
};

export default LogoutButton;
