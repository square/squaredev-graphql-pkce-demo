import React from 'react';
import {View} from 'react-native';

import Svg, {Circle} from 'react-native-svg';

const WrappedSvg = () => (
  <View style={{aspectRatio: 1, backgroundColor: 'blue'}}>
    <Svg height="100%" width="100%" viewBox="0 0 100 100">
      <Circle r="50" cx="50" cy="50" fill="red" />
    </Svg>
  </View>
);

export default WrappedSvg;
