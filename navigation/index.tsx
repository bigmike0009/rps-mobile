import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RockPaperScissors from '../screens/game';
import MainMenu from '../screens/mainMenu';
import AuthScreen from 'screens/authScreen';
import WaitingScreen from 'screens/loading';
import { DefaultStackParamList } from './navigationTypes';
import ResultsScreen from 'screens/resultsScreen';
import FinalResultsScreen from 'screens/finalResultScreen';
import SpectatorScreen from 'screens/spectator';
import { navigationTheme, theme } from 'components/theme';
import Header from 'components/HeaderBar';

const Stack = createStackNavigator<DefaultStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer theme={navigationTheme} >
      <DynamicHeader />

      <Stack.Navigator  initialRouteName="MainMenu" screenOptions={{headerShown: false, gestureEnabled: false, animationEnabled: true}}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
        <Stack.Screen name="FinalResultsScreen" component={FinalResultsScreen} />
        <Stack.Screen name="SpectatorScreen" component={SpectatorScreen} />



        

        <Stack.Screen
          name="RockPaperScissors"
          component={RockPaperScissors}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DynamicHeader() {
  const routes = useNavigationState((state) => state?.routes);
  console.log(routes)
  const currentRouteName = routes ? routes[routes.length - 1]?.name : 'MainMenu';

  return <Header currentRoute={currentRouteName} />;
}
