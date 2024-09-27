import 'react-native-gesture-handler';

import RootStack from './navigation';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets   } from 'react-native-safe-area-context';

import { AuthProvider } from 'auth/authProvider';
import Header from 'components/HeaderBar';
import { View } from 'react-native';

export default function App() {
  //const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider >
      
      <AuthProvider>
        <Header></Header>
        <RootStack />
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

