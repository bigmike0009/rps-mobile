import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from 'cognitoConfig';
//import { createUserProfile } from './dynamoUtils';
import { SignUpProps } from '../navigation/navigationTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { playerService } from 'services/playerService';


type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const SignUp: React.FC<AuthProps> = (props) => { 

  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false)
  const theme = useTheme();

  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.UserPoolId,
    ClientId: COGNITO_CONFIG.ClientId,
  });

  const handleSignUp = () => {

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];

    userPool.signUp(email.split('@')[0], password, attributeList, [], (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }

      const player = playerService.createPlayer(email, fname, lname)
    player.then(
      (res)=>{
      
      if (res.status == 409){
        setError('Player with this email already exists')
        return
      }
      else if (res.status == 200){
        console.log('Player Created Succesfully')
        setSuccess(true)
      }
    }
  ).catch((res) => {
    setError('Failed to create player: ' + res.data)
    });
      
      
    })
    

    ;
  };

  return (
    
    <View style={styles.container}>
      {success ? <View>
        <Text style={styles.title}>Sign Up email sent to {email}!</Text>
        <Text >Confirm your email in order to login</Text>
      </View>
       :
      <View>
      
      

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="First Name"
        value={fname}
        onChangeText={setFname}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={lname}
        onChangeText={setLname}
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

      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
    </View>
  }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    width: 300
  },
  button: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignUp;
