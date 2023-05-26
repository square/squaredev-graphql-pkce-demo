import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {SecureSave} from '../helpers';
import {useIsAuthed} from '../context/AuthContext';
import {useLogin} from '../context/LoginContext';

const DrawerLogout = (props: any) => {
  const {setHasToken} = useIsAuthed();
  const {dispatch} = useLogin();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={async () => {
          setHasToken(false);
          await SecureSave({key: 'squareAccessToken', value: ''});
          await SecureSave({key: 'squareRefreshToken', value: ''});
          dispatch({type: 'SIGN_OUT', token: null});
        }}
      />
    </DrawerContentScrollView>
  );
};

export default DrawerLogout;
