import 'react-native-gesture-handler';
import * as React from 'react';
import Home from './Home';
import SignIn from './SignIn';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useLogin} from '../context/LoginContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from './Settings';
import OrderList from './OrderList';
import {SecureGet} from '../helpers';
import {useIsAuthed} from '../context/AuthContext';
import DrawerLogout from '../components/DrawerLogout';

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

  const Drawer = createDrawerNavigator();
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
        // </Stack.Navigator>
        // <Drawer.Navigator initialRouteName="Home" drawerContent={DrawerLogout}>
        //   <Drawer.Screen name="Home" component={Home} />
        //   <Drawer.Screen name="Settings" component={Settings} />
        //   <Drawer.Screen name="Orders" component={OrderList} />
        // </Drawer.Navigator>
      )}
    </>
  );
}
