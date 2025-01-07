import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from '../cognitoConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUser = () => {
  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.UserPoolId,
    ClientId: COGNITO_CONFIG.ClientId,
  });

  return userPool.getCurrentUser();
};


export const getCurrentUserDetails = (): Promise<{ email: string | null, sub: string | null }> => {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.UserPoolId,
      ClientId: COGNITO_CONFIG.ClientId,
    });
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve({ email: null, sub: null });
    } else {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
        } else {
          const email = session!.getIdToken().payload.email;
          const sub = session!.getIdToken().payload.sub;

          resolve({ email, sub });
        }
      });
    }
  });
};

export const logout = async () => {
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
};



