import 'react-native-gesture-handler';

import RootStack from './navigation';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets   } from 'react-native-safe-area-context';

import { AuthProvider } from 'auth/authProvider';
import Header from 'components/HeaderBar';
import { View } from 'react-native';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { theme } from 'components/theme';

export default function App() {
  //const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider >
      
      <AuthProvider>
        <PaperProvider theme={theme}>
        <Header></Header>
        <RootStack />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
{/* <SafeAreaView>
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      </SafeAreaView> */}

