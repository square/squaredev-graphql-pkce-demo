import * as React from 'react';
import {View, ImageBackground, StyleSheet} from 'react-native';
import {useLogin} from '../context/LoginContext';
import StyledButton from '../components/StyledButton';

const SignIn = () => {
  const {dispatch} = useLogin();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/neon-nexus.png')}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.button}>
        <StyledButton
          title="Sign In"
          style={styles.innerButton}
          onPress={() => {
            dispatch({type: 'SIGN_IN', token: 'f@k3Tok3n'});
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    top: 420,
    left: 160,
  },
  innerButton: {
    backgroundColor: '#ffa500',
  },
});

export default SignIn;
