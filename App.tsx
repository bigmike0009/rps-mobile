import 'react-native-gesture-handler';

import RootStack from './src/navigation';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets   } from 'react-native-safe-area-context';

import { AuthProvider } from '~/providers/authProvider';
import Header from '~/components/HeaderBar';
import { View } from 'react-native';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { theme } from '~/components/theme';
import LoadingScreen from '~/screens/loadingScreen';
import { useEffect, useState } from 'react';
import { AssetProvider } from '~/providers/assetProvider';
import { TournamentProvider } from '~/providers/tournamentProvider';
import { OverlayProvider } from '~/providers/animationProvider';
import { NotificationProvider } from '~/providers/notificationProvider';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = () => {
    setIsLoading(false)
  }

  return (
    <SafeAreaProvider >
      
      <AuthProvider>
        <AssetProvider>
          <NotificationProvider>
        <TournamentProvider>
        <PaperProvider theme={theme}>
          <OverlayProvider>
        {isLoading ? <LoadingScreen onComplete={handleComplete} /> : <RootStack />}
        </OverlayProvider>
        </PaperProvider>
        </TournamentProvider>
        </NotificationProvider>
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

