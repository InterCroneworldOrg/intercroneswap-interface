import styled from 'styled-components';

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  // border-style: solid;
  // border: 1px solid ${({ theme }) => theme.colors.background};
  -webkit-appearance: none;

  font-size: 3rem;

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;
