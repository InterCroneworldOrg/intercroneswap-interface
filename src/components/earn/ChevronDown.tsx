import React from "react";
import Svg from "./Svg";
import { SvgProps } from "./types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="10" height="6" viewBox="0 0 10 6" fill="none" {...props}>
      <path d="M0.999756 1L4.99976 5L8.99976 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
  );
};

export default Icon;
