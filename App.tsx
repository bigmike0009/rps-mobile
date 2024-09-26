import 'react-native-gesture-handler';

import RootStack from './navigation';
import { AuthProvider } from 'auth/authProvider';

export default function App() {
  return (
  <AuthProvider>
    <RootStack />
  </AuthProvider>
  );
}
