import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Gear(props) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.879 1.808a3 3 0 014.242 0l.9.9a1 1 0 00.707.292H16a3 3 0 013 3v1.272a1 1 0 00.293.707l.9.9a3 3 0 010 4.242l-.9.9a1 1 0 00-.293.707V16a3 3 0 01-3 3h-1.272a1 1 0 00-.707.293l-.9.9a3 3 0 01-4.242 0l-.9-.9A1 1 0 007.272 19H6a3 3 0 01-3-3v-1.272a1 1 0 00-.293-.707l-.9-.9a3 3 0 010-4.242l.9-.9A1 1 0 003 7.272V6a3 3 0 013-3h1.272a1 1 0 00.707-.293l.9-.9zm2.828 1.414a1 1 0 00-1.414 0l-.9.9A3 3 0 017.273 5H6a1 1 0 00-1 1v1.272a3 3 0 01-.879 2.121l-.9.9a1 1 0 000 1.414l.9.9A3 3 0 015 14.727V16a1 1 0 001 1h1.272a3 3 0 012.121.879l.9.9a1 1 0 001.414 0l.9-.9a3 3 0 012.121-.88H16a1 1 0 001-1v-1.271a3 3 0 01.879-2.121l.9-.9a1 1 0 000-1.414l-.9-.9A3 3 0 0117 7.273V6a1 1 0 00-1-1h-1.272a3 3 0 01-2.121-.879l-.9-.9z"
        fill="#7B61FF"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 9a2 2 0 100 4 2 2 0 000-4zm-4 2a4 4 0 118 0 4 4 0 01-8 0z"
        fill="#7B61FF"
      />
    </Svg>
  );
}

export default Gear;
