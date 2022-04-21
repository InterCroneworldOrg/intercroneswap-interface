import styled from 'styled-components';
import { darken } from 'polished';
import { useRouter } from 'next/router'

const Tabs = styled.div`
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  display: flex;
`;

const StyledNavLink = styled.button
`
  border-width: 0px;
  background-color: ${({ theme }) => theme.colors.primaryBright};
  align-items: center;
  justify-content: center;
  height: 68px;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  flex-grow: 1;
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.colors.primary)};
  }
`;
const StyledDisabledNavLink = styled.button
`
  border-width: 0px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  height: 68px;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  flex-grow: 1;
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.colors.primary)};
  }
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`;


// const StyledTabLink = styled(StyledNavLink)<{ isActive: boolean }>`
//   padding: 20px;
//   background: ${({ isActive, theme }) => (isActive ? theme.bg3 : 'transparent')};
// `;

export function StakeTabs({ active, onClick }: { active: 'stake' | 'unstake', onClick: () => void }) {
  const router = useRouter();
  return (
    <Tabs style={{ marginTop: '20px', marginBottom: '20px' }}>
       { active === 'stake' && (
        <>
            <StyledNavLink>
                Stake
            </StyledNavLink>
            <StyledDisabledNavLink onClick={onClick}>
                Unstake
            </StyledDisabledNavLink>
        </>
       )}
       { active === 'unstake' && (
        <>
            <StyledDisabledNavLink onClick={onClick}>
                Stake
            </StyledDisabledNavLink>
            <StyledNavLink>
                Unstake
            </StyledNavLink>
        </>
       )}
    </Tabs>
  );
}