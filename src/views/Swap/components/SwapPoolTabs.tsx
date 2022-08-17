import styled from 'styled-components'
import { darken } from 'polished'
import { useRouter } from 'next/router'
import GlobalSettings from 'components/Menu/GlobalSettings'

const Tabs = styled.div`
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const StyledNavLink = styled.button`
  border-width: 0px;
  background: linear-gradient(90deg, #ffb807 8.49%, #ffea00 100%);
  color: #000000;
  align-items: center;
  justify-content: center;
  height: 55px;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  flex-grow: 3;
  flex-basis: 40%;
  margin-right: 10px;
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
  }
`
const StyledButton = styled.button`
  border-width: 0px;
  background: linear-gradient(90deg, #ffb807 8.49%, #ffea00 100%);
  color: #000000;
  align-items: center;
  justify-content: center;
  height: 55px;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  flex-grow: 1;
  flex-basis: 10%;
  @media (max-width: 768px) {
    width: 20%;
    svg {
      width: 18px;
    }
  }
`

const StyledDisabledNavLink = styled.button`
  border-width: 0px;
  background: #3b3b3b;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  height: 55px;
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
  flex-grow: 3;
  flex-basis: 40%;
  position: relative;

  margin-right: 10px;

  p {
    font-size: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;

    margin-bottom: 20px;
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

// const StyledTabLink = styled(StyledNavLink)<{ isActive: boolean }>`
//   padding: 20px;
//   background: ${({ isActive, theme }) => (isActive ? theme.bg3 : 'transparent')};
// `;

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  const router = useRouter()
  return (
    <Tabs style={{ marginTop: '20px', marginBottom: '20px' }}>
      {active === 'swap' && (
        <>
          <StyledNavLink>Swap</StyledNavLink>

          <StyledDisabledNavLink>
            Professional <p>(Coming Soon)</p>
          </StyledDisabledNavLink>
          <StyledButton>
            <GlobalSettings />
          </StyledButton>
        </>
      )}
      {active === 'pool' && (
        <>
          <StyledDisabledNavLink onClick={() => router.push('/swap')}>Exchange</StyledDisabledNavLink>
          <StyledNavLink>Liquidity</StyledNavLink>
        </>
      )}
    </Tabs>
  )
}
