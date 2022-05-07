import React from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";
import Logo from "../../assets/images/chessicon.png";
import Image from "next/image";
import { Row } from "../../styles/header.styles";

export interface Props {
  color?: keyof Colors;
  cakePriceUsd?: number;
  showSkeleton?: boolean;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const CakePrice: React.FC<Props> = ({ cakePriceUsd, color = "primary", showSkeleton = true }) => {
  return cakePriceUsd ? (
    <Row width="14rem" justify="flex-end">
      <PriceLink href={`/swap?outputCurrency=0x4f60Ad2c684296458b12053c0EF402e162971e00`} target="_blank">
        <Image src={Logo} alt="logo" width={30} height={30} style={{ marginRight: "4px" }} />
        <Text color={color}>{`$${cakePriceUsd} USD`}</Text>
      </PriceLink>
    </Row>
  ) : showSkeleton ? (
    <Skeleton width={100} height={24} />
  ) : null;
};

export default React.memo(CakePrice);
