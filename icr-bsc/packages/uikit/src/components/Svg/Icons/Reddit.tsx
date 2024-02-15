import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="31" height="32" viewBox="0 0 31 32" fill="none" {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 0C6.93959 0 0 7.16344 0 16C0 24.8366 6.93959 32 15.5 32C24.0604 32 31 24.8366 31 16C31 7.16344 24.0604 0 15.5 0ZM17.1156 16.7028V25.4077H13.6265V16.7031H11.8833V13.7034H13.6265V11.9024C13.6265 9.4552 14.6108 8 17.4073 8H19.7354V11.0001H18.2802C17.1916 11.0001 17.1195 11.4193 17.1195 12.2017L17.1156 13.7031H19.7519L19.4434 16.7028H17.1156Z" fill="white"/>
    </Svg>
  );
};

export default Icon;
