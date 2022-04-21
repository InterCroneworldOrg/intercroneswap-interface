import styled from 'styled-components';
import { Button, Text } from '@pancakeswap/uikit';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween } from 'components/Layout/Row';

export const Wrapper = styled.div`
  position: relative;
`;

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.colors.primary};
`;
export const MaxButton = styled.button<{ width: string; active?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaQueries.md } {
    padding: 0.25rem 0.5rem;
  }
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  // color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};
  ${({ active, theme }) =>
    active &&
    `
    color:#000;
  background:${theme.colors.primary};
  `}
  :hover {
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

export const PageWrapper = styled(AutoColumn)`
  max-width: 80%;
  width: 100%;
`;

export const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaQueries.md } {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  }
`;

export const ReferalButton = styled(Button)`
  color: rgb(44, 47, 54);
  font-size: 1rem;
  ${({ theme }) => theme.mediaQueries.tab } {
    font-size: .6rem;
    width: 6rem;
  }
`;

export const WordBreakDiv = styled.div`
  word-break: break-all;
  font-size: 1rem;
  ${({ theme }) => theme.mediaQueries.lg } {
    font-size: .7rem;
  }
  color: ${({ theme }) => theme.colors.textSubtle}
`;
