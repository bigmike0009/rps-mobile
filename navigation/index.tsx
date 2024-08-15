import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import RockPaperScissors from '../screens/game';
import MainMenu from '../screens/mainMenu';

export type RootStackParamList = {
  MainMenu: undefined;
  RockPaperScissors: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu" >
        <Stack.Screen name="MainMenu" component={MainMenu} />
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
