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
  const { checkUser } = authContext!
  const { colors } = useTheme()

  const { navigation } = props;
  const handleLogout = async () => {
    const userPool = new CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.UserPoolId,
      ClientId: COGNITO_CONFIG.ClientId,
    });

    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('email');
        if (authContext) 
          {
            checkUser()
          };
  };

  return (
    <FAB style ={{padding: 0, margin: 10, backgroundColor: colors.tertiary}}
          label="Logout" 
          onPress={() =>{handleLogout()}}
          >
    </FAB>

  );
};

export default LogoutButton;
