import React, { useEffect } from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';

// Ensure to complete the Auth session in case of a redirect back
WebBrowser.maybeCompleteAuthSession();

// Define the types for response object
interface AuthResponse {
  type: string;
  params: {
    code: string;
  };
}

// Redirect URI (without using `useProxy`)
const redirectUri = AuthSession.makeRedirectUri({
  native: 'fb365748306442104://authorize', // Native scheme for standalone app
});

export default function FacebookAuth() {
  // Define the request and response states using AuthSession
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '365748306442104', // Add a non-null assertion (!) to ensure it's defined
      scopes: ['public_profile', 'email'],
      redirectUri,
    },
    {
      authorizationEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth',
    }
  );

  // Effect to handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
        // `response` is typed as `AuthSession.AuthSessionResult`
        const { params } = response;
        
        if (params.error) {
          Alert.alert('Authentication error', params.error);
        } else if (params.code) {
          Alert.alert('Authentication successful!', `Code: ${params.code}`);
          // Handle the code (e.g., send to your backend to exchange for a token)
        }
      }
  }, [response]);

  return (
    <TouchableOpacity style={styles.button} disabled={!request} onPress={() => promptAsync()}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    countdownContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    countdownText: {
      fontSize: 16,
      marginBottom: 5,
    },
    countdownTimer: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonsContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#4267B2', // Facebook blue color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });