import { TYPE } from '../../theme';
import styled from 'styled-components';
import { RowFixed } from '../Row';

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`;

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void;
  ascending: boolean;
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <TYPE.white fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </TYPE.white>
    </FilterWrapper>
  );
}
