import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COGNITO_CONFIG } from 'cognitoConfig';import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { AuthContext } from './authProvider';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const LogoutButton: React.FC<AuthProps> = (props) => { 

  const authContext = useContext(AuthContext);
  const { checkUser } = authContext!

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
            if (authContext){
            checkUser()
            }
          };
  };

  return (
    <Button mode="contained" onPress={handleLogout} style={{ margin: 10 }}>
      Logout
    </Button>
  );
};

export default LogoutButton;
