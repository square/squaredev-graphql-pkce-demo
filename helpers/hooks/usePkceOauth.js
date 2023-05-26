import {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {sha256} from 'react-native-sha256';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SecureSave} from '../../helpers';
import {useIsAuthed} from '../../context/AuthContext';

const generateRandomString = length => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const usePkceOauth = config => {
  // Code Verifier and State created by us
  const [localParams, setLocalParams] = useState({});
  // State and Auth Code returned from Square
  const [routeParams, setRouteParams] = useState({});
  // Track when the token has been received
  const {hasToken, setHasToken} = useIsAuthed();
  // Track an error
  const [oauthError, setOauthError] = useState({
    didError: false,
    description: '',
  });

  useEffect(() => {
    if (routeParams.error) {
      setOauthError({
        didError: true,
        description: routeParams.error_description,
      });
    }
    if (routeParams.code && !hasToken) {
      // If we have the Auth Code from the Authorization flow,
      // we can use this code now to obtain our Access Token
      // We will also need to use our code verifier that we generated
      // for the authorization flow.
      const obtainToken = async () => {
        const tokenResponse = await fetch(
          'https://connect.squareup.com/oauth2/token',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: config.clientId,
              grant_type: 'authorization_code',
              code: routeParams.code,
              code_verifier: localParams.codeVerifier,
              redirect_uri: config.redirectUri,
              short_lived: true,
            }),
          },
        );
        const response = await tokenResponse.json();
        // Save some values for use later in our app. SecureSave lets us store these
        // values encrypted and in a safe manner.
        // Very important to do for Access and Refresh Token.
        await SecureSave({
          key: 'squareAccessToken',
          value: response.access_token,
        });
        await SecureSave({
          key: 'squareRefreshToken',
          value: response.refresh_token,
        });
        await AsyncStorage.setItem('merchantId', response.merchant_id);
        setHasToken(true);
        setOauthError({
          didError: false,
          description: '',
        });
        routeParams.code = null;
      };
      obtainToken();
    }
  }, [config, localParams, routeParams, setHasToken, hasToken]);

  const {clientId, redirectUri, scopes, serviceConfiguration} = config;

  const authorizeUrl = `${
    serviceConfiguration.authorizationEndpoint
  }?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(
    ',',
  )}`;

  const triggerLogin = async () => {
    try {
      const codeVerifier = generateRandomString(64);
      const state = generateRandomString(64);
      const codeChallenge = await sha256(codeVerifier);
      const authorizationUrl = `${authorizeUrl}&state=${state}&code_challenge=${codeChallenge}`;
      setLocalParams({codeVerifier, state});
      Linking.openURL(authorizationUrl);
      setOauthError({
        didError: false,
        description: '',
      });
    } catch (e) {
      setOauthError({
        didError: true,
        description: e,
      });
      console.log('an error happened - check triggerLogin()');
    }
  };

  return {triggerLogin, setRouteParams, oauthError};
};

export default usePkceOauth;
