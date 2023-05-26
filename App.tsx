import 'react-native-gesture-handler';
import * as React from 'react';
import Index from './screens/Index';
import {NavigationContainer} from '@react-navigation/native';
import {LoginProvider} from './context/LoginContext';
import AuthProvider from './context/AuthContext';
import {ActivityIndicator} from 'react-native';

const linking = {
  prefixes: ['square://', 'https://pkce-redirect.glitch.me'],
  config: {
    screens: {
      Home: {
        path: 'home',
      },
      Settings: {
        path: 'openapp',
      },
    },
  },
};

export default function App() {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator color="blue" size="large" />}>
      <LoginProvider>
        <AuthProvider>
          <Index />
        </AuthProvider>
      </LoginProvider>
    </NavigationContainer>
  );
}
