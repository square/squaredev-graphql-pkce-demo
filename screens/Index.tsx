import 'react-native-gesture-handler';
import * as React from 'react';
import Home from './Home';
import SignIn from './SignIn';
import {useLogin} from '../context/LoginContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from './Settings';
import OrderList from './OrderList';
import {SecureGet} from '../helpers';
import {useIsAuthed} from '../context/AuthContext';

export default function Index() {
  const {state} = useLogin();
  const {setHasToken} = useIsAuthed();

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await SecureGet('squareAccessToken');
      setHasToken(!!token);
    };

    checkToken();
  }, [setHasToken]);

  const Stack = createNativeStackNavigator();

  return (
    <>
      {!state.userToken ? (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Orders" component={OrderList} />
        </Stack.Navigator>
      )}
    </>
  );
}
