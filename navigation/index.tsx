import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import RockPaperScissors from '../screens/game';
import MainMenu from '../screens/mainMenu';
import AuthScreen from 'screens/authScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  AuthScreen: undefined;
  RockPaperScissors: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen" >
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />

        <Stack.Screen
          name="RockPaperScissors"
          component={RockPaperScissors}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={navigation.goBack} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
