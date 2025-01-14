import React, { useContext, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, FAB, Text, HelperText, useTheme } from 'react-native-paper';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COGNITO_CONFIG } from 'cognitoConfig';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { AuthContext } from './authProvider';
import { registerForPushNotificationsAsync } from 'utilities/notificationUtils';

type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const Login: React.FC<AuthProps> = (props) => { 
  const authContext = useContext(AuthContext);


  let { checkUser, setUser, handleLogout } = authContext!;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.UserPoolId,
    ClientId: COGNITO_CONFIG.ClientId,
  });

  const handleLogin = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email.toLowerCase(),
      Password: password,
    });

    const userData = {
      Username: email.toLowerCase(),
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (result) => {

        const userId = result.getIdToken().payload.sub;
        const email = result.getIdToken().payload.email;

        

        
        if (authContext && userId) {
          setUser(`C${userId}`).then((playerData)=>{
            if (playerData) {
              console.log('registering player for push notifications!')
              registerForPushNotificationsAsync(playerData)
              AsyncStorage.setItem('userId', userId);
              AsyncStorage.setItem('email', email);
              }
              else
              {
                console.log('no player data in the database. Issue with sign up process?')
                handleLogout()
                setError('Error fetching player data from Database. Contact +1-860-682-2090 for support.')
              }
          });
          

        }

        // navigation.replace('MainMenu');
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
    });
  };

  return (
    
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <FAB
            style={styles.fab}
            small
            icon="login"
            label="Login"
            onPress={handleLogin}
          />
        </View>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    width: 300,
  },
  fab: {
    marginTop: 20,
    backgroundColor: '#6200ee', // Or any color you prefer
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Login;
