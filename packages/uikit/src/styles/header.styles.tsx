import styled from "styled-components";
import { Box } from "rebass/styled-components";

export const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align || "center"};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
export const PercentageDiv = styled(Row)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align || "center"};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const HeaderLinks = styled(Row)`
  justify-content: center;
`;

export const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`;
