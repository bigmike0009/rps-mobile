import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import RockPaperScissors from '../screens/game';
import Overview from '../screens/overview';

export type RootStackParamList = {
  Overview: undefined;
  Details: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Overview">
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen
          name="Details"
          component={RockPaperScissors}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={navigation.goBack} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}