import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const StyledButton = ({
  onPress,
  title,
  style,
}: {
  onPress: any;
  title: string;
  style?: any;
}) => {
  return (
    <TouchableOpacity style={{...styles.button, ...style}} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2E8B57',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StyledButton;
