import 'react-native-gesture-handler';

import RootStack from './navigation';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets   } from 'react-native-safe-area-context';

import { AuthProvider } from 'providers/authProvider';
import Header from 'components/HeaderBar';
import { View } from 'react-native';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { theme } from 'components/theme';
import LoadingScreen from 'screens/loadingScreen';
import { useEffect, useState } from 'react';
import { AssetProvider } from 'providers/assetProvider';
import { TournamentProvider } from 'providers/tournamentProvider';
import { OverlayProvider } from 'providers/animationProvider';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = () => {
    setIsLoading(false)
  }

  return (
    <SafeAreaProvider >
      
      <AuthProvider>
        <AssetProvider>
        <TournamentProvider>
        <PaperProvider theme={theme}>
          <OverlayProvider>
        {isLoading ? <LoadingScreen onComplete={handleComplete} /> : <RootStack />}
        </OverlayProvider>
        </PaperProvider>
        </TournamentProvider>

        </AssetProvider>
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

