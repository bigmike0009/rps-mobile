import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from '../cognitoConfig';

export const getCurrentUser = () => {
  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.UserPoolId,
    ClientId: COGNITO_CONFIG.ClientId,
  });

  return userPool.getCurrentUser();
};


export const getCurrentUserDetails = (): Promise<{ email: string | null }> => {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.UserPoolId,
      ClientId: COGNITO_CONFIG.ClientId,
    });
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve({ email: null });
    } else {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
        } else {
          const email = session!.getIdToken().payload.email;
          resolve({ email });
        }
      });
    }
  });
};



