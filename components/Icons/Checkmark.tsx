import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function GreenCheck(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={20} cy={20} r={20} fill="#00B23B" />
      <Path d="M13.056 21.945l4.166 4.444 9.723-12.222" stroke="#fff" />
    </Svg>
  );
}

export default GreenCheck;
