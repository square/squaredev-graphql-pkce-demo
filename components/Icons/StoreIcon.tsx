import * as React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
const StoreIcon = props => (
  <View>
    <Svg
      style={{marginLeft: 320}}
      xmlns="http://www.w3.org/2000/svg"
      width="400"
      height="400"
      viewBox="0 0 100 100"
      fill="none"
      {...props}>
      <Path
        fill="#000000"
        d="m20 6-1.18-6H1.18L.02 5.8 0 6c0 1.47.81 2.75 2 3.44V16h10V9.44c.38-.22.71-.5 1-.83.73.84 1.8 1.38 3 1.38v6h2V9.43c1.19-.68 2-1.96 2-3.43Zm-2.82-4 .4 2H2.42l.4-2h14.36ZM2 6.09 2.02 6H6c0 1.1-.9 2-2 2-1.07 0-1.95-.85-2-1.91ZM10 14H4v-4c1.2 0 2.27-.54 3-1.38.73.84 1.8 1.38 3 1.38v4Zm0-6c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2Zm4-2h3.98l.02.09A2.009 2.009 0 0 1 16 8c-1.1 0-2-.9-2-2Z"
      />
    </Svg>
  </View>
);
export default StoreIcon;
