import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import usePkceOauth from '../helpers/hooks/usePkceOauth';
import StyledButton from '../components/StyledButton';
import GreenCheck from '../components/Icons/Checkmark';
import {useIsAuthed} from '../context/AuthContext';

// OAuth config
const config = {
  clientId: 'sandbox-sq0idb-VN2nl_i2Cm_1_J8iCihwpA',
  redirectUri: 'https://pkce-redirect.glitch.me/openapp',
  scopes: [
    'MERCHANT_PROFILE_READ',
    'EMPLOYEES_READ',
    'ORDERS_READ',
    'CUSTOMERS_READ',
  ],
  serviceConfiguration: {
    authorizationEndpoint:
      'https://connect.squareupsandbox.com/oauth2/authorize',
  },
};

const Settings = ({route, navigation}: {route: any; navigation: any}) => {
  const {triggerLogin, setRouteParams, oauthError} = usePkceOauth(config);
  const {hasToken} = useIsAuthed();

  useEffect(() => {
    // The App has called back into our settings and we need to let
    // our pkce flow know and to obtain a token.
    if (route.params && route.params.state && route.params.code) {
      const {state, code, error, error_description} = route.params;
      // TODO: getting a url fragment on this for some reason.
      // Simply removing the fragment from the value
      const cleanState = state.replace('#_=_', '');
      setRouteParams({state: cleanState, code, error, error_description});
      navigation.setParams({code: null, state: null});
    }
  }, [setRouteParams, route.params, oauthError.didError, navigation]);

  return (
    <View style={styles.container}>
      {oauthError.didError ? (
        <View style={styles.center}>
          <Text style={styles.title}>
            Something went wrong with the OAuth Flow.
          </Text>
          <Text style={styles.subtitle}>Reason: {oauthError.description}</Text>
          <StyledButton title="Try Again" onPress={() => triggerLogin()} />
        </View>
      ) : !hasToken ? (
        <View style={styles.center}>
          <Text style={styles.title}>Authorize Square</Text>
          <Text style={styles.subtitle}>
            Why does our app need access to your Square account?
          </Text>
          <Text style={styles.description}>
            Our app needs access to your Square account to manage staff on your
            behalf. By authorizing our app, you'll be to manage your employees
            directly through our app.
          </Text>
          <StyledButton
            title="Authorize Square"
            onPress={() => triggerLogin()}
          />
        </View>
      ) : (
        <View style={styles.center}>
          <GreenCheck />
          <Text style={styles.title}>You're good to go!</Text>
          <Text style={styles.subtitle}>PKCE OAuth Flow Completed</Text>
          <StyledButton
            title="Go Home"
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5DEB3',
  },
  center: {
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Settings;
