import Image from "next/image";
import React from "react";
import ChtsLogo from "../../../assets/images/chtslogo.png";

const Icon: React.FC = (props) => {
  return <Image alt="" {...props} src={ChtsLogo} />;
};

export default Icon;
