import Image from "next/image";
import Svg from "../Svg";
import Logo from "../../../assets/images/gecko.png";
import { SvgProps } from "../types";

const Icon = () => {
  return <Image src={Logo} width={32} height={32} />;
};

export default Icon;
