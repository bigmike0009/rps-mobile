import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import RockPaperScissors from '../screens/game';
import MainMenu from '../screens/mainMenu';
import AuthScreen from 'screens/authScreen';
import WaitingScreen from 'screens/loading';
import { DefaultStackParamList } from './navigationTypes';
import ResultsScreen from 'screens/resultsScreen';

const Stack = createStackNavigator<DefaultStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu" screenOptions={{headerShown: false, gestureEnabled: false, animationEnabled: true}}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
        

        <Stack.Screen
          name="RockPaperScissors"
          component={RockPaperScissors}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
