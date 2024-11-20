import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, FAB } from 'react-native-paper';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from 'cognitoConfig';
import { StackScreenProps } from '@react-navigation/stack';
import { DefaultStackParamList } from 'navigation/navigationTypes';
import { playerService } from 'services/appServices';

type AuthProps = StackScreenProps<DefaultStackParamList, 'Login' | 'SignUp' | 'Logout'>;

const SignUp: React.FC<AuthProps> = (props) => {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!+@#$%^&*(),.?":{}|<>]/.test(password);
  const isValid = hasUpperCase && hasNumber && hasSymbol && password.length >= 8;

  const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.UserPoolId,
    ClientId: COGNITO_CONFIG.ClientId,
  });

  const handleSignUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email.toLowerCase(),
      }),
    ];

    userPool.signUp(email.split('@')[0], password, attributeList, [], (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }

      const player = playerService.createPlayer(email.toLowerCase(), fname, lname);
      player
        .then((res) => {
          if (res.status == 409) {
            setError('Player with this email already exists');
            return;
          } else if (res.status == 200) {
            console.log('Player Created Successfully');
            setSuccess(true);
          }
        })
        .catch((res) => {
          setError('Failed to create player: ' + res.data);
        });
    });
  };

  return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {success ? (
              <View>
                <Text style={styles.title}>Sign Up email sent to {email}!</Text>
                <Text>Confirm your email in order to login</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>Sign Up</Text>

                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                <View style={styles.passwordRequirements}>
                  <Text style={[styles.requirement, hasUpperCase && styles.requirementMet, password.length > 0 && !hasUpperCase && {color: 'red'}]}>
                    • One uppercase letter
                  </Text>
                  <Text style={[styles.requirement, hasNumber && styles.requirementMet, password.length > 0 && !hasNumber && {color: 'red'}]}>
                    • One number
                  </Text>
                  <Text style={[styles.requirement, hasSymbol && styles.requirementMet, password.length > 0 && !hasSymbol && {color: 'red'}]}>
                    • One special character
                  </Text>
                  <Text style={[styles.requirement, password.length >= 8 && styles.requirementMet, password.length > 0 && password.length < 8 && {color: 'red'}]}>
                    • Minimum 8 characters
                  </Text>
                </View>

                
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>

                <FAB
            style={styles.fab}
            small
            icon="login"
            label="Sign Up"
            onPress={handleSignUp}
          />
              </View>
            )}
          </View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fab: {
    marginTop: 20,
    backgroundColor: '#6200ee', // Or any color you prefer
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
  button: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordRequirements: {
    marginTop: 10,
    marginBottom: 10,
  },
  requirement: {
    color: 'grey',
  },
  requirementMet: {
    color: 'green', // Highlight met requirements in green
  },
});

export default SignUp;
